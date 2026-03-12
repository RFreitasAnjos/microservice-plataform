import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users.repository'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'

@Injectable()
export class UsersService {

  constructor(private usersRepository: UsersRepository) {}

  create(dto: CreateUserDto) {
    return this.usersRepository.create(dto)
  }

  findAll() {
    return this.usersRepository.findAll()
  }

  findOne(id: string) {
    return this.usersRepository.findById(id)
  }

  update(id: string, dto: UpdateUserDto) {
    return this.usersRepository.update(id, dto)
  }

  remove(id: string) {
    return this.usersRepository.delete(id)
  }

}