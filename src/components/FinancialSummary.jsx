import React, { useMemo } from 'react';
import { formatCurrency } from '../utils/helpers';
import './FinancialSummary.css';

function FinancialSummary({ borrowers }) {
  // We use useMemo so these big calculations only re-run
  // when the 'borrowers' data changes.
  const summary = useMemo(() => {
    let totalReceivable = 0;
    let totalPrincipal = 0;
    let totalInterestCollected = 0;

    // Loop through every borrower
    for (const borrower of borrowers) {
      // Loop through every loan
      for (const loan of borrower.loans) {
        totalPrincipal += loan.principal;
        totalReceivable += loan.remainingBalance;

        // Loop through every transaction to find payments
        for (const tx of loan.transactions) {
          if (tx.type === 'payment') {
            totalInterestCollected += tx.interestPortion;
          }
        }
      }
    }

    return { totalReceivable, totalPrincipal, totalInterestCollected };
  }, [borrowers]);

  return (
    <div className="financial-summary">
      <div className="summary-card">
        <label>Total Receivable</label>
        <strong>{formatCurrency(summary.totalReceivable)}</strong>
      </div>
      <div className="summary-card">
        <label>Total Principal Lent</label>
        <strong>{formatCurrency(summary.totalPrincipal)}</strong>
      </div>
      <div className="summary-card">
        <label>Total Interest Collected</label>
        <strong>{formatCurrency(summary.totalInterestCollected)}</strong>
      </div>
    </div>
  );
}

export default FinancialSummary;