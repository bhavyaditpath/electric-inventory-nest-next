import { apiClient } from "./api";
import { CreateInventoryDto, Inventory } from "../types/api-types";

export const createInventory = async (
  data: CreateInventoryDto
): Promise<Inventory> => {
  const response = await apiClient.post<Inventory>('/inventory', data);
  return response.data!;
};

export const getInventories = async (): Promise<Inventory[]> => {
  const response = await apiClient.get<Inventory[]>('/inventory');
  return response.data!;
};

export const getProductNames = async (): Promise<string[]> => {
  const response = await apiClient.get<string[]>('/inventory/product-names');
  return response.data!;
};

export const updateInventory = async (
  id: number,
  data: Partial<CreateInventoryDto>
): Promise<Inventory> => {
  const response = await apiClient.patch<Inventory>(`/inventory/${id}`, data);
  return response.data!;
};

export const deleteInventory = async (id: number): Promise<void> => {
  await apiClient.delete(`/inventory/${id}`);
};