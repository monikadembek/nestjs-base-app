import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 256)
  name?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @Length(3, 256)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(4, 20)
  password?: string;
}
