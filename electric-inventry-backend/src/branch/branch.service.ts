import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const branch = this.branchRepository.create(createBranchDto);
    return this.branchRepository.save(branch);
  }

  async findAll() {
    return this.branchRepository.find({ where: { isRemoved: false } });
  }

  async findOne(id: number) {
    return this.branchRepository.findOne({ where: { id, isRemoved: false } });
  }

  async findByName(name: string): Promise<Branch | null> {
    return this.branchRepository.findOne({ where: { name, isRemoved: false } });
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    await this.branchRepository.update(id, updateBranchDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const branch = await this.findOne(id);
    if (branch) {
      await this.branchRepository.remove(branch);
    }
    return branch;
  }
}
