import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/helpers';
import './AddInterestForm.css'; // We'll create this next

// Helper to get today's date
const getTodayDate = () => new Date().toISOString().split('T')[0];

function AddInterestForm({ loan, onAddInterest, onClose }) {
  // 1. Calculate the suggested interest (15% of remaining balance)
  const suggestedInterest = useMemo(() => {
    return loan.remainingBalance * 0.15;
  }, [loan.remainingBalance]);

  // 2. State for the form fields
  const [interestAmount, setInterestAmount] = useState(
    suggestedInterest.toFixed(2) // Pre-fill with the suggestion
  );
  const [date, setDate] = useState(getTodayDate());

  // 3. Calculate the new due date (30 days from the date interest is added)
  const newDueDate = useMemo(() => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 30);
    return newDate.toISOString().split('T')[0];
  }, [date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(interestAmount);
    if (amountNum <= 0) return;

    // 4. Create the new transaction object
    const interestTransaction = {
      type: 'interest',
      date: date,
      amount: amountNum,
      note: 'Late payment interest',
    };

    // 5. Call the main function from App.jsx
    onAddInterest(loan.id, interestTransaction, newDueDate);
    onClose(); // Close the modal
  };

  return (
    <form onSubmit={handleSubmit} className="add-interest-form">
      <h2>Add Late Payment Interest</h2>
      <p>For Loan {formatCurrency(loan.principal)}</p>

      <div className="current-balance-display">
        <span>Remaining Balance:</span>
        <strong>{formatCurrency(loan.remainingBalance)}</strong>
      </div>

      <div className="form-group">
        <label htmlFor="interest-date">Interest Date</label>
        <input
          type="date"
          id="interest-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="interest-amount">Interest Amount (Suggested: {formatCurrency(suggestedInterest)})</label>
        <input
          type="number"
          step="0.01"
          id="interest-amount"
          value={interestAmount}
          onChange={(e) => setInterestAmount(e.target.value)}
          required
        />
      </div>

      <div className="new-due-date-display">
        <span>New Due Date:</span>
        <strong>{formatDate(newDueDate)}</strong>
      </div>

      <button type="submit" className="btn btn-primary">
        Add Interest to Balance
      </button>
    </form>
  );
}

// We need formatDate, so let's import it
import { formatDate } from '../utils/helpers';
export default AddInterestForm;