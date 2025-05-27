import { render, screen, waitFor } from "@testing-library/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AuthCheck } from "@/components/features/auth/auth-check"

// Mock the hooks
const mockUseSession = useSession as jest.Mock
const mockUseRouter = useRouter as jest.Mock

describe("AuthCheck", () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
    })
  })

  it("should show loading state when session status is loading", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "loading",
    })

    render(<AuthCheck>Protected Content</AuthCheck>)

    expect(screen.getByText("Carregando...")).toBeInTheDocument()
  })

  it("should render children when user is authenticated", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "123", name: "Test User" } },
      status: "authenticated",
    })

    render(<AuthCheck>Protected Content</AuthCheck>)

    expect(screen.getByText("Protected Content")).toBeInTheDocument()
  })

  it("should redirect to login when user is not authenticated", async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    })

    // Mock window.location
    Object.defineProperty(window, "location", {
      value: { href: "http://localhost:3000/dashboard" },
      writable: true,
    })

    render(<AuthCheck>Protected Content</AuthCheck>)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("/login?callbackUrl="))
    })
  })

  it("should redirect to access denied when user does not have required role", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "123", name: "Test User", roles: ["user"] } },
      status: "authenticated",
    })

    render(<AuthCheck requiredRole="admin">Protected Admin Content</AuthCheck>)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/access-denied")
    })
  })

  it("should render children when user has required role", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "123", name: "Test User", roles: ["admin"] } },
      status: "authenticated",
    })

    render(<AuthCheck requiredRole="admin">Protected Admin Content</AuthCheck>)

    expect(screen.getByText("Protected Admin Content")).toBeInTheDocument()
  })
})
