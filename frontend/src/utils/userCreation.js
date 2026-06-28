import { generateUserId } from './generateUserId';
import { generatePassword } from './generatePassword';

/**
 * Simulates user creation by generating credentials.
 * 
 * @param {string} fullName 
 * @param {string} username 
 * @param {Array} existingUsers
 * @returns {Object} New user object with credentials
 */
export const createUser = (fullName, username, existingUsers = []) => {
  const existingIds = existingUsers.map(u => u.userId);
  const userId = generateUserId(existingIds);
  const password = generatePassword();
  
  return {
    id: Date.now().toString(), // unique mock ID
    userId,
    username,
    fullName,
    password,
    role: 'USER',
    status: 'Active',
    attendancePercentage: 0
  };
};
