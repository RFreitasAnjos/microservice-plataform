import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/database.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { updatePasswordUserDto } from "../dto/updatePassword-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

@Injectable()
export class UsersRepository {
   constructor(private readonly prisma: PrismaService) {}

   create(data: CreateUserDto){
      return this.prisma.user.create({
         data: {
            name: data.name,
            role: "user",
            email: data.email,
            password: data.password,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
         }
      })
   }

   findAll(includeInactive = false){
      return this.prisma.user.findMany({
         where: includeInactive ? {} : { isActive: true }
      });
   }

   findById(id: string, includeInactive = false){
      return this.prisma.user.findFirst({
         where: {
            id,
            ...(includeInactive ? {} : { isActive: true })
         }
      });
   }

   findByEmail(email: string){
      return this.prisma.user.findUnique({
         where: {
            email
         }
      });
   }

   update(id: string, data: UpdateUserDto){
      return this.prisma.user.update({
         where: {
            id
         },
         data: {
            name: data.name,
            email: data.email,
            updatedAt: new Date()
         }
      });
   }

   recoverPassword(id: string, updatePasswordUserDto: updatePasswordUserDto){
      return this.prisma.user.update({
         where: {
            id
         },
         data: {
            password: updatePasswordUserDto.password,
            updatedAt: new Date(),
         }
      });
   }

   delete(id: string){
      return this.prisma.user.delete({
         where: {
            id
         }
      });
   }

   softDelete(id: string){
      return this.prisma.user.update({
         where: {
            id
         },
         data: {
            updatedAt: new Date(),
            isActive: false
         }
      });
   }

   deleteInactiveOlderThan(days: number){
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      return this.prisma.user.deleteMany({
         where: {
            isActive: false,
            updatedAt: {
               lte: cutoffDate
            }
         }
      });
   }

}