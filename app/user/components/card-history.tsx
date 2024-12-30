import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ApprovalHistoryItem {
  id: number;
  report_id: number;
  approved_by: string;
  timestamp: string;
}

interface ApprovalHistoryProps {
  approvalHistory: ApprovalHistoryItem[];
  fetchApprovalHistory: () => void;
  handleReportClick: (reportId: number) => void;
  isRefreshing: boolean;
}

export const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({
  approvalHistory,
  fetchApprovalHistory,
  handleReportClick,
  isRefreshing,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Approval History</CardTitle>
        <Button
          onClick={fetchApprovalHistory}
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            isRefreshing ? "bg-gray-400 cursor-not-allowed" : ""
          }`}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <FaSpinner className="animate-spin" />
          ) : (
            "Refresh"
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-absBlack text-white font-bold">
            <TableRow>
              <TableHead className="px-4 py-2 whitespace-nowrap">Report Id</TableHead>
              <TableHead className="px-4 py-2 whitespace-nowrap">Approved By</TableHead>
              <TableHead className="px-4 py-2 whitespace-nowrap">Approval Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvalHistory.map((historyItem) => (
              <TableRow key={historyItem.id}>
                <TableCell className="text-center">
                  <Button
                    variant="link"
                    onClick={() => handleReportClick(historyItem.report_id)}
                  >
                    {historyItem.report_id}
                  </Button>
                </TableCell>
                <TableCell className="text-center">{historyItem.approved_by}</TableCell>
                <TableCell className="text-center">
                  {new Date(historyItem.timestamp)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/\s/g, "-")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
