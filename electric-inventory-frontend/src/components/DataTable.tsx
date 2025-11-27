"use client";

import { useState, useMemo } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export interface TableColumn<T = any> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  size?: "sm" | "md" | "lg";
  actions?: (row: T, index: number) => React.ReactNode;
  onRowClick?: (row: T, index: number) => void;
  moduleName?: string; // To identify which module is using the table
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  className = "",
  striped = true,
  hover = true,
  bordered = true,
  size = "md",
  actions,
  onRowClick,
  moduleName,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "lg":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  const getCellPadding = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2";
      case "lg":
        return "px-6 py-4";
      default:
        return "px-4 py-3";
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className={`min-w-full divide-y divide-gray-200 ${getSizeClasses()}`}>
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  getCellPadding()
                } ${column.className || ""}`}
              >
                {column.sortable ? (
                  <button
                    onClick={() => handleSort(column.key as string)}
                    className="flex items-center space-x-1 hover:text-gray-700 focus:outline-none"
                  >
                    <span>{column.header}</span>
                    {sortColumn === column.key && (
                      sortDirection === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )
                    )}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
            {actions && (
              <th className={`text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${getCellPadding()}`}>
                Actions
              </th>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className={`text-center text-gray-500 ${getCellPadding()} py-8`}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  ${striped && rowIndex % 2 === 1 ? "bg-gray-50" : ""}
                  ${hover ? "hover:bg-gray-100" : ""}
                  ${onRowClick ? "cursor-pointer" : ""}
                  ${bordered ? "border-b border-gray-200" : ""}
                `}
                onClick={() => onRowClick?.(row, rowIndex)}
              >
                {columns.map((column, colIndex) => {
                  const value = row[column.key as keyof T];
                  const renderedValue = column.render
                    ? column.render(value, row, rowIndex)
                    : String(value || "");

                  return (
                    <td
                      key={colIndex}
                      className={`${getCellPadding()} whitespace-nowrap text-gray-900 ${column.className || ""}`}
                    >
                      {renderedValue}
                    </td>
                  );
                })}
                {actions && (
                  <td className={`${getCellPadding()} whitespace-nowrap text-right`}>
                    {actions(row, rowIndex)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}