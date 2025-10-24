import React, { useState } from 'react';
import './AddBorrowerForm.css'; // We can reuse the same CSS!

function EditBorrowerForm({ borrower, onEditBorrower, onClose }) {
  // 1. Pre-fill the form with the borrower's current name
  const [name, setName] = useState(borrower.name);

  const handleSubmit = (e) => {
    e.preventDefault(); // Stop the page from reloading
    if (!name.trim()) return; // Don't save if name is empty

    // 2. Call the new edit function from App.jsx
    onEditBorrower(borrower.id, name);

    // 3. Close the modal
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="add-borrower-form">
      <h2>Edit Borrower</h2>
      <div className="form-group">
        <label htmlFor="borrower-name">Full Name</label>
        <input
          type="text"
          id="borrower-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Save Changes
      </button>
    </form>
  );
}

export default EditBorrowerForm;