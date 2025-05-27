import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from 'src/responseType';

export interface Users {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
}
function generateJson(data: Users | Users[]) {
  return JSON.stringify(data); // 2 spaces for pretty-printing
}

@Injectable()
export class UsersService {
  private users: Users[] = [
    {
      id: uuidv4(),
      email: 'phantom8526@duck.com',
      firstName: 'phantom',
      lastName: 'mburu',
      phone: '0748200233',
      password: '1234',
    },
    {
      id: uuidv4(),
      email: 'peter@gmail.com',
      firstName: 'peter',
      lastName: 'wahu',
      phone: '0768543269',
      password: '1234',
    },
  ];
  create(createUserDto: CreateUserDto): ApiResponse<undefined> {
    const newUser: Users = {
      id: uuidv4(),
      ...createUserDto,
    };
    this.users.push(newUser);
    return {
      status: 'success',
      message: `New user added with uuid ${newUser.id}`,
    };
  }

  findAll(): ApiResponse<Users[]> {
    const json = generateJson(this.users);
    console.log(json);
    return {
      status: 'success',
      message: 'all users retrived',
      data: this.users,
    };
  }

  findOne(id: string) {
    const foundUser = this.users.find((user) => user.id === id);
    if (!foundUser) {
      return {
        status: 'error',
        message: `User with id ${id} not found`,
      };
    }
    return {
      status: 'success',
      message: `User with id ${id} retrived`,
      data: generateJson(foundUser),
    };
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const foundUser = this.users.find((user) => user.id === id);
    if (!foundUser) {
      return {
        status: 'error',
        message: `User with id ${id} not found`,
      };
    }
    console.log(updateUserDto);
    return {
      status: 'success',
      message: `This action updates a #${id} user`,
    };
  }

  remove(id: string) {
    const foundUser = this.users.find((user) => user.id === id);
    if (!foundUser) {
      return {
        status: 'error',
        message: `User with id ${id} not found`,
      };
    }
    return {
      status: 'success',
      message: `This action removed a user with id #${id}`,
    };
  }
}
