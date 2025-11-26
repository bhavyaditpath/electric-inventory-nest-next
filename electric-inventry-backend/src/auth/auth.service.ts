import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { HashUtil } from '../utils/hash.util';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const exists = await this.userRepo.findOne({
      where: { username: dto.username }
    });

    if (exists) {
      throw new BadRequestException("Username already exists");
    }

    const hashedPassword = await HashUtil.hash(dto.password);

    const newUser = this.userRepo.create({
      username: dto.username,
      password: hashedPassword,
      role: dto.role
    });

    return this.userRepo.save(newUser);
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepo.findOne({
      where: { username: dto.username }
    });

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const passwordMatch = await HashUtil.compare(dto.password, user.password);

    if (!passwordMatch) throw new UnauthorizedException("Invalid credentials");

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role
    };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
