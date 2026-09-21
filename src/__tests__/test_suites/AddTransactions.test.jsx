import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import AccountContainer from "../../components/AccountContainer";

const mockTransactions = [
  { id: 1, date: "2024-01-05", description: "Groceries", category: "Food", amount: 45.5 },
  { id: 2, date: "2024-01-06", description: "Salary", category: "Income", amount: 1200 },
];

describe("Add transactions", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url, options) => {
        if (options && options.method === "POST") {
          return Promise.resolve({
            json: () =>
              Promise.resolve({ id: 99, ...JSON.parse(options.body) }),
          });
        }
        return Promise.resolve({ json: () => Promise.resolve(mockTransactions) });
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // Fills in every field of the form and clicks the submit button
  async function fillAndSubmitForm(container, user) {
    fireEvent.change(container.querySelector('input[name="date"]'), {
      target: { value: "2024-03-01" },
    });
    await user.type(screen.getByPlaceholderText("Description"), "Coffee");
    await user.type(screen.getByPlaceholderText("Category"), "Food");
    await user.type(screen.getByPlaceholderText("Amount"), "3.5");
    await user.click(screen.getByRole("button", { name: /add transaction/i }));
  }

  test("adds a new transaction to the page", async () => {
    const user = userEvent.setup();
    const { container } = render(<AccountContainer />);
    await screen.findByText("Groceries");

    await fillAndSubmitForm(container, user);

    expect(await screen.findByText("Coffee")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });

  test("calls the POST request with the new transaction", async () => {
    const user = userEvent.setup();
    const { container } = render(<AccountContainer />);
    await screen.findByText("Groceries");

    await fillAndSubmitForm(container, user);
    await screen.findByText("Coffee");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:6001/transactions",
      expect.objectContaining({ method: "POST" })
    );
  });
});