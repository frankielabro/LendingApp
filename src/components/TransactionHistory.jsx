import React from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';
import './TransactionHistory.css';

const getTransactionDetails = (type) => {
  // ... (this helper function is unchanged)
  switch (type) {
    case 'loan':
      return { icon: '💰', label: 'Loan Disbursed', class: 'loan' };
    case 'payment':
      return { icon: '💵', label: 'Payment Received', class: 'payment' };
    case 'interest':
      return { icon: '📈', label: 'Interest Added', class: 'interest' };
    default:
      return { icon: '❔', label: 'Unknown', class: 'unknown' };
  }
};

// 1. RECEIVE THE NEW PROP
function TransactionHistory({ transactions, onDeleteTransaction }) {
  
  // 2. Create a handler function
  const handleDelete = (tx) => {
    // Show a confirmation
    const txLabel = `${getTransactionDetails(tx.type).label} of ${formatCurrency(tx.amount)} on ${formatDate(tx.date)}`;
    if (window.confirm(`Are you sure you want to delete this transaction?\n\n${txLabel}`)) {
      onDeleteTransaction(tx.id);
    }
  };

  return (
    <div className="transaction-history">
      <h4>Transaction History</h4>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul className="transaction-list">
          {transactions.map((tx) => { // 'index' is no longer needed for key
            const details = getTransactionDetails(tx.type);
            return (
              // 3. Use tx.id for the key
              <li key={tx.id} className="transaction-item">
                <div className={`tx-icon ${details.class}`}>{details.icon}</div>
                <div className="tx-info">
                  {/* ... (all the info spans) ... */}
                  <span className="tx-label">{details.label}</span>
                  <span className="tx-date">{formatDate(tx.date)}</span>
                  {tx.type === 'payment' && (
                    <div className="tx-breakdown">
                      <span>
                        (Principal: {formatCurrency(tx.principalPortion)}
                      </span>
                      <span>
                        {' '}Interest: {formatCurrency(tx.interestPortion)})
                      </span>
                    </div>
                  )}
                </div>
                <div className={`tx-amount ${details.class}`}>
                  {/* ... (amount and balance) ... */}
                  {tx.type === 'payment' ? '-' : '+'}
                  {formatCurrency(tx.amount)}
                  <span className="tx-balance">
                    Balance: {formatCurrency(tx.balance)}
                  </span>
                </div>
                {/* 4. ADD THE DELETE BUTTON */}
                {/* We don't allow deleting the initial loan tx */}
                {tx.type !== 'loan' && (
                  <button 
                    className="tx-delete-btn"
                    onClick={() => handleDelete(tx)}
                  >
                    &times;
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TransactionHistory;