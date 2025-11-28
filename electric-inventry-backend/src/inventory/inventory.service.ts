import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from '../purchase/entities/purchase.entity';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../shared/enums/role.enum';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
  ) {}

  async findAll(user: User) {
    let query = this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.user', 'user')
      .leftJoinAndSelect('purchase.branch', 'branch')
      .where('purchase.isRemoved = :isRemoved', { isRemoved: false });

    // Role-based filtering
    if (user.role === UserRole.BRANCH) {
      // Branch users see only their branch's purchases
      query = query.andWhere('purchase.branchId = :branchId', { branchId: user.branchId });
    }
    // Admin users see all purchases

    const purchases = await query.getMany();

    // Aggregate purchases by product to show inventory
    const inventoryMap = new Map();

    purchases.forEach(purchase => {
      const key = `${purchase.productName}-${purchase.branchId || 'admin'}`;

      if (!inventoryMap.has(key)) {
        inventoryMap.set(key, {
          id: purchase.id,
          productName: purchase.productName,
          currentQuantity: 0,
          unit: purchase.unit,
          lowStockThreshold: purchase.lowStockThreshold,
          brand: purchase.brand,
          branchId: purchase.branchId,
          branch: purchase.branch,
          lastPurchaseDate: purchase.createdAt,
          totalPurchased: 0,
        });
      }

      const item = inventoryMap.get(key);
      item.currentQuantity += parseFloat(purchase.quantity.toString());
      item.totalPurchased += parseFloat(purchase.quantity.toString());

      // Update last purchase date if this is more recent
      if (purchase.createdAt > item.lastPurchaseDate) {
        item.lastPurchaseDate = purchase.createdAt;
      }
    });

    return Array.from(inventoryMap.values());
  }
}
