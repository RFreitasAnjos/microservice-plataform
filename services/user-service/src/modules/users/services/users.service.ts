import { ConflictException, Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users.repository'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { HashService } from '../../../common/security/hash.service'

@Injectable()
export class UsersService {

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto) {

    const passwordHash = await HashService.hash(dto.password)
    const existingUser = await this.usersRepository.findByEmail(dto.email)

    if(existingUser) throw new ConflictException("Email already registered.")

    return this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: passwordHash
    })
  }

  async findAll() {
    return this.usersRepository.findAll()
  }

  async findOne(id: string) {
    return this.usersRepository.findById(id)
  }

  async update(id: string, dto: UpdateUserDto) {

    let password: string | undefined

    if (dto.password) {
      password = await HashService.hash(dto.password)
    }

    return this.usersRepository.update(id, {
      ...dto,
      password
    })
  }

  async remove(id: string) {
    return this.usersRepository.delete(id)
  }

}