import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repositories';
import { HashService } from '../../../common/hash.service';
import { UsersPublicController } from './controllers/users.public.controller';
import { UsersPasswordController } from './controllers/users.password.controller';

@Module({
  controllers: [UsersController,UsersPublicController, UsersPasswordController],
  providers: [UsersService, UsersRepository, HashService]
})
export class UsersModule {}
