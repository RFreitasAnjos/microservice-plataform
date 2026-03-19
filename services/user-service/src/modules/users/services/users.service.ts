import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UsersRepository } from '../repositories/users.repositories';
import { HashService } from '../../../../common/hash.service';

@Injectable()
export class UsersService {
  private static readonly INACTIVE_PURGE_DAYS = 30;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
    private readonly configService: ConfigService
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    await this.purgeExpiredInactiveAccounts();

    const userExists = await this.usersRepository.findByEmail(createUserDto.email);

    if (userExists) throw new ConflictException('Email já cadastrado');

    const saltRounds = this.getSaltRounds();

    const hashedPassword = await this.hashService.hash(
      createUserDto.password,
      saltRounds
    );

    return this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword
    });
  }

  async findAll(includeInactive = false) {
    await this.purgeExpiredInactiveAccounts();

    return this.usersRepository.findAll(includeInactive);
  }

  async findOne(id: string, includeInactive = false) {
    await this.purgeExpiredInactiveAccounts();

    return this.getUserOrFail(id, includeInactive);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.purgeExpiredInactiveAccounts();

    await this.getUserOrFail(id);

    return this.usersRepository.update(id, updateUserDto);
  }

  async recoverPassword(id: string, updatePasswordUserDto: ChangePasswordDto) {
    await this.purgeExpiredInactiveAccounts();

    const user = await this.getUserOrFail(id);

    const saltRounds = this.getSaltRounds();

    const hashedPassword = await this.hashService.hash(
      updatePasswordUserDto.password,
      saltRounds
    );

    return this.usersRepository.recoverPassword(id, {
      password: hashedPassword,
      updatedAt: new Date(),
    });
  }

  async remove(id: string) {
    await this.purgeExpiredInactiveAccounts();

    await this.getUserOrFail(id);

    return this.usersRepository.softDelete(id);
  }

  async removePermanently(id: string) {
    await this.purgeExpiredInactiveAccounts();

    await this.getUserOrFail(id, true);

    return this.usersRepository.delete(id);
  }

  async softDelete(id: string) {
    await this.purgeExpiredInactiveAccounts();

    await this.getUserOrFail(id);

    return this.usersRepository.softDelete(id);
  }

  private async getUserOrFail(id: string, includeInactive = false) {

    const user = await this.usersRepository.findById(id, includeInactive);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  private getSaltRounds(): number {

    const configuredSaltRounds = this.configService.get<string | number>('BCRYPT_SALT_ROUNDS');
    const saltRounds = Number(configuredSaltRounds);

    return Number.isInteger(saltRounds) && saltRounds > 0 ? saltRounds : 10;
  }

  private async purgeExpiredInactiveAccounts(): Promise<void> {
    await this.usersRepository.deleteInactiveOlderThan(UsersService.INACTIVE_PURGE_DAYS);
  }
}