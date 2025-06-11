import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { RoleEnum } from 'src/common/types/enums';

@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(RoleEnum.USER)
  @ApiOperation({summary:'create payments'})
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @Roles(RoleEnum.USER,RoleEnum.ADMIN,RoleEnum.ORGANIZER)
  @ApiOperation({ summary: 'get all payments here (done by user,admin && organizer)' })
  @ApiQuery({ name: 'detailed', required: false, description: 'Toggle to get more details on payment',type:'boolean' })
  findAll(@Query('detailed') detailed?: string) {
    return this.paymentsService.findAll(detailed==='true');
  }
  
  @Get(':id')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN,RoleEnum.ADMIN)
  @ApiOperation({ summary:'get payment by id (done by user,admin && organizer)'})
  @ApiQuery({name:'detailed',required:false,description:'Toggle to get more details on payment',type:'boolean'})
  findOne(@Param('id') id: string,@Query('detailed') detailed:string) {
    return this.paymentsService.findOne(id,detailed==='true');
  }
  
  @Patch(':id')
  @Roles(RoleEnum.USER, RoleEnum.ORGANIZER,RoleEnum.USER)
  @ApiOperation({ summary:'update payment by id (done by user,admin && organizer)'})
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }
  
  @Delete(':id')
  @Roles(RoleEnum.ORGANIZER,RoleEnum.ADMIN)
  @ApiOperation({summary:'delete payment by id (done by admin && organizer)'})
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
