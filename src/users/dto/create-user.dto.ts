import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 256)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 256)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  password: string;
}
