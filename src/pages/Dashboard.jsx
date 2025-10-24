import React, { useState, useMemo } from 'react'; // 1. Import useMemo
import { Link } from 'react-router-dom';
import { formatCurrency, getTotalRemaining } from '../utils/helpers';
import Modal from '../components/Modal';
import AddBorrowerForm from '../components/AddBorrowerForm';
import FinancialSummary from '../components/FinancialSummary';
import './Dashboard.css'; 

// --- START HELPER FUNCTIONS ---
// (We put these outside the component since they don't need props)

// Helper to get the earliest 'nextSingilDate' from all of a borrower's loans
const getEarliestSingilDate = (loans) => {
  if (loans.length === 0) return null;
  // Sort loans by date and return the first one
  return loans.map(loan => new Date(loan.nextSingilDate))
              .sort((a, b) => a - b)[0];
};

// Helper to get the most recent transaction date from all loans
const getRecentTransactionDate = (loans) => {
  if (loans.length === 0) return null;
  let mostRecentDate = new Date(0); // Start with a very old date
  
  loans.forEach(loan => {
    loan.transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      if (txDate > mostRecentDate) {
        mostRecentDate = txDate;
      }
    });
  });
  
  return mostRecentDate;
};
// --- END HELPER FUNCTIONS ---


function Dashboard({ borrowers, onAddBorrower }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortType, setSortType] = useState('name'); // 2. Add sort state

  // 3. Use useMemo to create the sorted list
  const sortedBorrowers = useMemo(() => {
    // Create a new array so we don't change the original
    return [...borrowers].sort((a, b) => {
      switch (sortType) {
        case 'singilDate':
          const dateA = getEarliestSingilDate(a.loans);
          const dateB = getEarliestSingilDate(b.loans);
          if (!dateA) return 1; // Put borrowers with no loans at the end
          if (!dateB) return -1;
          return dateA - dateB; // Earliest date first

        case 'recentTransaction':
          const recentA = getRecentTransactionDate(a.loans);
          const recentB = getRecentTransactionDate(b.loans);
          if (!recentA) return 1;
          if (!recentB) return -1;
          return recentB - recentA; // Most recent date first

        case 'name':
        default:
          return a.name.localeCompare(b.name); // A-Z
      }
    });
  }, [borrowers, sortType]); // 4. Re-sort only if these change

  return (
    <div className="dashboard">
      <FinancialSummary borrowers={borrowers} />
      
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      
      <div className="borrower-list-container">
        <div className="list-header">
          <h2>All Borrowers</h2>
          {/* 5. Add the sort dropdown */}
          <div className="sort-container">
            <label htmlFor="sort-by">Sort by:</label>
            <select 
              id="sort-by"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="singilDate">Singil Date (Earliest)</option>
              <option value="recentTransaction">Recent Transaction</option>
            </select>
          </div>
        </div>
        
        <div className="borrower-list">
          {/* 6. Map over the NEW sortedBorrowers array */}
          {sortedBorrowers.map((borrower) => (
            <Link 
              key={borrower.id} 
              to={`/borrower/${borrower.id}`} 
              className="borrower-card-link"
            >
              <div className="borrower-card">
                <div className="borrower-info">
                  <h3>{borrower.name}</h3>
                  <p>{borrower.loans.length} {borrower.loans.length > 1 ? 'loans' : 'loan'}</p>
                </div>
                <div className="borrower-balance">
                  <p>Remaining Balance</p>
                  <strong>{formatCurrency(getTotalRemaining(borrower.loans))}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <button className="fab" onClick={() => setIsModalOpen(true)}>
        +
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddBorrowerForm 
          onAddBorrower={onAddBorrower}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;