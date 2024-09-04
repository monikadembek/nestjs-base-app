import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';

type AuthResult = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  name: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  saltRounds = 10;

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(`${newUser.id}`, tokens.refreshToken);

    return tokens;
  }

  async generateTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('jwt.accessTokenSecret'),
          expiresIn: this.configService.get<string>('jwt.accessTokenExpiresIn'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('jwt.refreshTokenSecret'),
          expiresIn: this.configService.get<string>(
            'jwt.refreshTokenExpiresIn',
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await await bcrypt.hash(
      refreshToken,
      this.saltRounds,
    );

    await this.usersService.update(+userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async signIn(signInDto: SignInDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(signInDto.email);

    if (!user) {
      throw new NotFoundException(
        `No user found for provided email ${signInDto.email}`,
      );
    }

    const passwordMatches = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid password');
    }

    // generate JWT and return it here instead of the user object
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(`${user.id}`, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async logout(userId: string) {
    return this.usersService.update(+userId, { refreshToken: null });
  }

  async refreshToken(userId: string, refreshToken: string) {
    // check if user with provide id exists and if it contains the refresh token
    const user = await this.usersService.findById(+userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    // verify the hashed refreshToken from user table with the provided refresh token from the client
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access denied');
    }

    // generate new tokens if refresh token matches,
    // update new refresh token in db ans return both tokens to the client
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(`${user.id}`, tokens.refreshToken);

    return tokens;
  }
}
