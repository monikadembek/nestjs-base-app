import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

type AuthResult = { accessToken: string; userId: number; username: string };

// TODO: use bcrypt to store hashed passwords and compare stored passwords and input password

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<AuthResult> {
    const user = await this.usersService.findOne(username);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.userId, username: user.username };

    // TODO: generate JWT and return it here instead of the user object

    return {
      accessToken: await this.jwtService.signAsync(payload),
      userId: user.userId,
      username: user.username,
    };
  }
}
