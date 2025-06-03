import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {  UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiResponse } from 'src/responseType';
import { ApiOperation } from '@nestjs/swagger';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.create(createUserDto);
  }
  
  // this about getting all users
  @Get()
  async findAll(
    @Query() param?: { email: string; limit: number },
  ): Promise<ApiResponse<User[] | User>> {
    const limit = param?.limit ?? 10;
    if (param?.email) {
      return await this.usersService.findAll(Number(limit), param?.email);
    }
    return await this.usersService.findAll(Number(limit));
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('detailed') detailed?: boolean,
  ): Promise<ApiResponse<User | null>> {
    return this.usersService.findOne(id,detailed);
  }

  @Patch(':id')
  update(@Param('id') id: string,@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
