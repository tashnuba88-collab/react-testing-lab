import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import App from "../components/App";

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("renders the bank heading", async () => {
    render(<App />);

    expect(
      await screen.findByText("The Royal Bank of Flatiron")
    ).toBeInTheDocument();
  });

  test("renders the search box and add transaction button", async () => {
    render(<App />);

    expect(await screen.findByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add transaction/i })
    ).toBeInTheDocument();
  });
});
