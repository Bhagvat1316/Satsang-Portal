// Reusable User DTO to ensure sensitive fields like passwords are never leaked
const sanitizeUser = (user) => {
  if (!user) return null;
  
  return {
    id: user.id,
    userId: user.userId,
    fullName: user.fullName,
    username: user.username,
    email: user.email || null,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt || undefined,
    updatedAt: user.updatedAt || undefined
  };
};

const sanitizeUsers = (users) => {
  if (!Array.isArray(users)) return [];
  return users.map(sanitizeUser);
};

module.exports = {
  sanitizeUser,
  sanitizeUsers
};
