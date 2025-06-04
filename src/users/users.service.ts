import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from 'src/responseType';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }
    private async hashData(password: string): Promise<string> {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    }
  
    private async comparePasswords(plainText: string, hash: string): Promise<boolean> {
      return await bcrypt.compare(plainText, hash);
    }
  
  async create(createUserDto: CreateUserDto): Promise<ApiResponse<undefined>> {
    const email_found = await this.userRepository.findOne({ where: { email: createUserDto.email } })
    if (email_found) {
      throw new ConflictException(`the user email ${email_found.email} already exits`)
    }
    createUserDto.password =await this.hashData(createUserDto.password)
    const newUser = this.userRepository.create(createUserDto)
    const savedUser = await this.userRepository.save(newUser)

    return {
      status: 'success',
      message: `New user added with uuid ${savedUser.id}`,
    };
  }

  async findAll(limit: number, email?: string): Promise<ApiResponse<User[] | User>> {
    if (email) {
      const user = await this.userRepository.findOne({
        where: { email: email }
      })
      if (!user) {
        throw new NotFoundException(`email ${email} not found`)
      }
      return {
        status: 'success',
        message: 'all users retrived',
        data: user,
      };
    }
    const user = await this.userRepository.find({ take: limit })
    if (user.length === 0) {
      throw new NotFoundException('no user found')
    }
    return {
      status: 'success',
      message: 'all users retrived',
      data: user,
    };
  }

  async findOne(id: string, detailed: boolean = false): Promise<ApiResponse<User | null>> {
    console.log(detailed);
    if (detailed) {
      console.log('here')
      const foundUser = await this.userRepository.findOne({
        where: { id: id },
        relations: {
          feedback: true,
          payments: true,
          registeredEvents: true,
          createdEvents: true
        }
      })
      return {
        status: 'success',
        message: `User with id ${id} retrived`,
        data: foundUser,
      };
    }
    const foundUser = await this.userRepository.findOne({ where: { id: id } })
    console.log(foundUser)
    if (!foundUser) {
      return {
        status: 'error',
        message: `User with id ${id} not found`,
      };
    }
    return {
      status: 'success',
      message: `User with id ${id} retrived`,
      data: foundUser,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const foundUser = await this.userRepository.findOne({ where: { id: id } });
    if (!foundUser) {
      return {
        status: 'error',
        message: `User with id ${id} not found`,
      };
    }
    await this.userRepository.update(id, updateUserDto);
    return {
      status: 'success',
      message: `This action updates a #${id} user`,
    };
  }

  async remove(id: string) {
    const foundUser = await this.userRepository.findOne({ where: { id: id } });
    if (!foundUser) {
      return {
        status: 'error',
        message: `User with id ${id} not found`,
      };
    }
    await this.userRepository.delete(id)
    return {
      status: 'success',
      message: `This action removed a user with id #${id}`,
    };
  }
}
