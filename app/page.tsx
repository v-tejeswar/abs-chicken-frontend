"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "@/lib/types"; // Ensure you import the User type
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid"; // Import icons from Heroicons (or your preferred icon library)

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null); // Set type as User | null
  const [loading, setLoading] = useState(false); // Add loading state to prevent multiple submissions
  const [error, setError] = useState<string | null>(null); // Add error state to handle error messages
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted"); // Log form submission to track how many times it's being triggered
    setLoading(true); // Set loading to true when submitting the form
    setError(null); // Reset error state before making the request
    try {
      const responseData = await login(email, password);
      const loggedInUser = responseData.user;
      console.log("Logged in user:", loggedInUser); // Log the user data to debug
      setUser(loggedInUser); // Set the user data
    } catch (error) {
      setError("Invalid credentials"); // Set error message on failure
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  useEffect(() => {
    if (user) {
      console.log("user = ", user);
      // Ensure user is properly set before redirecting
      if (user.role === "admin") {
        console.log("directing to admin portal");
        router.push("/admin");
      } else {
        console.log("directing to user portal");
        router.push("/user");
      }
    }
  }, [user, router]); // Run redirection when the user state changes

  return (
    <div className="min-h-screen flex items-center justify-center bg-absYellow p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex items-center">
          <img width="60%" src={"/abs_name.png"} alt="Logo" />
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"} // Toggle between text and password type
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Eye Icon for toggling password visibility */}
              <div
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                className="absolute right-3 top-1/2 pt-4 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-absBlack-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-absBlack-500" />
                )}
              </div>
            </div>
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Logging in..." : error ? error : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
