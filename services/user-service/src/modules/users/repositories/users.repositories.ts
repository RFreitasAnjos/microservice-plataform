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
            email: data.email,
            password: data.password,
            role: "user",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
         }
      })
   }

   findAll(){
      return this.prisma.user.findMany();
   }

   findById(id: string){
      return this.prisma.user.findUnique({
         where: {
            id
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
}