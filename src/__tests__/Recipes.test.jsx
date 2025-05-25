import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, test, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Recipes from "../pages/Recipes";

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("Recipes", () => {
  test("рендерить заголовок сторінки", () => {
    renderWithRouter(<Recipes />);
    const heading = screen.getByText(/генерація рецептів/i);
    expect(heading).toBeInTheDocument();
  });
});
