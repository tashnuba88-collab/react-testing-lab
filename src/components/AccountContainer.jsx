import React, { useState, useEffect } from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

function AccountContainer() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Load all transactions from the backend when the page first renders
  useEffect(() => {
    fetch("http://localhost:6001/transactions")
      .then((r) => r.json())
      .then((data) => setTransactions(data));
  }, []);

  // Send a new transaction to the backend, then add it to the list on screen
  function postTransaction(newTransaction) {
    fetch("http://localhost:6001/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    })
      .then((r) => r.json())
      .then((data) => setTransactions([...transactions, data]));
  }

  // Remember which field the user picked in the sort dropdown
  function onSort(field) {
    setSortBy(field);
  }

  // Only keep transactions whose description matches the search text
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(search.toLowerCase())
  );

  // Sort the filtered list by the chosen field (A to Z). No field chosen means no sorting.
  const displayedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortBy) return 0;
    return String(a[sortBy]).localeCompare(String(b[sortBy]));
  });

  return (
    <div>
      <Search setSearch={setSearch} />
      <AddTransactionForm postTransaction={postTransaction} />
      <Sort onSort={onSort} />
      <TransactionsList transactions={displayedTransactions} />
    </div>
  );
}

export default AccountContainer;

