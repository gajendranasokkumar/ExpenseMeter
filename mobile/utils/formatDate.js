export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const MONTH_SHORT_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getCurrentMonth = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[currentMonth];
};

export const getCurrentYear = () => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};

export const computeEndDate = (start, period) => {
  const startDateLocal = new Date(start);
  const end = new Date(startDateLocal);
  if (period === "weekly") {
    end.setDate(end.getDate() + 6);
    return end;
  }
  if (period === "monthly") {
    end.setMonth(end.getMonth() + 1);
    end.setDate(end.getDate() - 1);
    return end;
  }
  if (period === "yearly") {
    end.setFullYear(end.getFullYear() + 1);
    end.setDate(end.getDate() - 1);
    return end;
  }
  return end;
};

