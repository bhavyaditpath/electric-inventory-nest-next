// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../../app.module';
// import { UserService } from '../../user/user.service';

// async function seedAdmin() {
//   const app = await NestFactory.createApplicationContext(AppModule);
//   const userService = app.get(UserService);

//   const adminExists = await userService.findByUsername('admin');

//   if (!adminExists) {
//     await userService.create({
//       username: 'admin',
//       password: 'Admin@123',
//       role: 'ADMIN'
//     });

//     console.log('Admin user created!');
//   }

//   await app.close();
// }

// seedAdmin();
