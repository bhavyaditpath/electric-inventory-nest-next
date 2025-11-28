import { apiClient } from "./api";
import { Inventory } from "../types/api-types";

export const getInventories = async (): Promise<Inventory[]> => {
  const response = await apiClient.get<Inventory[]>('/inventory');
  console.log(response)
  return response.data!;
};

export const getProductNames = async (): Promise<string[]> => {
  const response = await apiClient.get<string[]>('/inventory/product-names');
  return response.data!;
};
