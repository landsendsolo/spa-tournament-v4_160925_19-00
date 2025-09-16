// src/components/Greeting.test.tsx

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Greeting } from "./Greeting";

describe("Greeting Component", () => {
  it("should render Hello, World! when no name is provided", () => {
    // 1. Render the component
    render(<Greeting />);

    // 2. Find the element on the screen
    const headingElement = screen.getByRole("heading", {
      name: /Hello, World!/i,
    });

    // 3. Assert that the element exists
    expect(headingElement).toBeInTheDocument();
  });

  it("should render Hello, {name}! when a name is provided", () => {
    const name = "Steven";
    render(<Greeting name={name} />);

    const headingElement = screen.getByRole("heading", {
      name: `Hello, ${name}!`,
    });

    expect(headingElement).toBeInTheDocument();
  });
});
