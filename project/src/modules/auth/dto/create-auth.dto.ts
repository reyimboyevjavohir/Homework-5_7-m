import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ example: 'john_doe', description: 'Foydalanuvchi nomi' })
  @IsString()
  @MinLength(3, { message: "Kamida 3 ta harf bo'lsin" })
  @MaxLength(50, { message: "Ko'pi bilan 50 ta harf bo'lsin" })
  username!: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email manzil' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Password@123', description: 'Parol (8-20 belgi)' })
  @IsString()
  @Matches(/[a-zA-Z\d@$!%*?&]{8,20}/, {
    message: "Parol 8-20 ta belgi bo'lishi kerak",
  })
  password!: string;
}
