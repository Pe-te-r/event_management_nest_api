import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>
  ){}
  create(createPaymentDto: CreatePaymentDto) {
    console.log(createPaymentDto);
    return 'This action adds a new payment';
  }

  async findAll(detailed:boolean=false) {
    if (detailed) {
      const payments =await this.paymentRepository.find({
        relations: {
          whichEvent: true,
          whoPaid:true
        }
      })
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

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    console.log(updatePaymentDto);
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
