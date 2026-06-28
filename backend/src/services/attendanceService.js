const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to convert date strings to Prisma DateTime
const parseDate = (dateStr) => new Date(`${dateStr}T00:00:00Z`);
const parseTime = (timeStr) => new Date(`1970-01-01T${timeStr}:00Z`);

// Get date filters based on month and year query params
const getDateFilters = (month, year) => {
  const filters = {};
  if (year) {
    const startYear = new Date(`${year}-01-01T00:00:00Z`);
    const endYear = new Date(`${year}-12-31T23:59:59.999Z`);
    
    if (month) {
      // Month is 1-12
      const paddedMonth = month.toString().padStart(2, '0');
      const nextMonth = parseInt(month) === 12 ? '01' : (parseInt(month) + 1).toString().padStart(2, '0');
      const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : year;
      
      const startMonth = new Date(`${year}-${paddedMonth}-01T00:00:00Z`);
      const endMonth = new Date(`${nextYear}-${nextMonth}-01T00:00:00Z`); // End is exclusive < start of next month
      
      filters.sabhaDate = {
        gte: startMonth,
        lt: endMonth
      };
    } else {
      filters.sabhaDate = {
        gte: startYear,
        lte: endYear
      };
    }
  }
  return filters;
};

const createAttendance = async (data) => {
  const { userId, sabhaDate, sabhaName, startTime, endTime, status } = data;

  // Map SAT_ID to UUID
  const user = await prisma.user.findUnique({
    where: { userId }
  });

  if (!user) {
    const error = new Error(`User with ID ${userId} not found`);
    error.statusCode = 404;
    throw error;
  }

  if (user.status !== 'ACTIVE') {
    const error = new Error(`User ${userId} is INACTIVE`);
    error.statusCode = 403;
    throw error;
  }

  const pSabhaDate = parseDate(sabhaDate);

  // Check unique constraint manually to return a nice message
  const existing = await prisma.attendance.findUnique({
    where: {
      userId_sabhaDate_sabhaName: {
        userId: user.id,
        sabhaDate: pSabhaDate,
        sabhaName
      }
    }
  });

  if (existing) {
    const error = new Error('Attendance record already exists for this user, date, and sabha');
    error.statusCode = 400;
    throw error;
  }

  await prisma.attendance.create({
    data: {
      userId: user.id,
      sabhaDate: pSabhaDate,
      sabhaName,
      startTime: parseTime(startTime),
      endTime: parseTime(endTime),
      status
    }
  });

  return { success: true, message: 'Attendance recorded successfully' };
};

const processBulkAttendance = async (data, status) => {
  const { sabhaDate, sabhaName, startTime, endTime, userIds } = data;

  if (!userIds || !userIds.length) return { successCount: 0, failedCount: 0 };

  // Map all SAT_IDs to UUIDs (only ACTIVE users)
  const users = await prisma.user.findMany({
    where: {
      userId: { in: userIds },
      status: 'ACTIVE'
    },
    select: { id: true, userId: true }
  });

  const validUserIds = users.map(u => u.id);
  const validSatIds = users.map(u => u.userId);
  const failedCount = userIds.length - validUserIds.length;

  if (validUserIds.length === 0) {
    return { successCount: 0, failedCount: userIds.length };
  }

  const attendanceData = validUserIds.map(uuid => ({
    userId: uuid,
    sabhaDate: parseDate(sabhaDate),
    sabhaName,
    startTime: parseTime(startTime),
    endTime: parseTime(endTime),
    status
  }));

  // Prisma createMany with skipDuplicates ensures transaction-like safe inserts
  const result = await prisma.attendance.createMany({
    data: attendanceData,
    skipDuplicates: true
  });

  return {
    successCount: result.count,
    failedCount: failedCount + (validUserIds.length - result.count)
  };
};

const getUserAttendanceHistory = async (userId, month, year) => {
  const user = await prisma.user.findUnique({
    where: { userId }
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const dateFilters = getDateFilters(month, year);

  const records = await prisma.attendance.findMany({
    where: {
      userId: user.id,
      ...dateFilters
    },
    orderBy: { sabhaDate: 'desc' }
  });

  const presentCount = records.filter(r => r.status === 'PRESENT').length;
  const absentCount = records.filter(r => r.status === 'ABSENT').length;
  const total = presentCount + absentCount;
  const attendancePercentage = total === 0 ? 0 : parseFloat(((presentCount / total) * 100).toFixed(2));

  // Map internal UUIDs back to SAT ID format and remove internal IDs
  const formattedRecords = records.map(r => ({
    userId: user.userId,
    fullName: user.fullName,
    status: r.status,
    sabhaDate: r.sabhaDate.toISOString().split('T')[0],
    sabhaName: r.sabhaName
  }));

  return {
    userId: user.userId,
    fullName: user.fullName,
    presentCount,
    absentCount,
    attendancePercentage,
    records: formattedRecords
  };
};

const getAttendanceReport = async (month, year) => {
  const dateFilters = getDateFilters(month, year);

  const aggregate = await prisma.attendance.groupBy({
    by: ['status'],
    where: dateFilters,
    _count: {
      status: true
    }
  });

  let presentCount = 0;
  let absentCount = 0;

  aggregate.forEach(group => {
    if (group.status === 'PRESENT') presentCount = group._count.status;
    if (group.status === 'ABSENT') absentCount = group._count.status;
  });

  const total = presentCount + absentCount;
  const percentage = total === 0 ? 0 : parseFloat(((presentCount / total) * 100).toFixed(2));

  return {
    totalRecords: total,
    presentCount,
    absentCount,
    overallAttendancePercentage: percentage
  };
};

const getMonthlyAttendanceAnalytics = async (year) => {
  const targetYear = year || new Date().getFullYear().toString();
  
  // This approach groups dates entirely in memory because Prisma doesn't natively support grouping by Date parts (month) across all DBs smoothly.
  const filters = getDateFilters(null, targetYear);
  
  const records = await prisma.attendance.findMany({
    where: filters,
    select: {
      sabhaDate: true,
      status: true
    }
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
    month: monthNames[i],
    present: 0,
    absent: 0,
    percentage: 0
  }));

  records.forEach(r => {
    const m = r.sabhaDate.getUTCMonth(); // 0-11
    if (r.status === 'PRESENT') monthlyStats[m].present++;
    if (r.status === 'ABSENT') monthlyStats[m].absent++;
  });

  monthlyStats.forEach(m => {
    const t = m.present + m.absent;
    m.percentage = t === 0 ? 0 : parseFloat(((m.present / t) * 100).toFixed(2));
  });

  // Filter out months with no records if desired, or return all 12
  return monthlyStats.filter(m => m.present > 0 || m.absent > 0);
};

const getTopAttendees = async (month, year) => {
  const dateFilters = getDateFilters(month, year);

  // Fetch all active users and their attendance records
  const users = await prisma.user.findMany({
    where: { status: 'ACTIVE' },
    select: {
      userId: true,
      fullName: true,
      attendances: {
        where: dateFilters,
        select: { status: true }
      }
    }
  });

  const rankedUsers = users.map(user => {
    const presentCount = user.attendances.filter(a => a.status === 'PRESENT').length;
    const absentCount = user.attendances.filter(a => a.status === 'ABSENT').length;
    const total = presentCount + absentCount;
    const attendancePercentage = total === 0 ? 0 : parseFloat(((presentCount / total) * 100).toFixed(2));

    return {
      userId: user.userId,
      fullName: user.fullName,
      presentCount,
      absentCount,
      attendancePercentage,
      totalEvents: total
    };
  });

  // Filter out users with 0 events to not rank ghosts
  const activeAttendees = rankedUsers.filter(u => u.totalEvents > 0);

  // Sort descending by percentage, then by total present count
  activeAttendees.sort((a, b) => {
    if (b.attendancePercentage !== a.attendancePercentage) {
      return b.attendancePercentage - a.attendancePercentage;
    }
    return b.presentCount - a.presentCount;
  });

  return activeAttendees.slice(0, 10);
};

module.exports = {
  createAttendance,
  processBulkAttendance,
  getUserAttendanceHistory,
  getAttendanceReport,
  getMonthlyAttendanceAnalytics,
  getTopAttendees
};
