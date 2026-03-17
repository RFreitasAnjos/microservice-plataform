import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repositories';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository]
})
export class UsersModule {}
