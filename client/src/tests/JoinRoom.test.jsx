import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import JoinRoom from "../pages/JoinRoom";
import CreateRoom from "../pages/CreateRoom";
import Signup from "../pages/Signup";

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("JoinRoom Page", () => {
  test("1. Shows error on Join without 6-digit code", () => {
    renderWithRouter(<JoinRoom />);
    const joinBtn = screen.getByRole("button", { name: /join/i });
    fireEvent.click(joinBtn);
    expect(screen.getByText(/please enter a 6-digit code/i)).toBeInTheDocument();
  });

  test("2. Displays typed number on button click", () => {
    renderWithRouter(<JoinRoom />);
    const btn = screen.getByRole("button", { name: "5" });
    fireEvent.click(btn);
    expect(screen.getByText("5 _ _ _ _ _")).toBeInTheDocument();
  });
});

describe("CreateRoom Page", () => {
  test("3. Room code is auto-generated and visible", () => {
    renderWithRouter(<CreateRoom />);
    const roomText = screen.getByText(/room code/i);
    expect(roomText).toBeInTheDocument();
  });

  test("4. Allows increasing number of players", () => {
    renderWithRouter(<CreateRoom />);
    const plusButton = screen.getAllByText("+")[0];
    fireEvent.click(plusButton);
    const updatedCount = screen.getAllByText("2");
    expect(updatedCount.length).toBeGreaterThan(0); // Should show 2
  });
});

describe("Signup Page", () => {
  test("5. Shows validation error if no name entered", () => {
    renderWithRouter(<Signup />);
    const signupBtn = screen.getByText("SIGN-UP!");
    fireEvent.click(signupBtn);
    expect(screen.getByText("Enter your name")).toBeInTheDocument();
  });

  test("6. Shows avatar error if none selected for Google signup", () => {
    renderWithRouter(<Signup />);
    const googleBtn = screen.getByText(/Sign Up With Google/i);
    fireEvent.click(googleBtn);
    expect(screen.getByText("Choose an avatar before continuing")).toBeInTheDocument();
  });
});
