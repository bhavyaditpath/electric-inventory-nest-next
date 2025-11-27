"use client";

import { useState, useEffect } from "react";
import DataTable, { TableColumn } from "../../../components/DataTable";
import { branchApi } from "../../../lib/api";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

interface Branch {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  isRemoved: boolean;
}

const columns: TableColumn<Branch>[] = [
  {
    key: "name",
    header: "Branch Name",
    sortable: true,
    className: "font-medium text-gray-900"
  },
  {
    key: "address",
    header: "Address",
    sortable: false,
    render: (value) => (
      <div className="max-w-xs truncate" title={value || "N/A"}>
        {value || "N/A"}
      </div>
    )
  },
  {
    key: "phone",
    header: "Phone",
    sortable: false,
    render: (value) => value || "N/A"
  },
  {
    key: "createdAt",
    header: "Created",
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString()
  },
  {
    key: "isRemoved",
    header: "Status",
    sortable: true,
    render: (value) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        !value
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {!value ? 'Active' : 'Inactive'}
      </span>
    )
  }
];

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadBranches = async () => {
      setLoading(true);
      try {
        const response = await branchApi.getAll();
        console.log('API Response:', response); // Debug log

        // Handle both response formats: direct array or wrapped response
        let branchesData = [];
        if (Array.isArray(response)) {
          // Direct array response from backend
          branchesData = response;
        } else if (response.success && Array.isArray(response.data)) {
          // Wrapped response format
          branchesData = response.data;
        } else {
          throw new Error('Invalid response format');
        }

        // Transform the data to match our interface
        const transformedBranches = branchesData.map((branch: any) => ({
          ...branch,
          createdAt: new Date(branch.createdAt).toISOString(),
          updatedAt: new Date(branch.updatedAt).toISOString(),
        }));
        setBranches(transformedBranches);
      } catch (error) {
        console.error('Error loading branches:', error);
        // For demo purposes, show some sample data if API fails
        setBranches([
          {
            id: 1,
            name: "Main Branch",
            address: "123 Main St, City, State 12345",
            phone: "555-0100",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isRemoved: false,
          },
          {
            id: 2,
            name: "Downtown Branch",
            address: "456 Downtown Ave, City, State 12346",
            phone: "555-0200",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isRemoved: false,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, []);

  const handleView = (branch: Branch) => {
    console.log("View branch:", branch);
    // TODO: Implement view modal/details page
  };

  const handleEdit = (branch: Branch) => {
    console.log("Edit branch:", branch);
    // TODO: Implement edit modal
  };

  const handleDelete = async (branch: Branch) => {
    if (window.confirm(`Are you sure you want to delete "${branch.name}"?`)) {
      try {
        await branchApi.delete(branch.id);
        // Refresh the branches list after successful deletion
        const loadBranches = async () => {
          try {
            const response = await branchApi.getAll();
            let branchesData = [];
            if (Array.isArray(response)) {
              branchesData = response;
            } else if (response.success && Array.isArray(response.data)) {
              branchesData = response.data;
            }

            const transformedBranches = branchesData.map((branch: any) => ({
              ...branch,
              createdAt: new Date(branch.createdAt).toISOString(),
              updatedAt: new Date(branch.updatedAt).toISOString(),
            }));
            setBranches(transformedBranches);
          } catch (error) {
            console.error("Error refreshing branches:", error);
          }
        };
        await loadBranches();
      } catch (error) {
        console.error("Error deleting branch:", error);
        alert("Error deleting branch");
      }
    }
  };

  const handleCreateBranch = () => {
    setShowCreateModal(true);
  };

  const actions = (branch: Branch, index: number) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleView(branch);
        }}
        className="text-blue-600 hover:text-blue-900 p-1"
        title="View Details"
      >
        <EyeIcon className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(branch);
        }}
        className="text-yellow-600 hover:text-yellow-900 p-1"
        title="Edit Branch"
      >
        <PencilIcon className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(branch);
        }}
        className="text-red-600 hover:text-red-900 p-1"
        title="Delete Branch"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Branches Management</h1>
            <p className="text-gray-600 mt-2">Manage all branches in the system</p>
          </div>
          <button
            onClick={handleCreateBranch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Branch
          </button>
        </div>
      </div>
        {/* bg-white rounded-lg shadow */}
      <div className="">
        <div className="p-0">
          <DataTable
            data={branches}
            columns={columns}
            loading={loading}
            emptyMessage="No branches found"
            actions={actions}
            onRowClick={(row) => handleView(row)}
            moduleName="Branches Management"
            striped={true}
            hover={true}
            size="md"
          />
        </div>
      </div>
    </div>
  );
}