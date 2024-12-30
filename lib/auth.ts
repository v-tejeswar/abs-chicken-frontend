import { BillingForm, User, UserResponse } from "./types";

// Helper function to check if the code is running in the browser
export function isBrowser() {
  return typeof window !== "undefined";
}

// Function to log in the user and store their data
export async function login(email: string, password: string): Promise<UserResponse> {
  try {
    const response = await fetch("http://44.211.216.122:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Include cookies for session management if needed
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    const user: User = data.user;
    const history: History = data.history;
    const reports: BillingForm = data.reports;
    const accessToken = data.access;
    const refreshToken = data.refresh;
    user.email = email;

    // Store user data and tokens in localStorage or cookies
    if (isBrowser()) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("history", JSON.stringify(history));
      localStorage.setItem("reports", JSON.stringify(reports));
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
    }

    // Optionally, set cookies for additional data
    document.cookie = `auth=true; path=/; max-age=3600`; // Set cookie for 1 hour
    document.cookie = `role=${user.role}; path=/; max-age=3600`;

    console.log("Data response - ",data)
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
  }
}

// Function to get the current logged-in user
export function getUserData(): UserResponse | null {
  if (isBrowser()) {
    const users = localStorage.getItem("user");
    const historys = localStorage.getItem("history");
    const report = localStorage.getItem("reports");
    const userData:User = users ? JSON.parse(users) : null;
    const historyData:History = historys ? JSON.parse(historys) : null;
    const reportsData:BillingForm = report ? JSON.parse(report) : null;

    console.log("Retrieved user from localStorage:", users); // Debug log
    try {
      return { user:userData, history:historyData, reports:reportsData};
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  }
  return null;
}

// Function to log out the user
export function logout() {
  if (isBrowser()) {
    // Remove user data and tokens from localStorage
    localStorage.clear(); 

    // Optionally, clear cookies if needed
    document.cookie = "auth=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";

    // Redirect to the login page
    window.location.href = "/";
  }
}

// Function to check if the user is authenticated
// export function isAuthenticated(): boolean {
//   return getCurrentUser() !== null;
// }

// // Function to check if the current user has a specific role
// export function hasRole(role: "user" | "admin"): boolean {
//   const user = getCurrentUser();
//   return user ? user.role === role : false;
// }

// Function to get the access token
export function getAccessToken(): string | null {
  if (isBrowser()) {
    return localStorage.getItem("access_token");
  }
  return null;
}

// Function to get the refresh token
export function getRefreshToken(): string | null {
  if (isBrowser()) {
    return localStorage.getItem("refresh_token");
  }
  return null;
}
