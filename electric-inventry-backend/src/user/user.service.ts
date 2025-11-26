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
  ) {}

  async create(userDto: UserDto): Promise<ApiResponse> {
    const { username, password, role, branchName } = userDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      return ApiResponseUtil.error('Username already exists');
    }

    // Find branch by name
    const branch = await this.branchService.findByName(branchName);
    if (!branch) {
      return ApiResponseUtil.error('Branch not found');
    }

    // Hash password
    const hashedPassword = await HashUtil.hash(password!);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
    });
    user.branchId = branch.id;

    const savedUser = await this.userRepository.save(user);
    return ApiResponseUtil.success(savedUser, 'User created successfully');
  }

  async findAll(): Promise<ApiResponse> {
    const users = await this.userRepository.find();
    return ApiResponseUtil.success(users, 'Users retrieved successfully');
  }

  async findOne(id: number): Promise<ApiResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return ApiResponseUtil.error('User not found');
    }
    return ApiResponseUtil.success(user, 'User found');
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: number, userDto: UserDto): Promise<ApiResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return ApiResponseUtil.error('User not found');
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
