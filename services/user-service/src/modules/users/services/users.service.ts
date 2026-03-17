import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../repositories/users.repositories';

@Injectable()
export class UsersService {

  constructor(private readonly usersRepository: UsersRepository) { }

  async create(createUserDto: CreateUserDto) {
    const newUser = createUserDto;
    const userExists = await this.usersRepository.findByEmail(createUserDto.email);

    if(userExists) throw new ConflictException('Email já cadastrado');

    return this.usersRepository.create({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password
    });
  }

  async findAll() {
    const users = await this.usersRepository.findAll();
    if(!users) throw new ConflictException('Nenhum usuário encontrado');

    return users;
  }

  async findOne(id: string) {
    const userExists = await this.usersRepository.findById(id);

    if(!userExists) throw new ConflictException('Usuário não encontrado');
    if(!id) throw new ConflictException('ID é obrigatório');

    return userExists;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userExists = await this.usersRepository.findById(id);
    if(!userExists) throw new ConflictException('Usuário não encontrado');

    return this.usersRepository.update(id, {
      ...updateUserDto,
    });
  }

  async recoverPassword(id: string, updatePasswordUserDto: UpdateUserDto) {
    const newPassword = updatePasswordUserDto.password;
    const userExists = await this.usersRepository.findById(id);
    if(!userExists) throw new ConflictException('Usuário não encontrado');
    if(!newPassword || newPassword.length < 8 ) throw new ConflictException('Nova senha é obrigatória e deve ter pelo menos 8 caracteres');

    return this.usersRepository.recoverPassword(id, {
      password: newPassword,
      updatedAt: new Date(),
    });
  }

  async remove(id: string) {
    const userExists = await this.usersRepository.findById(id);
    if(!userExists) throw new ConflictException('Usuário não encontrado');
    
    return this.usersRepository.delete(id);
  }

  async softDelete(id: string) {
    const userExists = await this.usersRepository.findById(id);
    if(!userExists) throw new ConflictException('Usuário não encontrado');

    return this.usersRepository.softDelete(id);
  }
}
