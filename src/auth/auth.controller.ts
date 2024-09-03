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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body(ValidationPipe) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AccessTokenGuard) // this guard gives us req.user object in that route
  @Get('logout')
  logout(@Request() request) {
    // because of JWT strategy a user object exists in the request object when a user is signed in
    return this.authService.logout(request.user.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Request() request) {
    return request.user;
  }
}
