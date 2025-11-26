import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { BranchService } from '../../branch/branch.service';

async function seedBranches() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const branchService = app.get(BranchService);

  const branches = [
    { name: 'Main Branch', address: '123 Main St', phone: '555-0100' },
    { name: 'Downtown Branch', address: '456 Downtown Ave', phone: '555-0200' },
  ];

  for (const branchData of branches) {
    const existing = await branchService.findByName(branchData.name);
    if (!existing) {
      await branchService.create(branchData);
      console.log(`Branch "${branchData.name}" created!`);
    }
  }

  await app.close();
}

seedBranches();
