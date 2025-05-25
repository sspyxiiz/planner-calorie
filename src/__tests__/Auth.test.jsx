import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Auth from "../pages/Auth";
import "@testing-library/jest-dom";

vi.mock("../services/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(() =>
        Promise.resolve({ error: { message: "Invalid credentials" } })
      ),
      signUp: vi.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("Auth page", () => {
  test("показує помилку при неправильному паролі або email", async () => {
    renderWithRouter(<Auth />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/пароль/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /увійти/i }));

    const errorMsg = await screen.findByText(/invalid credentials/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
