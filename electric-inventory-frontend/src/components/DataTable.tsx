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
  // Pagination props
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
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
  pagination = false,
  pageSize: initialPageSize = 10,
  currentPage: initialCurrentPage = 1,
  onPageChange,
  showPageSizeSelector = false,
  pageSizeOptions = [5, 10, 25, 50],
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

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

  // Pagination logic
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = pagination ? sortedData.slice(startIndex, endIndex) : sortedData;

  // Reset to first page when data changes or page size changes
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      handlePageChange(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

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

  // Pagination component
  const PaginationControls = () => {
    if (!pagination || totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        {/* Page size selector */}
        {showPageSizeSelector && (
          <div className="flex items-center space-x-2">
            <label htmlFor="pageSize" className="text-sm text-gray-700">
              Show:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}

        {/* Pagination info */}
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
          </span>
        </div>

        {/* Page navigation */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...'}
              className={`px-3 py-1 text-sm border rounded ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : page === '...'
                  ? 'border-gray-300 cursor-default'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

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
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className={`text-center text-gray-500 ${getCellPadding()} py-8`}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => {
              const actualIndex = pagination ? startIndex + rowIndex : rowIndex;
              return (
                <tr
                  key={actualIndex}
                  className={`
                    ${striped && rowIndex % 2 === 1 ? "bg-gray-50" : ""}
                    ${hover ? "hover:bg-gray-100" : ""}
                    ${onRowClick ? "cursor-pointer" : ""}
                    ${bordered ? "border-b border-gray-200" : ""}
                  `}
                  onClick={() => onRowClick?.(row, actualIndex)}
                >
                  {columns.map((column, colIndex) => {
                    const value = row[column.key as keyof T];
                    const renderedValue = column.render
                      ? column.render(value, row, actualIndex)
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
                      {actions(row, actualIndex)}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <PaginationControls />

      {/* Module Info (for debugging/development) */}
      {moduleName && process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-400 mt-2 px-2">
          Table rendered by: {moduleName}
        </div>
      )}
    </div>
  );
}