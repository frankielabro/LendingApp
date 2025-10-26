import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { formatCurrency, getTotalRemaining } from '../utils/helpers';
import LoanCard from '../components/LoanCard';
import Modal from '../components/Modal';
import AddLoanForm from '../components/AddLoanForm';
import EditBorrowerForm from '../components/EditBorrowerForm'; // 1. Import Edit Form
import './BorrowerDetail.css';

// 2. RECEIVE THE NEW PROP
function BorrowerDetail({ borrowers, onAddLoan, onRecordPayment, onAddInterest, onDeleteBorrower, onEditBorrower,onDeleteTransaction }) {
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 3. Add new modal state
  const { borrowerId } = useParams();
  const navigate = useNavigate();
  const borrower = borrowers.find(b => b.id === borrowerId);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${borrower.name}? This action cannot be undone.`)) {
      onDeleteBorrower(borrower.id);
      navigate('/');
    }
  };

  if (!borrower) {
    return (
      <div className="borrower-detail">
        <Link to="/" className="back-link">&larr; Back to Dashboard</Link>
        <h1>Borrower not found.</h1>
        <p>They may have been deleted. <Link to="/">Go back home</Link>.</p>
      </div>
    );
  }

  return (
    <div className="borrower-detail">
      <Link to="/" className="back-link">&larr; Back to Dashboard</Link>
      
      <header className="detail-header">
        {/* 4. Add an Edit button next to the name */}
        <div className="detail-header-top">
          <h1>{borrower.name}</h1>
          <button 
            className="btn btn-secondary btn-edit"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </button>
        </div>
        <div className="header-balance">
          <p>Total Remaining Balance</p>
          <strong>{formatCurrency(getTotalRemaining(borrower.loans))}</strong>
        </div>
      </header>
      
      <div className="detail-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => setIsLoanModalOpen(true)}
        >
          Add New Loan
        </button>
        <button 
          className="btn btn-danger" 
          onClick={handleDelete}
        >
          Delete Borrower
        </button>
      </div>

      <h2>Loans</h2>
      {/* ... (rest of the file is the same) ... */}
      <div className="loan-list">
        {borrower.loans.length === 0 ? (
          <p className="empty-state">This borrower has no loans yet.</p>
        ) : (
          borrower.loans.map((loan, index) => (
            <LoanCard 
              key={loan.id} 
              loan={loan} 
              index={index}
              onRecordPayment={onRecordPayment}
              onAddInterest={onAddInterest}
              onDeleteTransaction={onDeleteTransaction}
            />
          ))
        )}
      </div>

      {/* Add Loan Modal (already here) */}
      <Modal isOpen={isLoanModalOpen} onClose={() => setIsLoanModalOpen(false)}>
        <AddLoanForm
          borrowerId={borrower.id}
          onAddLoan={onAddLoan}
          onClose={() => setIsLoanModalOpen(false)}
        />
      </Modal>

      {/* 5. ADD THE NEW EDIT MODAL */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditBorrowerForm
          borrower={borrower}
          onEditBorrower={onEditBorrower}
          onClose={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default BorrowerDetail;