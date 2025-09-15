// Simple store to hold SMS data from native notifications
let smsData = null;

export const setSmsData = (data) => {
  smsData = data;
};

export const getSmsData = () => {
  const data = smsData;
  smsData = null; // Clear after reading
  return data;
};

export const hasSmsData = () => {
  return smsData !== null;
};
