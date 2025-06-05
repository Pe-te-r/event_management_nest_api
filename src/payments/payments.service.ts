import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { EventRegistration } from 'src/event_registrations/entities/event_registration.entity';
import { User } from 'src/users/entities/user.entity';
import { PaymentStatus } from 'src/common/types/enums';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(EventRegistration) private registrationRepository: Repository<EventRegistration>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ){}
  // ✅ CREATE payment
  async create(createPaymentDto: CreatePaymentDto) {
    const registration = await this.registrationRepository.findOne({
      where: { registration_id: createPaymentDto.registration_id },
      relations: { paidUser: true },
    });

    if (!registration) {
      throw new NotFoundException(`Registration with id ${createPaymentDto.registration_id} not found`);
    }

    const payment = this.paymentRepository.create({
      amount: createPaymentDto.payment,
      payment_method: createPaymentDto.payment_method,
      payment_status: PaymentStatus.PENDING,
      whichEvent: registration,
      whoPaid: registration.paidUser,
    });

    const saved = await this.paymentRepository.save(payment);

    return {
      status: 'success',
      message: 'Payment created successfully',
      data: saved,
    };
  }

  async findAll(detailed:boolean=false) {
    if (detailed) {
      const payments =await this.paymentRepository.find({
        relations: {
          whichEvent: true,
          whoPaid:true
        }
      })
      // const payments = await this.paymentRepository
      //   .createQueryBuilder('payment')
      //   .leftJoinAndSelect('payment.whichEvent', 'event')
      //   .leftJoinAndSelect('payment.whoPaid', 'user')
      //   .select([
      //     'payment.payment_id',
      //     'payment.amount',
      //     // 'payment.status',
      //     // 'payment.createdAt',
      //     'event.id',
      //     'event.title',      
      //     'user.id',
      //     'user.first_name',  
      //     'user.email',
      //   ])
      //   .getMany();
          if (payments.length === 0) {
        throw new NotFoundException(['no payments detail found'])
      }
      return {
        status: 'success',
        message: 'payments details found',
        data:payments
      }
    }
    const payments = await this.paymentRepository.find()
    if (payments.length===0) {
      throw new NotFoundException(['no payments detail found'])
    }
    return {
      status: 'success',
      message: 'payments details found',
      data: payments
    }
}

 async findOne(id: string,detailed:boolean=false) {
    if (detailed) {
      const payments =await this.paymentRepository.findOne({
        where:{payment_id:id},
        relations: {
          whichEvent: true,
          whoPaid: true
        }
      })
      if (!payments) {
        throw new NotFoundException(['no payments detail found'])
      }
      return {
        status: 'success',
        message: 'payments details found',
        data: payments
      }
    }
    const payments = await this.paymentRepository.findOne({
      where: { payment_id: id },
    })
    if (!payments) {
      console.log(payments)
      throw new NotFoundException(['no payments detail found'])
    }
    return {
      status: 'success',
      message: 'payments details found',
      data: payments
    }  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const existingPayment = await this.paymentRepository.findOne({
      where: { payment_id: id },
      relations: { whichEvent: true, whoPaid: true },
    });

    if (!existingPayment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    // Update fields
    if (updatePaymentDto.payment !== undefined) {
      existingPayment.amount = updatePaymentDto.payment;
    }
    if (updatePaymentDto.payment_method) {
      existingPayment.payment_method = updatePaymentDto.payment_method;
    }

    const updated = await this.paymentRepository.save(existingPayment);

    return {
      status: 'success',
      message: 'Payment updated successfully',
      data: updated,
    };
  }
  
   async remove(id: string) {
    const existingPayment = await this.paymentRepository.findOne({ where: { payment_id: id } });

    if (!existingPayment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    await this.paymentRepository.remove(existingPayment);

    return {
      status: 'success',
      message: `Payment with id ${id} deleted successfully`,
    };
  }
}
