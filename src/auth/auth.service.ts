import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

type AuthResult = {
  accessToken: string;
  userId: number;
  email: string;
  name: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<AuthResult> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new NotFoundException(`No user found for provided email ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: user.id, username: user.email };

    // TODO: generate JWT and return it here instead of the user object

    return {
      accessToken: await this.jwtService.signAsync(payload),
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
