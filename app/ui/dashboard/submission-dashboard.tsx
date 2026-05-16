"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { Download, Search } from "lucide-react";
import { Submission } from "@/app/lib/types";

interface SubmissionDashboardProps {
  submissions: Submission[];
}

export function SubmissionDashboard({ submissions }: SubmissionDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        Object.values(sub.createdAt).some((val) =>
          val.toLowerCase().includes(searchLower),
        );
      return matchesSearch;
    });
  }, [submissions, searchTerm]);

  const columnHelper = createColumnHelper<Submission>();

  const columns = [
    columnHelper.accessor("createdAt", {
      header: "Timestamp",
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    }),
    columnHelper.accessor(
      (row) => row.data.name || Object.values(row.data)[0],
      {
        id: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      },
    ),
    columnHelper.accessor(
      (row) => row.data.email || Object.values(row.data)[1],
      {
        id: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
    ),
    columnHelper.accessor(
      (row) => row.data.message || Object.values(row.data)[2],
      {
        id: "message",
        header: "Message",
        cell: (info) => {
          const msg = info.getValue() || "";
          return (
            <div className="max-w-md" title={msg}>
              {msg}
            </div>
          );
        },
      },
    ),
  ];

  const table = useReactTable({
    data: filteredSubmissions,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const exportToCSV = () => {
    const csvData = filteredSubmissions.map((sub) => ({
      Timestamp: new Date(sub.createdAt).toLocaleString(),
      ...sub.data,
    }));

    const csv = [
      Object.keys(csvData[0] || {}).join(","),
      ...csvData.map((row) =>
        Object.values(row)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tinyform-submissions-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Submissions</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {filteredSubmissions.length} submission
              {filteredSubmissions.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={exportToCSV} variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search submissions..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left p-4 font-semibold text-sm text-gray-700"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No submissions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
