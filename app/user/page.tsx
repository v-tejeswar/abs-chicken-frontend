"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/app/schema";
import { DatePicker } from "./components/date-picker";
import { NumberInput } from "./components/number-input";
import { useRouter } from "next/navigation";
import { logout, getUserData } from "@/lib/auth";
import { BillingForm, User, History } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { ApprovalHistory } from "./components/card-history";
import { UserReports } from "./components/card-reports";


export default function UserDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState<History[]>([]);
  const [userReports, setUserReports] = useState<BillingForm[]>([]);
  const [pendingReports, setPendingReports] = useState<BillingForm[]>([]);
  const [deniedReports, setDeniedReports] = useState<BillingForm[]>([]);
  const [approvedReports, setApprovedReports] = useState<BillingForm[]>([]);
  const [selectedReport, setSelectedReport] = useState<BillingForm | any>(null);
  const token = localStorage.getItem("access_token");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitReportDialogOpen, setSubmitReportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedReport, setUpdatedReport] = useState(selectedReport);
  const nonEditableFields = ["report_date", "id", "status", "admin_comments", "user", "created_at"];


  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setCurrentUser(userData.user);
      setApprovalHistory(userData.history.filter((item: { action: string; }) => item.action === 'approved'));
      setUserReports(userData.reports);
      setPendingReports(userData.reports.filter((item: { status: string; }) => item.status === 'pending'));
      setDeniedReports(userData.reports.filter((item: { status: string; }) => item.status === 'denied'));
      setApprovedReports(userData.reports.filter((item: { status: string; }) => item.status === 'approved'))
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      report_date: new Date(),
      broiler_opening_stock: 0,
      broiler_closing_stock: 0,
      broiler_sold_customer: 0,
      broiler_sold_b2b: 0,
      broiler_dead: 0,
      broiler_wastage_weight: 0,
      broiler_rate_customer: 0,
      broiler_rate_b2b: 0,
      broiler_total_sales: 0,
      country_opening_stock: 0,
      country_closing_stock: 0,
      country_sold_customer: 0,
      country_sold_b2b: 0,
      country_dead: 0,
      country_wastage_weight: 0,
      country_rate_customer: 0,
      country_rate_b2b: 0,
      country_total_sales: 0,
      goat_opening_stock: 0,
      goat_sold_customer: 0,
      mutton_total_weight: 0,
      mutton_weight_sold_customer: 0,
      mutton_weight_sold_b2b: 0,
      mutton_wastage_weight: 0,
      mutton_rate_customer: 0,
      mutton_rate_b2b: 0,
      egg_opening_stock: 0,
      egg_sold: 0,
      egg_closing_stock: 0,
      egg_rate: 0,
      total_offline_amount: 0,
      total_online_amount: 0,
      total_sales_amount: 0,
    },
  });

  useEffect(() => {
    if (isDialogOpen) {
      setUpdatedReport({ ...selectedReport }); // Initialize updatedReport with selectedReport
    }
  }, [isDialogOpen, selectedReport]);


  const fetchApprovalHistory = async () => {
    setRefresh(true);
    try {
      const response = await axios.get("http://44.211.216.122:8000/api/approvalhistory/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApprovalHistory(response.data.history.filter((item: { action: string; }) => item.action === 'approved'));
      await fetchUserReports();
    } catch (error) {
      console.error("Error fetching approval history:", error);
    }
    finally {
      setRefresh(false);
    }
  };

  const fetchUserReports = async () => {
    try {
      const response = await axios.get("http://44.211.216.122:8000/api/getreports/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Ensure userReports is an array before setting state
      if (Array.isArray(response.data.reports)) {
        setUserReports(response.data.reports);
        setPendingReports(response.data.reports.filter((item: { status: string; }) => item.status === 'pending'));
        setDeniedReports(response.data.reports.filter((item: { status: string; }) => item.status === 'denied'));
        setApprovedReports(response.data.reports.filter((item: { status: string; }) => item.status === 'approved'))
      } else {
        console.error("User reports data is not an array", response.data);
      }
    } catch (error) {
      console.error("Error fetching user reports:", error);
    }
  };

  const handleReportClick = (reportId: number) => {
    const report = userReports.find((r) => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setIsDialogOpen(true);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true); // Enable edit mode
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setUpdatedReport({});
  };

  const handleUpdateClick = async () => {
    setIsUpdating(true); // Set updating state to true
    try {
      const updatedData = { ...selectedReport, ...updatedReport, status: "pending" }; // Merge changes with original
      await updateReport(updatedData); // Call your PUT API
      setSelectedReport(updatedData); // Update the original report with changes
      setUpdatedReport({});
      await fetchApprovalHistory();
      setIsEditMode(false); // Disable edit mode after successful update
      closeDialog()
    } catch (error) {
      console.error("Error updating report:", error);
    } finally {
      setIsUpdating(false); // Reset updating state after operation
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setUpdatedReport((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleDeleteClick = async () => {
    if (!selectedReport) return;
    setIsDeleting(true); // Set deleting state to true
    try {
      await handleDelete(selectedReport.id); // Call delete API
    } catch (error) {
      console.error("Error deleting report:", error);
    } finally {
      setIsDeleting(false); // Reset deleting state after operation
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true); // Set loading state to true when delete starts

    try {

      const response = await fetch(`http://44.211.216.122:8000/api/dailyreport/${id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPendingReports((prev) =>
          prev.filter((report) => report.id !== id)
        );
        fetchApprovalHistory()
        setIsDialogOpen(false)
        // Handle success, maybe close the modal or show a success message
        console.log("Report deleted successfully");
      } else {
        // Handle failure (e.g., show an error message)
        console.error("Failed to delete the report");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error deleting the report", error);
    } finally {
      setIsDeleting(false); // Reset loading state after API call
    }

  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedReport(null); // Clear selected report
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handlePasswordUpdate = async (data: { password: string }) => {
    try {
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

  const handleSubmitReport = async (data: any) => {
    setSubmitReportDialogOpen(true);
    setLoading(true);
    setStatusMessage(null);
    setIsSuccess(null);

    try {
      const formattedData = {
        ...data,
        report_date: data.report_date.toISOString().split("T")[0], // Format date as "YYYY-MM-DD"
      };

      const response = await axios.post("http://44.211.216.122:8000/api/dailyreport/", formattedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setIsSuccess(true);
      setStatusMessage("Report submitted successfully!");
    } catch (error: any) {
      console.error("Error submitting report:", error);

      let errorMessage = "An unexpected error occurred.";
      if (error.response) {
        if (error.response.status >= 500) {
          errorMessage = "Server problem: Unable to process the request.";
        } else {
          errorMessage = "Unable to submit the report. Please check the details.";
        }
      } else if (error.request) {
        errorMessage = "Network issue: Unable to connect to the server.";
      }

      setIsSuccess(false);
      setStatusMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const updateReport = async (updatedData: BillingForm) => {

    return fetch(`http://44.211.216.122:8000/api/updatereport/${updatedData.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
  };


  if (!currentUser) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-lg font-medium">You are not logged in. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <nav className="bg-absYellow p-3 flex justify-between items-center fixed top-0 left-0 z-10 w-full shadow-md">
        <div className="flex items-center left-0">
          <img src="/abs_name.png" alt="Name" className="w-40 ml-2" />
        </div>
        <div className="flex items-center space-x-4">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setProfileModalOpen(true)}
          >
            <img
              src="/profile-icon.png"
              alt="Profile"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="font-medium">{currentUser.name}</span>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Logout
          </Button>
        </div>
      </nav>
      <div className="pt-16">
        <Tabs defaultValue="dailyReport" className="m-2">
          <TabsList className="bg-white flex space-x-4 overflow-x-auto px-4 py-2 scroll-smooth">
            <TabsTrigger value="dailyReport">Submit Report</TabsTrigger>
            <TabsTrigger value="approvalHistory">Approval History</TabsTrigger>
            <TabsTrigger value="deniedReport">Rejected Reports</TabsTrigger>
            <TabsTrigger value="pendingReport">Pending Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="dailyReport">
            <Card>
              <CardHeader>
                <CardTitle>Submit Daily Report</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmitReport)}
                    className="space-y-6"
                  >
                    <DatePicker
                      control={form.control}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.keys(formSchema.shape).map((field) =>
                        field !== "report_date" ? (
                          <NumberInput
                            key={field}
                            name={field}
                            control={form.control}
                            label={field.replace(/_/g, " ").toUpperCase()}
                          />
                        ) : null
                      )}
                    </div>
                    <Button type="submit">Submit Report</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

          </TabsContent>
          {/* Approval History Tab */}
          <TabsContent value="approvalHistory">
            <ApprovalHistory
              approvalHistory={approvalHistory}
              fetchApprovalHistory={fetchApprovalHistory}
              handleReportClick={handleReportClick}
              isRefreshing={refresh}
            />
          </TabsContent>
          <TabsContent value="deniedReport">
            <UserReports
              reports={deniedReports}
              fetchApprovalHistory={fetchApprovalHistory} // Replace with the actual fetch function for rejected reports
              handleReportClick={handleReportClick}
              isRefreshing={refresh}
            />
          </TabsContent>
          <TabsContent value="pendingReport">
            <UserReports
              reports={pendingReports}
              fetchApprovalHistory={fetchApprovalHistory} // Replace with the actual fetch function for rejected reports
              handleReportClick={handleReportClick}
              isRefreshing={refresh}
            />
          </TabsContent>
        </Tabs>
      </div>
      {/* Dialog for Submit Report*/}
      <Dialog open={submitReportDialogOpen} onOpenChange={setSubmitReportDialogOpen}>
        <DialogContent className="left-[50%] top-[50%] w-[70%]">
          <DialogHeader>
            <DialogTitle>Submitting Report</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
              <DialogDescription id="dialog-description"> Please Wait...</DialogDescription>
            </div>
          ) : (
            <div className={`text-center ${isSuccess ? "text-green-600" : "text-red-600"}`}>
              <p>{statusMessage}</p>
              <button
                onClick={() => setSubmitReportDialogOpen(false)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Close
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal for selected report */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-[70vw] max-h-[70vh] left-[50%] top-[40%] overflow-y-auto md:p-6 sm:p-4"
          aria-describedby="dialog-description" >
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            {selectedReport && (
              <DialogDescription id="dialog-description">{selectedReport.id}</DialogDescription>
            )}
          </DialogHeader>
          {selectedReport && typeof selectedReport === "object" && (
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Display basic information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="font-medium">Report Date</p>
                  <p>{new Date(selectedReport.report_date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Dynamically render all other fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-sm">
                {Object.entries(selectedReport || {}).map(([key, value]) => {
                  // Skip the report_date field as it's already displayed
                  if (key === "report_date") return null;

                  // Get label or fallback to key
                  const label = key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
                  const isEditable = !nonEditableFields.includes(key);

                  return (
                    <div key={key} className="space-y-1">
                      <Input
                        label={label}
                        className="text-absBlack"
                        value={
                          isEditMode
                            ? updatedReport?.[key] !== undefined
                              ? updatedReport[key] || "" // Show updated value if it exists
                              : selectedReport[key] || "" // Fallback to original value
                            : selectedReport[key] // Fallback to original value
                        }
                        disabled={!isEditable || !isEditMode}
                        onChange={(e) => {
                          if (isEditable && isEditMode) {
                            handleInputChange(key, e.target.value);
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              {(selectedReport.status === "pending" || selectedReport.status === "denied") && (
                <div className="flex justify-between mt-4">
                  {!isEditMode && (
                    <Button
                      onClick={handleEditClick}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Edit
                    </Button>
                  )}
                  {isEditMode && (
                    <div>
                      <Button
                        onClick={handleCancelClick}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                      >
                        Cancel
                      </Button>

                      <Button
                        onClick={handleUpdateClick}
                        className={`${isUpdating ? "bg-blue-200 cursor-not-allowed" : "bg-blue-500"
                          } text-white  ml-4 px-4 py-2 rounded-md`}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Updating..." : "Update"}
                      </Button>
                    </div>
                  )}

                  {!isEditMode && selectedReport.status === "pending" && (
                    <Button
                      onClick={handleDeleteClick}
                      className={`${isDeleting ? "bg-red-200 cursor-not-allowed" : "bg-red-500"
                        } text-white px-4 py-2 rounded-md`}
                      disabled={isDeleting} // Disable the button while deleting
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* profile modal */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)}>
        <DialogTitle>Profile</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const passwordInput = form.elements.namedItem("password") as HTMLInputElement;
            handlePasswordUpdate({ password: passwordInput.value });
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
          <Button type="submit">Update Password</Button>
        </form>
      </Modal>
    </div>

  );
}
