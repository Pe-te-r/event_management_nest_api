import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from 'src/responseType';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  
  async create(createUserDto: CreateUserDto): Promise<ApiResponse<undefined>> {
    // await user.insertUser(createUserDto);
    const newUser = this.userRepository.create(createUserDto)
    const savedUser = await this.userRepository.save(newUser)

    return {
      status: 'success',
      message: `New user added with uuid ${newUser.id}`,
    };
  }

 async findAll(limit: number, email?: string): Promise<ApiResponse<User[] | User> >{
   if (email) {
     const user = await this.userRepository.findOne({
       where: {email:email}
      })
      if (!user) {
        return {
          status: 'error',
          message: `This email ${email} is not found`,
        };
      }
      return {
        status: 'success',
        message: 'all users retrived',
        data: user,
      };
    }
    const user = await this.userRepository.find()
    return {
      status: 'success',
      message: 'all users retrived',
      data: user,
    };
  }

  async findOne(id: string,detailed: boolean=false): Promise<ApiResponse<User | null>> {
    if (detailed) {
      const foundUser = await this.userRepository.findOne({
        where: { id: id },
        relations: {
          feedback: true,
          payments: true,
          registeredEvents: true,
          createdEvents:true
        }
      })
      return {
        status: 'success',
        message: `User with id ${id} retrived`,
        data: foundUser,
      };
    }
    const foundUser =await this.userRepository.findOne({ where: { id: id } })
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

  update(id: string, updateUserDto: UpdateUserDto) {
    const foundUser = this.userRepository.findOne({where:{id:id}});
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
    const foundUser = this.userRepository.findOne({where:{id:id}});
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
