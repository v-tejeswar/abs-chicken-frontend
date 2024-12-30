import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { FC, useState } from "react";

interface User {
  email: string;
  id: string;
  name: string;
  phone_number: string;
  role: string;
}

interface AdminProfileFormProps {
  user?: any | User;
}

export const AdminProfileForm: FC<AdminProfileFormProps> = ({ user }) => {
  if (!user) {
    return <p className="text-red-500">User data is not available</p>;
  }

  const [formData, setFormData] = useState({
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("access_token");
      console.log("Access Token:", token);

      const response = await fetch("http://44.211.216.122:8000/api/updatepwd/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_password: formData.password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update password");
      }

      setSuccess("Password updated successfully!");
      setFormData({
        password: "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <label className="block text-sm text-gray-500 font-bold mb-1" htmlFor="id">
            ID
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={user.id}
            className="w-full min-w-[200px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 font-bold mb-1" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            className="w-full min-w-[300px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 font-bold mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            className="w-full min-w-[200px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 font-bold mb-1" htmlFor="role">
            Role
          </label>
          <input
            id="role"
            name="role"
            value={user.role}
            className="w-full min-w-[200px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 font-bold mb-1" htmlFor="phone_number">
            Phone Number
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={user.phone_number}
            className="w-full min-w-[200px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 font-bold mb-1" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password type
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full min-w-[200px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-absBlack-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-absBlack-500" />
              )}
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};
