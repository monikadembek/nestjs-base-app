import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';

export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
};

// created especially for swagger, as there was a problem with using User type, swagger required UserDto class
export class UserDto {
  id: number;
  email: string;
  password: string;
  name: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: DatabaseService) {}

  saltRounds = 10;

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, this.saltRounds),
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
