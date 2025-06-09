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
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { RoleEnum } from 'src/common/types/enums';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { UserD } from 'src/auth/decorator/user.decorator';


@Controller('users')
@UseGuards(RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.create(createUserDto);
  }

  // this about getting all users
  @Roles(RoleEnum.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'The number of users require to be retrived' })
  @ApiQuery({ name: 'email', required: false, type: 'string', description: 'Required when searching for user by email' })
  async findAll(
    @Query() param?: { email: string; limit: number },
  ): Promise<ApiResponse<User[] | User>> {
    const limit = param?.limit ?? 10;
    console.log(param)
    if (param?.email) {
      return await this.usersService.findAll(Number(limit), param?.email);
    }
    return await this.usersService.findAll(Number(limit));
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get users by id' })
  @ApiQuery({ name: 'detailed', required: false, type: 'boolean', default: false, description: 'Get user details with more info' })
  findOne(
    @Param('id') id: string,
    @UserD('sub') token_id:string,
    @Query('detailed') detailed?: string,
  ): Promise<ApiResponse<User | null>> {
    console.log(token_id)
    return this.usersService.findOne(id, detailed === 'true');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update users by id' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete users by id' })
  remove(@Param('id') id: string) {
    console.log(typeof (id));
    return this.usersService.remove(id);
  }

}
