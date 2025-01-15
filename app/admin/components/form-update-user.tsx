// components/update-user-form.tsx
import { FC } from "react";

interface UpdateUserFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateUserForm: FC<UpdateUserFormProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating user...");
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-xl mb-4">Update User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="user_id"
            placeholder="User ID"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Update User
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 w-full p-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
  );
};
