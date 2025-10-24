import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';
import TransactionHistory from './TransactionHistory';
import Modal from './Modal';
import RecordPaymentForm from './RecordPaymentForm';
import AddInterestForm from './AddInterestForm'; // 1. Import
import './LoanCard.css';

// 2. RECEIVE THE NEW PROP
function LoanCard({ loan, index, onRecordPayment, onAddInterest }) {
  // 3. Add modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false); // New state
  
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="loan-card">
      <header className="loan-card-header">
        <h3>Loan {index + 1}</h3>
        <div className="loan-card-balance">
          <p>Remaining Balance</p>
          <strong>{formatCurrency(loan.remainingBalance)}</strong>
        </div>
      </header>

      <div className="loan-card-details">
        {/* ... details grid ... */}
        <div>
          <label>Principal</label>
          <p>{formatCurrency(loan.principal)}</p>
        </div>
        <div>
          <label>Interest Rate</label>
          <p>{loan.interestRate}%</p>
        </div>
        <div>
          <label>Next Singil Date</label>
          <p>{formatDate(loan.nextSingilDate)}</p>
        </div>
        <div>
          <label>Schedule</label>
          <p>{capitalize(loan.paymentSchedule)}</p>
        </div>
      </div>

      <div className="loan-card-actions">
        <button 
          className="btn btn-primary"
          onClick={() => setIsPaymentModalOpen(true)}
        >
          Record Payment
        </button>
        {/* 4. Hook up the new button's onClick */}
        <button 
          className="btn btn-secondary"
          onClick={() => setIsInterestModalOpen(true)}
        >
          Add Interest
        </button>
      </div>

      <TransactionHistory transactions={loan.transactions} />

      {/* Payment Modal (already here) */}
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)}>
        <RecordPaymentForm
          loan={loan}
          onRecordPayment={onRecordPayment}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      </Modal>

      {/* 5. ADD THE NEW INTEREST MODAL */}
      <Modal isOpen={isInterestModalOpen} onClose={() => setIsInterestModalOpen(false)}>
        <AddInterestForm
          loan={loan}
          onAddInterest={onAddInterest}
          onClose={() => setIsInterestModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default LoanCard;