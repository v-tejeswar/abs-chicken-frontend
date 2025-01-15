import { FaSpinner } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BillingForm } from "@/lib/types";


interface PendingReportsProps {
    reports: BillingForm[];
    title: string;
    fetchApprovalHistory: () => void;
  handleReportClick: (reportId: number) => void;
  isRefreshing: boolean;
}

export const UserReports: React.FC<PendingReportsProps> = ({
    reports,
    title,
    fetchApprovalHistory,
  handleReportClick,
  isRefreshing,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="left-0">{title} Reports</CardTitle>
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
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 whitespace-nowrap">Report Id</TableHead>
              <TableHead className="px-4 py-2 whitespace-nowrap">Total Sale</TableHead>
              <TableHead className="px-4 py-2 whitespace-nowrap">Submitted Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports && reports.length > 0 ? (
              reports.map((reportItem) => (
                <TableRow key={reportItem.id}>
                  <TableCell className="text-center">
                    <Button
                      variant="link"
                      onClick={() => handleReportClick(reportItem.id)}
                    >
                      {reportItem.id}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">{reportItem.total_sales_amount}</TableCell>
                  <TableCell className="text-center">
                    {new Date(reportItem.report_date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/\s/g, "-")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} style={{ textAlign: "center" }}>
                  Reports not available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
