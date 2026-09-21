import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import AccountContainer from "../../components/AccountContainer";

const mockTransactions = [
  { id: 1, date: "2024-01-05", description: "Groceries", category: "Food", amount: 45.5 },
  { id: 2, date: "2024-01-06", description: "Salary", category: "Income", amount: 1200 },
  { id: 3, date: "2024-01-07", description: "Bus pass", category: "Transport", amount: 30 },
];

describe("Display transactions", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({ json: () => Promise.resolve(mockTransactions) })
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("fetches transactions from the backend on startup", async () => {
    render(<AccountContainer />);

    await screen.findByText("Groceries");

    expect(fetch).toHaveBeenCalledWith("http://localhost:6001/transactions");
  });

  test("displays every transaction on startup", async () => {
    render(<AccountContainer />);

    expect(await screen.findByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Bus pass")).toBeInTheDocument();
  });
});
