import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Measurements from "../components/profile/Measurements";
import "@testing-library/jest-dom";

describe("Measurements", () => {
  test("відображає заголовок та поля", () => {
    render(
      <Measurements
        weight=""
        setWeight={() => {}}
        height=""
        setHeight={() => {}}
        history={[]}
        onSave={() => {}}
      />
    );

    expect(screen.getByRole("heading", { name: /виміри тіла/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/вага/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/зріст/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /зберегти/i })).toBeInTheDocument();
  });

  test("натискання кнопки збереження викликає onSave", () => {
    const onSaveMock = vi.fn();

    render(
      <Measurements
        weight="72"
        setWeight={() => {}}
        height="180"
        setHeight={() => {}}
        history={[]}
        onSave={onSaveMock}
      />
    );

    const button = screen.getByRole("button", { name: /зберегти/i });
    fireEvent.click(button);

    expect(onSaveMock).toHaveBeenCalled();
  });
});
