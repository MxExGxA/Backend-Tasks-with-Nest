import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  //retreive all products
  async getAllProducts() {
    const allProducts = await this.prismaService.product.findMany({ include: { categories: true } });
    if (!allProducts.length) return { message: 'No Products were added!', allProducts };
    return allProducts;
  }

  //retreive product by its id
  async getProductById(id: number) {
    const product = await this.prismaService.product.findUnique({ where: { id }, include: { categories: true } });
    if (!product) throw new NotFoundException('Product was not found!');
    return product;
  }

  //create new product
  async createNewProduct(createProductData: CreateProductDto) {
    const { name, price, categories } = createProductData;

    const createdProduct = await this.prismaService.product.create({
      data: { name, price, categories: { connect: [...categories.map((category) => ({ id: category }))] } },
      include: { categories: true },
    });

    return { message: 'Product Successfully Created', createdProduct };
  }

  //update product by its id
  async updateProductById(id: number, updateProductData: UpdateProductDto) {
    await this.getProductById(id);

    const { name, price, categories } = updateProductData;

    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: {
        name,
        price,
        categories: categories?.length ? { connect: [...categories!.map((category) => ({ id: category }))] } : {},
      },
      include: { categories: true },
    });
    return { message: 'Product Successfully Updated', updatedProduct };
  }

  //delete product by its id
  async deleteProductById(id: number) {
    await this.getProductById(id);
    const deletedProduct = await this.prismaService.product.delete({ where: { id } });
    return { message: 'Product Successfully Deleted', deletedProduct };
  }
}
