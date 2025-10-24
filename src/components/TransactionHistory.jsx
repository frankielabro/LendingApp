import React from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';
import './TransactionHistory.css';

// Helper to get the right icon and class for each transaction type
const getTransactionDetails = (type) => {
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

function TransactionHistory({ transactions }) {
  return (
    <div className="transaction-history">
      <h4>Transaction History</h4>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul className="transaction-list">
          {transactions.map((tx, index) => {
            const details = getTransactionDetails(tx.type);
            return (
              <li key={index} className="transaction-item">
                <div className={`tx-icon ${details.class}`}>{details.icon}</div>
                <div className="tx-info">
                  <span className="tx-label">{details.label}</span>
                  <span className="tx-date">{formatDate(tx.date)}</span>
                  {/* Show payment breakdown if it's a payment */}
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
                  {/* Payments are negative, others are positive */}
                  {tx.type === 'payment' ? '-' : '+'}
                  {formatCurrency(tx.amount)}
                  <span className="tx-balance">
                    Balance: {formatCurrency(tx.balance)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TransactionHistory;