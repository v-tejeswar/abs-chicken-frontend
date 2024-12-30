"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BillingForm } from "@/lib/types";
import { formFieldLabels } from "@/app/schema";
import { useToast } from "@/hooks/use-toast";

interface FormDetailsDialogProps {
  form: BillingForm | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (reportId: number, comments: string) => Promise<void>; // Changed to return a Promise
  onDeny: (reportId: number, comments: string) => Promise<void>; // Changed to return a Promise
}

export function FormDetailsDialog({
  form,
  isOpen,
  onClose,
  onApprove,
  onDeny,
}: FormDetailsDialogProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState("");
  const [error, setError] = useState(""); // State for error message
  const [loading, setLoading] = useState<"approve" | "deny" | null>(null); // Loading state

  if (!form) return null;

  const handleAction = async (action: "approve" | "deny") => {
    if (!comments.trim()) {
      setError("Please provide comments."); // Set error message
      return;
    }

    setError(""); // Clear error if comments are valid
    setLoading(action); // Set loading state

    try {
      if (action === "approve") {
        await onApprove(form.id, comments);
        toast({ title: "Report approved successfully." });
      } else {
        await onDeny(form.id, comments);
        toast({ title: "Report denied successfully." });
      }
      setComments(""); // Clear the comments
      onClose(); // Close the dialog
    } catch (err:any) {
      toast({ title: "An error occurred.", description: err.message, variant: "destructive" });
    } finally {
      setLoading(null); // Reset loading state
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="left-[50%] top-[30%] max-w-[60vw] max-h-[70vh] overflow-y-auto md:p-6 sm:p-2">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Report ID - {form.id || "N/A"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <label className="font-medium block">Submitted By</label>
              <input
                type="text"
                value={form.user}
                readOnly
                disabled
                className="w-full px-2 py-1 border rounded bg-gray-100 text-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="font-medium block">Date</label>
              <input
                type="text"
                value={form.report_date}
                readOnly
                disabled
                className="w-full px-2 py-1 border rounded bg-gray-100 text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-sm">
            {Object.keys(formFieldLabels).map((fieldKey) => (
              <div key={fieldKey} className="space-y-1">
                <label className="font-medium block">{formFieldLabels[fieldKey]}</label>
                <input
                  type="text"
                  value={form[fieldKey as keyof BillingForm] ?? "N/A"}
                  readOnly
                  disabled
                  className="w-full px-2 py-1 border rounded bg-gray-100 text-gray-700"
                />
              </div>
            ))}
          </div>

          {form.status === "pending" && (
            <div className="space-y-4">
              <textarea
                placeholder="Enter your comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2 border rounded bg-gray-100 text-gray-700"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error */}
              <div className="flex gap-4">
                <Button
                  onClick={() => handleAction("deny")}
                  variant="destructive"
                  className="w-40"
                  disabled={loading === "deny"} // Disable if loading
                >
                  {loading === "deny" ? "Denying..." : "Deny"}
                </Button>
                <Button
                  onClick={() => handleAction("approve")}
                  className="w-40"
                  disabled={loading === "approve"} // Disable if loading
                >
                  {loading === "approve" ? "Approving..." : "Approve"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
