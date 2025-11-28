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

  // Branch user should only see their branch's inventory
  if (user.role === UserRole.BRANCH) {
    query = query.andWhere('purchase.branchId = :branchId', {
      branchId: user.branchId,
    });
  }

  const purchases = await query.getMany();

  // Build inventory grouped by product within the branch
  const inventoryMap = new Map();

  purchases.forEach((purchase) => {
    const key = `${purchase.productName}-${purchase.branchId}`;

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

    console.log(inventoryMap)

    const item = inventoryMap.get(key);
    item.currentQuantity += Number(purchase.quantity);
    item.totalPurchased += Number(purchase.quantity);

    if (purchase.createdAt > item.lastPurchaseDate) {
      item.lastPurchaseDate = purchase.createdAt;
    }
  });

  return Array.from(inventoryMap.values());
}

}
