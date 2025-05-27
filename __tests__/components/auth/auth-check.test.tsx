import { render, screen, waitFor } from "@testing-library/react"
import { useRouter } from "next/navigation"
import { AuthCheck } from "@/components/features/auth/auth-check"

// Mock the hooks
const mockUseSession = // TODO: Replace with Supabase auth as jest.Mock
const mockUseRouter = useRouter as jest.Mock

describe("AuthCheck", () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
    })
    mockPush.mockClear()
  })

  it("should show loading state when session is loading", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "loading",
    })

    render(<AuthCheck>Protected Content</AuthCheck>)

    expect(screen.getByText("Carregando...")).toBeInTheDocument()
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
  })

  it("should redirect to login when unauthenticated", async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    })

    render(<AuthCheck>Protected Content</AuthCheck>)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("/login"))
    })
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
  })

  it("should render children when authenticated", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "123",
          name: "Test User",
          email: "test@example.com",
          roles: ["user"],
        },
        expires: "2023-01-01",
      },
      status: "authenticated",
    })

    render(<AuthCheck>Protected Content</AuthCheck>)

    expect(screen.getByText("Protected Content")).toBeInTheDocument()
  })

  it("should redirect to access-denied when missing required role", async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "123",
          name: "Test User",
          email: "test@example.com",
          roles: ["user"],
        },
        expires: "2023-01-01",
      },
      status: "authenticated",
    })

    render(<AuthCheck requiredRole="admin">Protected Admin Content</AuthCheck>)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/access-denied")
    })
    expect(screen.queryByText("Protected Admin Content")).not.toBeInTheDocument()
  })

  it("should render children when user has required role", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "123",
          name: "Test User",
          email: "test@example.com",
          roles: ["admin", "user"],
        },
        expires: "2023-01-01",
      },
      status: "authenticated",
    })

    render(<AuthCheck requiredRole="admin">Protected Admin Content</AuthCheck>)

    expect(screen.getByText("Protected Admin Content")).toBeInTheDocument()
  })
})
