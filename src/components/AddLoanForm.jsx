import React, { useState } from 'react';
import './AddLoanForm.css'; // We'll create this next

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

function AddLoanForm({ borrowerId, onAddLoan, onClose }) {
  // State for each form field
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('15'); // Default 15%
  const [startDate, setStartDate] = useState(getTodayDate());
  const [schedule, setSchedule] = useState('monthly');

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Convert string inputs to numbers
    const principalNum = parseFloat(principal);
    const rateNum = parseFloat(interestRate) / 100; // Convert 15 to 0.15

    // 2. Calculate initial loan values based on your spec
    const originalInterest = principalNum * rateNum;
    const totalDue = principalNum + originalInterest;
    
    // 3. We'll add the complex 'nextSingilDate' logic later
    // For now, let's just set it 30 days from the start date
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + 30);

    // 4. Create the new loan object
    const newLoan = {
      id: `l-${crypto.randomUUID()}`,
      principal: principalNum,
      interestRate: parseFloat(interestRate), // Store as 15
      originalInterest: originalInterest,
      remainingBalance: totalDue,
      startDate: startDate,
      dueDate: dueDate.toISOString().split('T')[0],
      nextSingilDate: dueDate.toISOString().split('T')[0],
      paymentSchedule: schedule,
      transactions: [
        // 5. Create the first "disbursed" transaction
        {
          type: 'loan',
          date: startDate,
          amount: principalNum,
          balance: totalDue,
          note: 'Initial loan',
        },
      ],
    };

    // 6. Call the main function from App.jsx
    onAddLoan(borrowerId, newLoan);
    onClose(); // Close the modal
  };

  return (
    <form onSubmit={handleSubmit} className="add-loan-form">
      <h2>Add New Loan</h2>
      <div className="form-group">
        <label htmlFor="principal">Principal Amount</label>
        <input
          type="number"
          id="principal"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          placeholder="e.g., 10000"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="interest-rate">Interest Rate (%)</label>
        <input
          type="number"
          id="interest-rate"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="start-date">Start Date</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="schedule">Payment Schedule</label>
        <select
          id="schedule"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Create Loan
      </button>
    </form>
  );
}

export default AddLoanForm;