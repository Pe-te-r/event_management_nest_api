import { ConflictException, ForbiddenException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
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

  async findAll(limit: number, detailed?: boolean, email?: string): Promise<ApiResponse<User[] | User>> {
    console.log(detailed)
    // return user by email
    if (email) {
      let users;
      if (detailed) {
        users = await this.userRepository
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.payments', 'payment')
          .leftJoinAndSelect('user.registeredEvents', 'registeredEvents')
          .leftJoinAndSelect('user.createdEvents', 'createdEvent')
          .leftJoinAndSelect('user.feedback', 'feedback')
          .select([
            'user.id',
            'user.first_name',
            'user.last_name',
            'user.email',
            'user.phone',
            'user.role',
            'user.createAt',
            'user.updateAt',
            'payment.payment_id',
            'payment.amount',
            'registeredEvents.registration_id',
            'feedback.feedback_id',
            'feedback.comments',
          ])
          .getMany();
      } else {
        
        users=await this.userRepository.findOne({
          where: { email: email },
          select:['id','first_name','last_name','email','phone','role','createAt','updateAt']
        })
      }

      if (!users) {
        throw new NotFoundException(`email ${email} not found`)
      }
      return {
        status: 'success',
        message: 'all users retrived',
        data: users,
      };
    }

    let users;
    if (detailed) {
      users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.payments', 'payment')
        .leftJoinAndSelect('user.registeredEvents', 'registeredEvents')
        .leftJoinAndSelect('user.feedback', 'feedback')
        .select([
          'user.id',
          'user.first_name',
          'user.last_name',
          'user.email',
          'user.phone',
          'user.role',
          'user.createAt',
          'user.updateAt',
          'payment.payment_id',
          'payment.amount',
          'payment.payment_method',
          'payment.payment_status',
          'registeredEvents.registration_id',
          'registeredEvents.registration_date',
          'registeredEvents.payment_status',
          'feedback.feedback_id',
          'feedback.rating',
          'feedback.comments',
        ])
        .getMany();
    } else {
      users = await this.userRepository.find({ take: limit })
    }
      if (users.length === 0) {
        throw new NotFoundException('no users found')
      }
    return {
      status: 'success',
      message: 'all users retrived',
      data: users,
    };
  }

  async findOne(id: string, detailed: boolean = false): Promise<ApiResponse<User | null>> {
    if (detailed) {
      const foundUser = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.payments', 'payment')
        .leftJoinAndSelect('user.registeredEvents', 'registeredEvents')
        .leftJoinAndSelect('user.createdEvents', 'createdEvent')
        .leftJoinAndSelect('user.feedback', 'feedback')
        .select([
          'user.id',
          'user.first_name',
          'user.last_name',
          'user.email',
          'user.phone',
          'user.role',
          'user.createAt',
          'user.updateAt',
          'payment.payment_id',
          'payment.amount',
          'registeredEvents.registration_id',
          'feedback.feedback_id',
          'feedback.comments',
        ])
        .where('user.id = :id', { id })
        .getOne();
      return {
        status: 'success',
        message: `User with id ${id} retrived`,
        data: foundUser,
      };
    }
    const foundUser = await this.userRepository.findOne({ where: { id: id } })
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
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashData(updateUserDto.password)
    }
    console.log(updateUserDto)
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
