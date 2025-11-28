import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ApiResponseUtil } from '../shared/api-response';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return ApiResponseUtil.success(this.branchService.create(createBranchDto));
  }

  @Get()
  async findAll() {
    return ApiResponseUtil.success(await this.branchService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return ApiResponseUtil.success(await this.branchService.findOne(+id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return ApiResponseUtil.success(await this.branchService.update(+id, updateBranchDto));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return ApiResponseUtil.success(await this.branchService.remove(+id));
  }
}
