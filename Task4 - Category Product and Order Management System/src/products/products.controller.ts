import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.getProductById(id);
  }

  @Post()
  async createNewProduct(@Body() createProductData: CreateProductDto) {
    return await this.productService.createNewProduct(createProductData);
  }

  @Patch(':id')
  async updateProductById(@Param('id', ParseIntPipe) id: number, @Body() updateProductData: UpdateProductDto) {
    return await this.productService.updateProductById(id, updateProductData);
  }

  @Delete(':id')
  async deleteProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.deleteProductById(id);
  }
}
