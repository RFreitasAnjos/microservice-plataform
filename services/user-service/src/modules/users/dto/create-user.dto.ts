import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class CreateUserDto {
   @ApiProperty({ example: 'John Doe' })
   @IsString()
   @IsNotEmpty()
   name: string;

   @ApiProperty({ example: 'john.doe@example.com' })
   @IsEmail()
   @IsNotEmpty()
   email: string;

   @ApiProperty({ example: 'password123' })
   @IsStrongPassword()
   @MinLength(8)
   password: string;
}
