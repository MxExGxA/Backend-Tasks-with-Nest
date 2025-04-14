import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async GetAllCategories() {
    return await this.categoriesService.GetAllCategories();
  }

  @Get(':id')
  async GetCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.GetCategoryById(id);
  }

  @Post()
  async CreateCategory(@Body() createCategoryData: CreateCategoryDto) {
    return await this.categoriesService.CreateCategory(createCategoryData);
  }

  @Patch(':id')
  async updateCategoryById(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryData: UpdateCategoryDto) {
    return await this.categoriesService.updateCategoryById(id, updateCategoryData);
  }

  @Delete(':id')
  async deleteCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.deleteCategoryById(id);
  }
}
