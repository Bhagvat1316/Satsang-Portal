export const generateUserId = (existingIds = []) => {
  let maxId = 1000;
  
  existingIds.forEach(idStr => {
    if (idStr.startsWith('SAT')) {
      const num = parseInt(idStr.replace('SAT', ''), 10);
      if (!isNaN(num) && num > maxId) {
        maxId = num;
      }
    }
  });
  
  return `SAT${maxId + 1}`;
};
