import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class LoginDto {

  @ApiProperty({ example: 'admin@gmail', description:'Email do usuário'})
  @IsEmail()
  email: string

  @ApiProperty({ example:'', description:'Senha do usuário'})
  @IsString()
  password: string

}