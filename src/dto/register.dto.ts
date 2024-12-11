import {
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsNotEmpty()
  first_name: string;
  @IsOptional()
  @IsNotEmpty()
  last_name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 4,
  })
  password: string;
}
