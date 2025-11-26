import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchModule } from './branch/branch.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import dbConfig from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    BranchModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
