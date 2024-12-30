// components/ui/sidebar.tsx
import { FC } from "react";
import { logout } from "@/lib/auth"; // Import logout function

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  setActiveTab: (tab: string) => void;
  openAddUserModal: () => void;
  openUpdateUserModal: () => void;
  openProfileModal: () => void;
}

export const Sidebar: FC<SidebarProps> = ({
  activePage,
  onPageChange,
  setActiveTab,
  openAddUserModal,
  openUpdateUserModal,
  openProfileModal,
}) => {
  const handleLogout = () => {
    // Call the logout function
    logout();
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <div className="flex flex-col">
        <button
          onClick={() => {
            onPageChange("dashboard");
            setActiveTab("pending");
          }}
          className={`py-2 px-4 mb-2 ${activePage === "dashboard" ? "bg-gray-700" : ""}`}
        >
          Dashboard
        </button>
        <button
          onClick={openAddUserModal}
          className={`py-2 px-4 mb-2 ${activePage === "addUser" ? "bg-gray-700" : ""}`}
        >
          Add User
        </button>
        <button
          onClick={openUpdateUserModal}
          className={`py-2 px-4 mb-2 ${activePage === "updateUser" ? "bg-gray-700" : ""}`}
        >
          Update User
        </button>
        <button
          onClick={openProfileModal}
          className={`py-2 px-4 mb-2 ${activePage === "profile" ? "bg-gray-700" : ""}`}
        >
          Profile
        </button>
        <button
          onClick={handleLogout} // Handle logout on click
          className="py-2 px-4 mb-2 mt-auto bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
