import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashUtil } from '../utils/hash.util';
import { UserDto } from './dto/user.dto';
import { ApiResponse, ApiResponseUtil } from '../shared/api-response';
import { BranchService } from '../branch/branch.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly branchService: BranchService,
  ) { }

  async create(userDto: UserDto): Promise<ApiResponse> {
    const { username, password, role, branchName } = userDto;

    // Find branch by name
    const branch = await this.branchService.findByName(branchName);
    if (!branch) {
      return ApiResponseUtil.error('Branch not found');
    }

    // Check unique username inside the same branch
    const existingUser = await this.userRepository.findOne({
      where: { username, branchId: branch.id }
    });

    if (existingUser) {
      return ApiResponseUtil.error('Username already exists in this branch');
    }

    // Hash password
    const hashedPassword = await HashUtil.hash(password!);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
      branchId: branch.id,
    });

    const savedUser = await this.userRepository.save(user);
    return ApiResponseUtil.success(savedUser, 'User created successfully');
  }

  async findAll(): Promise<ApiResponse> {
    const users = await this.userRepository.find({
      where: { isRemoved: false },
      select: ['id', 'username', 'role', 'branchId', 'isRemoved'],
      relations: ['branch']
    });

    // Transform the data to include only branch name instead of full branch object
    const transformedUsers = users.map(user => ({
      ...user,
      branch: user.branch ? user.branch.name : null
    }));

    return ApiResponseUtil.success(transformedUsers, 'Users retrieved successfully');
  }

  async findOne(id: number): Promise<ApiResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'role', 'branchId', 'isRemoved'],
      relations: ['branch']
    });
    if (!user) {
      return ApiResponseUtil.error('User not found');
    }

    // Transform the data to include only branch name instead of full branch object
    const transformedUser = {
      ...user,
      branch: user.branch ? user.branch.name : null
    };

    return ApiResponseUtil.success(transformedUser, 'User found');
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: number, userDto: UserDto): Promise<ApiResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return ApiResponseUtil.error('User not found');
    }

    // Username uniqueness check inside the same branch
    if (userDto.username && userDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: {
          username: userDto.username,
          branchId: user.branchId,
        }
      });

      if (existingUser) {
        return ApiResponseUtil.error('Username already exists in this branch');
      }
    }

    if (userDto.password) {
      userDto.password = await HashUtil.hash(userDto.password);
    }

    Object.assign(user, userDto);
    const updatedUser = await this.userRepository.save(user);

    return ApiResponseUtil.success(updatedUser, 'User updated successfully');
  }

  async remove(id: number): Promise<ApiResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return ApiResponseUtil.error('User not found');
    }
    await this.userRepository.remove(user);
    return ApiResponseUtil.success(null, 'User deleted successfully');
  }
}
