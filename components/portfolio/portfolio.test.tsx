import {
  render,
  screen,
  cleanup,
  within,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ProjectGallery } from "./projects";
import { PortfolioNavigation } from "./navigation";
import { PortfolioMotion, useQuietMotion } from "./motion";

beforeAll(() => {
  window.scrollTo = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});

afterEach(cleanup);

describe("portfolio interactions", () => {
  it("filters projects and restores every original project and destination", async () => {
    const user = userEvent.setup();
    render(<ProjectGallery />);
    expect(screen.getAllByRole("article")).toHaveLength(10);
    expect(
      screen.getByRole("link", { name: "Visit CredentID" }),
    ).toHaveAttribute("href", "https://credentid.vercel.app/");
    expect(
      screen.queryByRole("link", { name: "Visit Auto Food Polling Bot" }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Products & platforms" }),
    );
    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(screen.getByRole("heading", { name: "Qanari" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "ViFive" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Experiments" }));
    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(
      screen.getByRole("heading", { name: "Auto Food Polling Bot" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "CredentID" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "All work" }));
    expect(screen.getAllByRole("article")).toHaveLength(10);
    expect(screen.getByRole("button", { name: "All work" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("lets keyboard users cancel a drag without changing the gallery", async () => {
    const user = userEvent.setup();
    render(<ProjectGallery />);
    const handle = screen.getByRole("button", { name: "Reorder CredentID" });
    handle.focus();
    await user.keyboard("[Space]");
    await user.keyboard("[Escape]");
    expect(screen.getAllByRole("article")).toHaveLength(10);
    expect(
      within(screen.getAllByRole("article")[0]).getByRole("heading", {
        name: "CredentID",
      }),
    ).toBeInTheDocument();
    expect(handle).toHaveFocus();
  });

  it("closes mobile navigation on Escape and restores toggle focus", async () => {
    const user = userEvent.setup();
    render(<PortfolioNavigation />);
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const mobile = screen.getByRole("navigation", {
      name: "Mobile portfolio navigation",
    });
    expect(within(mobile).getByRole("link", { name: "Work" })).toHaveFocus();
    await user.keyboard("[Escape]");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("closes mobile navigation when an anchor is selected", async () => {
    const user = userEvent.setup();
    render(<PortfolioNavigation />);
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const mobile = screen.getByRole("navigation", {
      name: "Mobile portfolio navigation",
    });
    fireEvent.click(within(mobile).getByRole("link", { name: "Experience" }));
    expect(
      screen.getByRole("button", { name: "Open navigation" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("pauses and resumes decorative motion from the visible control", async () => {
    const user = userEvent.setup();
    function MotionProbe() {
      return (
        <span>
          {useQuietMotion() ? "Animations paused" : "Animations playing"}
        </span>
      );
    }
    render(
      <PortfolioMotion>
        <MotionProbe />
      </PortfolioMotion>,
    );
    await user.click(screen.getByRole("button", { name: "Pause animations" }));
    expect(screen.getByText("Animations paused")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enable animations" }),
    ).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Enable animations" }));
    expect(screen.getByText("Animations playing")).toBeInTheDocument();
  });
});
