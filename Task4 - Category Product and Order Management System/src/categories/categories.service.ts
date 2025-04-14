import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  //retreive all categories
  async GetAllCategories() {
    const categories = await this.prismaService.category.findMany({ include: { subCategories: true } });
    if (!categories.length) return { message: 'No Categories were added!', categories };
    return categories;
  }

  //retreive category by its id
  async GetCategoryById(id: number) {
    const category = await this.prismaService.category.findUnique({ where: { id }, include: { subCategories: true } });
    if (!category) throw new NotFoundException('Category was Not Found!');
    return category;
  }

  //create new category (sub-category if parentCategoryId provided)
  async CreateCategory(createCategoryData: CreateCategoryDto) {
    const { name, parentCategoryId } = createCategoryData;

    //check if this category exists before
    const categoryExists = await this.prismaService.category.findUnique({ where: { name }, select: { id: true } });
    if (categoryExists) throw new ConflictException('This Category is already exist');

    if (parentCategoryId) {
      //check if there is category with this id (parentCategoryId)
      const categoryIdMatch = await this.prismaService.category.findUnique({ where: { id: parentCategoryId } });
      if (!categoryIdMatch)
        throw new NotFoundException(`No Category was found with Category id of ${parentCategoryId}`);
    }

    const createdCategory = await this.prismaService.category.create({
      data: { name, parentCategoryId },
    });

    return { message: 'Category Successfully Created', createdCategory };
  }

  //update category by its id
  async updateCategoryById(id: number, updateCategoryData: UpdateCategoryDto) {
    const category = await this.GetCategoryById(id);

    //check the provided parent category id
    if (updateCategoryData.parentCategoryId === category.id)
      throw new BadRequestException('parentCategoryId Cannot be refering to the same category id');

    const updatedCategory = await this.prismaService.category.update({
      where: { id },
      data: updateCategoryData,
    });

    return { message: 'Category Successfully Updated', updatedCategory };
  }

  //delete category by its id
  async deleteCategoryById(id: number) {
    await this.GetCategoryById(id);
    const deletedCategory = await this.prismaService.category.delete({ where: { id } });
    return { message: 'Category Successfully Deleted', deletedCategory };
  }
}
