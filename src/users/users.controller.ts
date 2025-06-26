import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiResponse } from 'src/responseType';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { RoleEnum } from 'src/common/types/enums';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { UserD } from 'src/auth/decorator/user.decorator';


@Controller('users')
@ApiTags('Users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user (registration route)' })
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.create(createUserDto);
  }
  
  // this about getting all users
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: 'Get all users (done by admin)' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'The number of users require to be retrived' })
  @ApiQuery({ name: 'email', required: false, type: 'string', description: 'Required when searching for user by email' })
  @ApiQuery({ name: 'detailed', required: false, type: 'boolean', default: false, description: 'Get users details with more info' })
  async findAll(
    @Query() param?: { email: string; limit: number, detailed?: string },
  ): Promise<ApiResponse<User[] | User>> {
    const limit = param?.limit ?? 10;
    if (param?.email) {
      return await this.usersService.findAll(Number(limit),param?.detailed === 'true',param?.email);
    }
    return await this.usersService.findAll(Number(limit), param?.detailed==='true');
  }
  
  @Get(':id/events')
  @ApiBearerAuth('JWT-auth')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.ORGANIZER)
  @ApiOperation({ summary: 'Get events by user id' })
  findEvents(
    @Param('id') id: string,
    @UserD('sub') token_id: string,
    @UserD('role') role: RoleEnum,
  ) {
    if (token_id !== id && role != RoleEnum.ADMIN) {
      throw new ForbiddenException('You are not allowed to access this resource that are not yours');
    }
    return this.usersService.getEvents(id);
  }

  
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.ORGANIZER)
  @ApiOperation({ summary: 'Get users by id ' })
  @ApiQuery({ name: 'detailed', required: false, type: 'boolean', default: false, description: 'Get user details with more info' })
  findOne(
    @Param('id') id: string,
    @UserD('sub') token_id:string,
    @UserD('role') role: RoleEnum,
    @Query('detailed') detailed?: string,
  ): Promise<ApiResponse<User | null>> {
    if (token_id !== id && role != RoleEnum.ADMIN) {
      throw new ForbiddenException('You are not allowed to access this resource that are not yours');
    }
    return this.usersService.findOne(id, detailed === 'true');
  }
  
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.ORGANIZER)
  @ApiOperation({ summary: 'Update users by id' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UserD('sub') token_id: string,@UserD('role') role: RoleEnum,) {
    if (token_id !== id && role !== RoleEnum.ADMIN) {
      throw new ForbiddenException('You are not allowed to access this resource that are not yours');
    }
    return this.usersService.update(id, updateUserDto);
  }
  
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(RoleEnum.ADMIN,RoleEnum.USER,RoleEnum.ORGANIZER)
  @ApiOperation({ summary: 'Delete users by id' })
  remove(@Param('id') id: string, @UserD('sub') token_id: string, @UserD('role') role: RoleEnum,) {
    if (token_id !== id && role != RoleEnum.ADMIN) {
      throw new ForbiddenException('You are not allowed to access this resource that are not yours');
    }
    return this.usersService.remove(id);
  }
  

}
