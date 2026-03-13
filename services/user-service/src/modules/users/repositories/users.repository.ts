import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'

@Injectable()
export class UsersRepository {

  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    name: string
    email: string
    password: string
  }) {

    return this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })
  }

  findAll() {

    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

  }

  findById(id: string) {

    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

  }

  findByEmail(email: string) {

    return this.prisma.user.findUnique({
      where: { email }
    })

  }

  update(id: string, data: any) {

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true
      }
    })

  }

  delete(id: string) {

    return this.prisma.user.delete({
      where: { id }
    })

  }

}