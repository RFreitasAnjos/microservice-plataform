import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'

@Injectable()
export class UsersRepository {

  constructor(private prisma: PrismaService) {}

  create(data: CreateUserDto) {
    return this.prisma.user.create({
      data
    })
  }

  findAll() {
    return this.prisma.user.findMany()
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id }
    })
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }

  update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data
    })
  }

  delete(id: string) {
    return this.prisma.user.delete({
      where: { id }
    })
  }

}