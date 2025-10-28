export async function getAdminToken(): Promise<string | null> {
  if (typeof window === "undefined") return null
  return localStorage.getItem("adminToken")
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.ok
  } catch {
    return false
  }
}

export function clearAdminToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken")
  }
}
