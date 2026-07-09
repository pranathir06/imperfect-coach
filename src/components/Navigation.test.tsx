import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navigation from "@/components/Navigation";

vi.mock("@/context/UserContext", () => ({
  useUser: () => ({
    logout: vi.fn(),
    dailyFeeling: null,
  }),
}));

vi.mock("@/components/FeelingSelector", () => ({
  default: () => <div data-testid="feeling-selector" />,
}));

describe("Navigation", () => {
  it("renders a chat button at the top right", () => {
    render(
      <MemoryRouter>
        <Navigation userName="Taylor" />
      </MemoryRouter>
    );

    const chatButton = screen.getByRole("button", { name: "Chat" });
    expect(chatButton).toBeInTheDocument();
  });
});
