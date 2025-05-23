import { auth } from "@/auth"

// Export the auth function as getServerSession for compatibility
export const getServerSession = auth

export * from "./permissions"