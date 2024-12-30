"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingForm, User, History } from "@/lib/types";
import { FormTable } from "./components/form-table";
import { FormDetailsDialog } from "./components/form-details-dialog";
import { getUserData, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { AddUserForm } from "./components/form-add-user";
import { AdminProfileForm } from "./components/form-profile";
import axios from "axios";

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("pending");
  const [selectedForm, setSelectedForm] = useState<BillingForm | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reports, setReports] = useState<BillingForm[]>([]);
  const [pendingReports, setPendingReports] = useState<BillingForm[]>([]);
  const [deniedReports, setDeniedReports] = useState<BillingForm[]>([]);
  const [approvedReports, setApprovedReports] = useState<BillingForm[]>([]);
  const [selectedReport, setSelectedReport] = useState<BillingForm | null>(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setCurrentUser(userData.user);
      setReports(userData.reports);
      setPendingReports(userData.reports.filter((item: { status: string; }) => item.status === 'pending'));
      setDeniedReports(userData.reports.filter((item: { status: string; }) => item.status === 'denied'));
      setApprovedReports(userData.reports.filter((item: { status: string; }) => item.status === 'approved'))
    }
  }, []);

  const handleViewForm = (form: BillingForm) => {
    setSelectedForm(form);
    setIsDialogOpen(true);
  };


  const handleReportAction = async (
    reportId: number,
    comments: string,
    action: "approved" | "denied"
  ): Promise<void> => {
    try {

      const response = await axios.post("http://44.211.216.122:8000/api/action/", JSON.stringify({
        report_id: reportId,
        action,
        admin_comments: comments,
      }), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status) {
        fetchReports()
      } else {
        console.log("Failed to perform the action. Please try again.");
      }

      // Update the pending reports after a successful action
      setPendingReports((prev) =>
        prev.filter((report) => report.id !== reportId)
      );
    } catch (error) {
      console.error(error);
      throw error; // Re-throw error to notify the caller
    }
  };

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://44.211.216.122:8000/api/getreports/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Ensure userReports is an array before setting state
      if (Array.isArray(response.data.reports)) {
        setReports(response.data.reports);
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

  const handleApprove = (reportId: number, comments: string) => {
    return handleReportAction(reportId, comments, "approved");
  };

  const handleDeny = (reportId: number, comments: string) => {
    return handleReportAction(reportId, comments, "denied");
  };


  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-absBlack">
      <div className="flex-1 bg-absBlack">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-absYellow shadow-md">
          <div className="flex items-center">
            <img src="/abs_name.png" alt="Name" width={250} />
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        {/* Main Section */}
        <main className="p-8 sm:p-4 md:p-6">
          <Card className="h-[85vh] flex">
            {/* Left Section (Tabs List) */}
            <div className="md:w-[10vw] lg:w-[10vw] sm:w-[15vw] border-r p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex flex-col space-y-2">
                  <TabsTrigger
                    value="pending"
                    className="text-left w-full px-4 py-2"
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="text-left w-full px-4 py-2"
                  >
                    History
                  </TabsTrigger>
                  <TabsTrigger
                    value="addUser"
                    className="text-left w-full px-4 py-2"
                  >
                    Add User
                  </TabsTrigger>
                  <TabsTrigger
                    value="updateUser"
                    className="text-left w-full px-4 py-2"
                  >
                    Update User
                  </TabsTrigger>
                  <TabsTrigger
                    value="adminProfile"
                    className="text-left w-full px-4 py-2"
                  >
                    Profile
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Right Section (Tabs Content) */}
            <div className="flex-1 p-2">
              <CardHeader>
                <CardTitle>
                  {activeTab === "pending"
                    ? "Pending Approvals"
                    : activeTab === "history"
                      ? "Approval History"
                      : activeTab === "addUser"
                        ? "Add User"
                        : activeTab === "updateUser"
                          ? "Update User"
                          : "Profile"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "pending"
                    ? "Review and approve pending forms."
                    : activeTab === "history"
                      ? "View previously approved or denied forms."
                      : activeTab === "addUser"
                        ? ""
                        : activeTab === "updateUser"
                          ? ""
                          : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "pending" && (
                  <FormTable forms={pendingReports} showActions={true} onViewForm={handleViewForm} />
                )}
                {activeTab === "history" && (
                  <FormTable forms={approvedReports} showActions={false} onViewForm={handleViewForm} />
                )}
                {activeTab === "addUser" && (<AddUserForm />)}
                {activeTab === "updateUser" && (
                  <div>Update user Content Here</div>
                )}
                {activeTab === "adminProfile" && (
                  <AdminProfileForm user={currentUser} />
                )}
              </CardContent>
            </div>
          </Card>
        </main>

        {/* Form Details Dialog */}
        <FormDetailsDialog
          form={selectedForm}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onApprove={handleApprove}
          onDeny={handleDeny}
        />
      </div>
    </div>
  );
}
