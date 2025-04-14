import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}
  //retreive all orders
  async getAllOrders() {
    const orders = await this.prismaService.order.findMany({ include: { items: true } });
    if (!orders.length) return { message: 'No Orders were added!', orders };
    return orders;
  }

  //retreive order by its id
  async getOrderById(id: number) {
    const order = await this.prismaService.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) throw new NotFoundException('Order was Not Found!');
    return order;
  }

  //create new order
  async createNewOrder(createOrderData: CreateOrderDto) {
    const { userId, items } = createOrderData;

    const createdOrder = await this.prismaService.order.create({
      data: {
        userId,
        items: { create: items },
      },
      include: { items: { include: { product: true } } },
    });

    return { message: 'Order Successfully Created', createdOrder };
  }

  //update order by its id
  async updateOrderById(id: number, updateOrderData: UpdateOrderDto) {
    const { userId, items } = updateOrderData;
    await this.getOrderById(id);

    const updatedOrder = await this.prismaService.order.update({
      where: { id },
      data: {
        userId,
        items: items?.length
          ? {
              deleteMany: {},
              create: items,
            }
          : {},
      },
    });

    return { message: 'Order Successfully Updated', updatedOrder };
  }

  //delete order by its id
  async deleteOrderById(id: number) {
    await this.getOrderById(id);

    const deletedOrder = await this.prismaService.order.delete({ where: { id } });
    return { message: 'Order Successfully Deleted', deletedOrder };
  }
}
