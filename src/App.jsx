import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './pages/Dashboard';
import BorrowerDetail from './pages/BorrowerDetail';
import './App.css';

// This is our sample data for development
const mockData = {
  borrowers: [
    {
      id: 'b1',
      name: 'Frodo Baggins',
      loans: [
        {
          id: 'l1',
          principal: 1000,
          interestRate: 15,
          originalInterest: 150,
          remainingBalance: 1150,
          startDate: '2025-10-01',
          dueDate: '2025-10-31',
          nextSingilDate: '2025-10-31',
          paymentSchedule: 'monthly',
          transactions: [
            {
              id: 'tx-m1', // <-- ADDED
              type: 'loan',
              date: '2025-10-01',
              amount: 1000,
              balance: 1150,
            },
          ],
        },
      ],
    },
    {
      id: 'b2',
      name: 'Samwise Gamgee',
      loans: [
        {
          id: 'l2',
          principal: 5000,
          interestRate: 15,
          originalInterest: 750,
          remainingBalance: 5750,
          startDate: '2025-09-15',
          dueDate: '2025-10-15',
          nextSingilDate: '2025-10-15',
          paymentSchedule: 'weekly',
          transactions: [
            {
              id: 'tx-m2', // <-- ADDED
              type: 'loan',
              date: '2025-09-15',
              amount: 5000,
              balance: 5750,
            },
          ],
        },
      ],
    },
  ],
};

// 2. THIS FUNCTION MUST BE HERE
const getInitialData = () => {
  const savedData = localStorage.getItem('lendingAppData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    if (parsedData.borrowers && parsedData.borrowers.length > 0) {
      return parsedData;
    }
  }
  // If no data or empty data, return mock data
  return mockData;
};

// 3. YOUR FULL APP COMPONENT
function App() {
  const [data, setData] = useLocalStorage('lendingAppData', getInitialData());
  const { borrowers } = data; 

  const handleAddBorrower = (name) => {
    const newBorrowerId = `b-${crypto.randomUUID()}`; 
    const newBorrower = {
      id: newBorrowerId,
      name: name,
      loans: [],
    };
    setData((prevData) => ({
      ...prevData,
      borrowers: [...prevData.borrowers, newBorrower],
    }));
    return newBorrowerId;
  };

  const handleAddLoan = (borrowerId, newLoan) => {
    setData((prevData) => {
      const updatedBorrowers = prevData.borrowers.map(borrower => {
        if (borrower.id === borrowerId) {
          return {
            ...borrower,
            loans: [...borrower.loans, newLoan],
          };
        }
        return borrower;
      });
      return { ...prevData, borrowers: updatedBorrowers };
    });
  };

  const handleRecordPayment = (loanId, paymentTransaction) => {
    setData((prevData) => {
      const updatedBorrowers = prevData.borrowers.map(borrower => {
        const updatedLoans = borrower.loans.map(loan => {
          if (loan.id === loanId) {
            const newBalance = loan.remainingBalance - paymentTransaction.amount;
            const finalTransaction = { ...paymentTransaction, id: `tx-${crypto.randomUUID()}`, balance: newBalance };
            return {
              ...loan,
              remainingBalance: newBalance,
              transactions: [...loan.transactions, finalTransaction],
            };
          }
          return loan;
        });
        return { ...borrower, loans: updatedLoans };
      });
      return { ...prevData, borrowers: updatedBorrowers };
    });
  };
  
  const handleAddInterest = (loanId, interestTransaction, newDueDate) => {
    setData((prevData) => {
      const updatedBorrowers = prevData.borrowers.map(borrower => {
        const updatedLoans = borrower.loans.map(loan => {
          if (loan.id === loanId) {
            const newBalance = loan.remainingBalance + interestTransaction.amount;
            const finalTransaction = { ...interestTransaction, id: `tx-${crypto.randomUUID()}`, balance: newBalance };
            return {
              ...loan,
              remainingBalance: newBalance,
              dueDate: newDueDate,
              nextSingilDate: newDueDate,
              transactions: [...loan.transactions, finalTransaction],
            };
          }
          return loan;
        });
        return { ...borrower, loans: updatedLoans };
      });
      return { ...prevData, borrowers: updatedBorrowers };
    });
  };

  // ... (inside your App function, after handleAddInterest)

// 1. ADD THIS FUNCTION
const handleDeleteBorrower = (borrowerId) => {
  setData((prevData) => {
    // We'll filter the borrowers array, keeping everyone
    // *except* the one with the matching ID
    const updatedBorrowers = prevData.borrowers.filter(
      (borrower) => borrower.id !== borrowerId
    );

    return {
      ...prevData,
      borrowers: updatedBorrowers,
    };
  });
};

// ... (inside your App function, after handleDeleteBorrower)

// 1. ADD THIS FUNCTION
const handleEditBorrower = (borrowerId, newName) => {
  setData((prevData) => {
    // Map over the borrowers array
    const updatedBorrowers = prevData.borrowers.map((borrower) => {
      // If we find the right borrower...
      if (borrower.id === borrowerId) {
        // ...return a new object with the updated name
        return { ...borrower, name: newName };
      }
      // Otherwise, return the borrower unchanged
      return borrower;
    });

    return {
      ...prevData,
      borrowers: updatedBorrowers,
    };
  });
};

// ... (inside your App function, after handleEditBorrower)

// 1. ADD THIS FUNCTION
const handleDeleteTransaction = (loanId, transactionId) => {
  setData((prevData) => {
    const updatedBorrowers = prevData.borrowers.map(borrower => {
      const updatedLoans = borrower.loans.map(loan => {
        if (loan.id === loanId) {
          // Found the loan, now find the transaction
          const txIndex = loan.transactions.findIndex(tx => tx.id === transactionId);
          if (txIndex === -1) return loan; // Not found, do nothing

          const transactionToDelete = loan.transactions[txIndex];

          // **SAFETY RULE: Block deleting the initial 'loan' transaction**
          if (transactionToDelete.type === 'loan') {
            alert("Error: Cannot delete the initial loan disbursement. Delete the entire loan instead.");
            return loan;
          }

          // 1. Calculate the "balance impact" to reverse
          // If deleting a payment, balance goes UP.
          // If deleting an interest charge, balance goes DOWN.
          const balanceImpact = transactionToDelete.type === 'payment' 
            ? transactionToDelete.amount 
            : -transactionToDelete.amount;

          // 2. Filter out the deleted transaction
          let updatedTransactions = loan.transactions.filter(
            (tx) => tx.id !== transactionId
          );

          // 3. Recalculate balances for all *subsequent* transactions
          // We start from the index where the item *was*
          for (let i = txIndex; i < updatedTransactions.length; i++) {
            updatedTransactions[i] = {
              ...updatedTransactions[i],
              balance: updatedTransactions[i].balance + balanceImpact,
            };
          }

          // 4. Get the new final remaining balance
          const newRemainingBalance = updatedTransactions.length > 0
            ? updatedTransactions[updatedTransactions.length - 1].balance
            : 0; // Should not happen due to our rule, but safe

          return {
            ...loan,
            remainingBalance: newRemainingBalance,
            transactions: updatedTransactions,
          };
        }
        return loan;
      });
      return { ...borrower, loans: updatedLoans };
    });
    return { ...prevData, borrowers: updatedBorrowers };
  });
};



  return (
    <div className="app-container">
      <Routes>
        <Route 
          path="/" 
          element={
            <Dashboard 
              borrowers={borrowers} 
              onAddBorrower={handleAddBorrower}
            />
          } 
        />
        <Route 
          path="/borrower/:borrowerId" 
          element={
            <BorrowerDetail 
              borrowers={borrowers} 
              onAddLoan={handleAddLoan} 
              onRecordPayment={handleRecordPayment} 
              onAddInterest={handleAddInterest}
              onDeleteBorrower={handleDeleteBorrower}
              onEditBorrower={handleEditBorrower}
              onDeleteTransaction={handleDeleteTransaction}
            />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;