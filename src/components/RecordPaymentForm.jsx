import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/helpers';
import './RecordPaymentForm.css';

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

function RecordPaymentForm({ loan, onRecordPayment, onClose }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayDate());

  // Calculate payment allocation based on the spec
  // We use 'useMemo' so this only recalculates when 'amount' or 'loan' changes
  const allocation = useMemo(() => {
    const paymentAmount = parseFloat(amount) || 0;
    
    // Cap payment at remaining balance
    const cappedAmount = Math.min(paymentAmount, loan.remainingBalance);

    // Formula from your spec
    const originalTotal = loan.principal + loan.originalInterest;
    const interestRatio = loan.originalInterest / originalTotal;
    
    const interestPortion = cappedAmount * interestRatio;
    const principalPortion = cappedAmount - interestPortion;

    return {
      interestPortion,
      principalPortion,
      totalPayment: cappedAmount,
    };
  }, [amount, loan]);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('--- Handle Submit Clicked ---'); // <-- ADD THIS

    if (allocation.totalPayment <= 0) {
      console.log('STOPPING: Total payment is zero or less'); // <-- ADD THIS
      return;
    }

    console.log('SUCCESS: Calling onRecordPayment and onClose'); // <-- ADD THIS

    // Don't submit if amount is zero
    if (allocation.totalPayment <= 0) return;

    // Create the new transaction object
    const paymentTransaction = {
      type: 'payment',
      date: date,
      amount: allocation.totalPayment,
      interestPortion: allocation.interestPortion,
      principalPortion: allocation.principalPortion,
      // The new balance will be calculated in App.jsx
    };

    // Call the main function from App.jsx
    onRecordPayment(loan.id, paymentTransaction);
    onClose(); // Close the modal
  };

  return (
    <form onSubmit={handleSubmit} className="record-payment-form">
      <h2>Record Payment</h2>
      <p>For Loan {formatCurrency(loan.principal)}</p>
      
      <div className="current-balance-display">
        <span>Remaining Balance:</span>
        <strong>{formatCurrency(loan.remainingBalance)}</strong>
      </div>

      <div className="form-group">
        <label htmlFor="payment-amount">Payment Amount</label>
        <input
          type="number"
          step="0.01"
          id="payment-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 5000"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="payment-date">Payment Date</label>
        <input
          type="date"
          id="payment-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Live breakdown of the payment */}
      {amount > 0 && (
        <div className="payment-breakdown">
          <h4>Payment Allocation</h4>
          <div className="breakdown-row">
            <span>To Interest:</span>
            <span>{formatCurrency(allocation.interestPortion)}</span>
          </div>
          <div className="breakdown-row">
            <span>To Principal:</span>
            <span>{formatCurrency(allocation.principalPortion)}</span>
          </div>
          <div className="breakdown-row total">
            <strong>Total Payment:</strong>
            <strong>{formatCurrency(allocation.totalPayment)}</strong>
          </div>
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={!amount || allocation.totalPayment <= 0}>
        Record Payment
      </button>
    </form>
  );
}

export default RecordPaymentForm;