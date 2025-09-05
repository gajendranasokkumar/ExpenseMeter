export const getCurrentMonth = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[currentMonth];
};

export const getPreviousMonth = (month) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const previousMonth = monthNames.indexOf(month) - 1;
  return monthNames[previousMonth];
};

export const getMonthIndex = (month) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames.indexOf(month);
};