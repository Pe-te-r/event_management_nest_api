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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';

@Public()
@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({summary:'create payments'})
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({summary:'get all payments'})
  // @ApiQuery({type:'detailed',required:false,description:'Toggle to get more details on payments',default:false})
  findAll(@Query('detailed') detailed?: string) {
    return this.paymentsService.findAll(detailed==='true');
  }
  
  @Get(':id')
  @ApiOperation({summary:'get payment by id'})
  @ApiQuery({type:'detailed',required:false,description:'Toggle to get more details on payment'})
  findOne(@Param('id') id: string,@Query('detailed') detailed:string) {
    return this.paymentsService.findOne(id,detailed==='true');
  }
  
  @Patch(':id')
  @ApiOperation({summary:'update payment by id'})
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }
  
  @Delete(':id')
  @ApiOperation({summary:'delete payment by id'})
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
