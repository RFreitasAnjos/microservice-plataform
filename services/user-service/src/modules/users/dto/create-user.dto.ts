import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateUserDto {

  @ApiProperty({ example:'John Doe', description:'Nome do usuário'})
  @IsString()
  name: string

  @ApiProperty({ example:'user@gmail.com', description:'Email do usuário'})
  @IsEmail()
  email: string

  @ApiProperty({ example:'12345678', description:'Senha do usuário'})
  @IsString()
  @MinLength(6)
  password: string

}