import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AccessTokenGuard } from '../shared/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/shared/guards/refreshToken.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up new user' })
  @ApiCreatedResponse({ description: 'User Account created' })
  @ApiBody({ type: CreateUserDto })
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Log in user' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiBody({ type: SignInDto })
  signIn(@Body(ValidationPipe) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AccessTokenGuard) // this guard gives us req.user object in that route
  @Get('logout')
  @ApiOperation({ summary: 'Log user out' })
  @ApiOkResponse({ description: 'User logged out' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  logout(@Request() request) {
    // because of JWT strategy a user object exists in the request object when a user is signed in
    return this.authService.logout(request.user.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  getProfile(@Request() request) {
    return request.user;
  }

  // in refresh endpoint client must pass stored refresh token in authorization header as Bearer token
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get new access token by sending valid refresh token',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  refresh(@Request() request) {
    const userId = request.user.sub;
    const refreshToken = request.user.refreshToken;
    return this.authService.refreshToken(userId, refreshToken);
  }
}
