import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddBorrowerForm.css';

function AddBorrowerForm({ onAddBorrower, onClose }) {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Stop the page from reloading
    if (!name.trim()) return; // Don't add if name is empty

    // This function (from App.jsx) will create the borrower
    // and return the new borrower's ID
    const newBorrowerId = onAddBorrower(name);

    // Reset the form, close the modal, and navigate to the new page
    setName('');
    onClose();
    navigate(`/borrower/${newBorrowerId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="add-borrower-form">
      <h2>Add New Borrower</h2>
      <div className="form-group">
        <label htmlFor="borrower-name">Full Name</label>
        <input
          type="text"
          id="borrower-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Bilbo Baggins"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Save and Continue
      </button>
    </form>
  );
}

export default AddBorrowerForm;