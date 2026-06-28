/**
 * Utility to generate a random 6-character password (2 letters + 4 digits).
 * Example: MP2587
 */
export const generatePassword = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  
  let pwd = '';
  for (let i = 0; i < 2; i++) {
    pwd += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 4; i++) {
    pwd += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  
  return pwd;
};
