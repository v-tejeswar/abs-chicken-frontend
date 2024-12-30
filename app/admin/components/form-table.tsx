"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BillingForm } from "@/lib/types";


interface FormTableProps {
  forms: BillingForm[];
  showActions?: boolean;
  onViewForm: (form: BillingForm) => void;
  onApprove?: (form: BillingForm) => void;
  onDeny?: (form: BillingForm) => void;
}

export function FormTable({
  forms,
  onViewForm
}: FormTableProps) {  

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full table-auto border-collapse border border-gray-300">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 whitespace-nowrap">Report Id</TableHead>
            <TableHead className="px-4 py-2 whitespace-nowrap">Date</TableHead>
            <TableHead className="px-4 py-2 whitespace-nowrap">Submitted By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <TableRow key={form.id} className="hover:bg-gray-50">
              <TableCell className="px-4 py-2 text-center whitespace-nowrap">
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={() => onViewForm(form)}
                >
                  {form.id}
                </Button>
              </TableCell>
              <TableCell className="px-4 py-2 text-center whitespace-nowrap">
              {new Date(form.report_date)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              .replace(/\s/g, "-")}
              </TableCell>
              <TableCell className="px-4 py-2 text-center whitespace-nowrap">{form.user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
