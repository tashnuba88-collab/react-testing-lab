import React from "react";

function AddTransactionForm({ postTransaction }) {
  // Read each input through form.elements, which works in browsers and in jsdom tests
  function submitForm(e) {
    e.preventDefault();
    const form = e.target.elements;
    const newTransaction = {
      date: form.date.value,
      description: form.description.value,
      category: form.category.value,
      amount: form.amount.value,
    };
    postTransaction(newTransaction);
  }

  return (
    <div className="ui segment">
      <form className="ui form" onSubmit={(e) => submitForm(e)}>
        <div className="inline fields">
          <input type="date" name="date" />
          <input type="text" name="description" placeholder="Description" />
          <input type="text" name="category" placeholder="Category" />
          <input type="number" name="amount" placeholder="Amount" step="0.01" />
        </div>
        <button className="ui button" type="submit">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;
