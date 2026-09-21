import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import AccountContainer from "../../components/AccountContainer";

const mockTransactions = [
  { id: 1, date: "2024-01-05", description: "Rent", category: "Housing", amount: 900 },
  { id: 2, date: "2024-01-06", description: "Coffee", category: "Treats", amount: 4 },
  { id: 3, date: "2024-01-07", description: "Salary", category: "Income", amount: 1200 },
];

// Returns the description shown in each table row, top to bottom
function getDescriptionsInOrder() {
  return screen
    .getAllByRole("row")
    .slice(1) // skip the header row
    .map((row) => within(row).getAllByRole("cell")[1].textContent);
}

describe("Search and sort transactions", () => {
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

  test("the page updates when a change event is triggered", async () => {
    render(<AccountContainer />);
    await screen.findByText("Rent");

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "Salary" },
    });

    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.queryByText("Rent")).not.toBeInTheDocument();
  });

  test("search filters transactions by description", async () => {
    const user = userEvent.setup();
    render(<AccountContainer />);
    await screen.findByText("Rent");

    await user.type(screen.getByPlaceholderText(/search/i), "cof");

    expect(screen.getByText("Coffee")).toBeInTheDocument();
    expect(screen.queryByText("Rent")).not.toBeInTheDocument();
    expect(screen.queryByText("Salary")).not.toBeInTheDocument();
  });

  test("search ignores upper and lower case", async () => {
    const user = userEvent.setup();
    render(<AccountContainer />);
    await screen.findByText("Rent");

    await user.type(screen.getByPlaceholderText(/search/i), "SALARY");

    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.queryByText("Coffee")).not.toBeInTheDocument();
  });

  test("shows transactions in their original order before sorting", async () => {
    render(<AccountContainer />);
    await screen.findByText("Rent");

    expect(getDescriptionsInOrder()).toEqual(["Rent", "Coffee", "Salary"]);
  });

  test("sorts transactions by description", async () => {
    const user = userEvent.setup();
    render(<AccountContainer />);
    await screen.findByText("Rent");

    await user.selectOptions(screen.getByRole("combobox"), "description");

    expect(getDescriptionsInOrder()).toEqual(["Coffee", "Rent", "Salary"]);
  });

  test("sorts transactions by category", async () => {
    const user = userEvent.setup();
    render(<AccountContainer />);
    await screen.findByText("Rent");

    await user.selectOptions(screen.getByRole("combobox"), "category");

    // Housing (Rent), Income (Salary), Treats (Coffee)
    expect(getDescriptionsInOrder()).toEqual(["Rent", "Salary", "Coffee"]);
  });
});