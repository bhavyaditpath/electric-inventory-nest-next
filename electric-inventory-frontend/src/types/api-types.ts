export interface PurchaseResponseDto {
  id: number;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  lowStockThreshold: number;
  brand: string;
  userId: number;
  branchId?: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: number;
  updatedBy?: number;
  isRemoved: boolean;
}

export interface CreatePurchaseDto {
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  lowStockThreshold: number;
  brand: string;
  branchId?: number;
}