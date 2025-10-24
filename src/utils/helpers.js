// This function formats our currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// This function gets the total remaining balance for a list of loans
export const getTotalRemaining = (loans) => {
  return loans.reduce((total, loan) => total + loan.remainingBalance, 0);
};

// This function formats dates
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};