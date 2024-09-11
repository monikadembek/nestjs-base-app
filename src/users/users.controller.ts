import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { AccessTokenGuard } from 'src/shared/guards/accessToken.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'User Account created' })
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'The user records',
    type: UserDto,
    isArray: true,
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user with provided id' })
  // @ApiResponse({ status: 200, description: 'OK' })
  @ApiOkResponse({ description: 'User data', type: UserDto })
  @ApiParam({ name: 'id', format: 'String' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update data for user with provided id' })
  @ApiParam({ name: 'id', format: 'String' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'User data updated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user account with provided id' })
  @ApiOkResponse({ description: 'User removed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({ name: 'id', format: 'String' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
