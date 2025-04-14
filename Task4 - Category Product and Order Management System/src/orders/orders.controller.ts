import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAllOrders() {
    return await this.ordersService.getAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.getOrderById(id);
  }

  @Post()
  async createNewOrder(@Body() createOrderData: CreateOrderDto) {
    return await this.ordersService.createNewOrder(createOrderData);
  }

  @Patch(':id')
  async updateOrderById(@Param('id', ParseIntPipe) id: number, @Body() updateOrderData: UpdateOrderDto) {
    return await this.ordersService.updateOrderById(id, updateOrderData);
  }

  @Delete(':id')
  async deleteOrderById(@Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.deleteOrderById(id);
  }
}
