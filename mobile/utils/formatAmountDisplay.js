export const formatAmountDisplay = (amount) => {
  // return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    style: 'currency',
    currency: 'INR',
  });
}
