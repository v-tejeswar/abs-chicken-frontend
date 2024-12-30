import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component in your project
import { Button } from "@/components/ui/button"; // Assuming you have a Button component in your project
import { User } from "@/lib/types";

interface UserProfileModalProps {
  isModalOpen: boolean;
  currentUser: User;
}

const [isProfileModalOpen, setProfileModalOpen] = useState(false);


export function UserProfileModal({ isModalOpen, currentUser }:UserProfileModalProps) {


  const handlePasswordUpdate = async (data: { password: string }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch('http://44.211.216.122:8000/api/updatepwd/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ new_password: data.password }),
        credentials: 'include',
      });

      if (response.ok) {
        alert("Password updated successfully.");
        setProfileModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update the password.');
      }
    } catch (error) {
      alert('An error occurred while updating the password.');
    }
  };

  return (
    <Modal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)}>
      <DialogTitle>Profile</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const password = e.target.password.value;
          if (password) {
            handlePasswordUpdate({ password });
          }
        }}
        className="space-y-4 mt-1"
      >
        <Input label="Id" className="text-absBlack" value={currentUser.id} disabled />
        <Input label="Name" className="text-absBlack" value={currentUser.name} disabled />
        <Input label="Role" className="text-absBlack" value={currentUser.role} disabled />
        <Input label="Phone Number" className="text-absBlack" value={currentUser.phone_number} disabled />
        <Input label="Email" className="text-absBlack" value={currentUser.email} disabled />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Update Password"
        />
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Update Password
        </Button>
      </form>
    </Modal>
  );
}
