import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { BooksService } from './books.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(AuthGuard, RoleGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Roles(['VIEWER', 'EDITOR', 'ADMIN'])
  @Get()
  async getAllBooks() {
    return await this.booksService.getAllBooks();
  }

  @Roles(['VIEWER', 'EDITOR', 'ADMIN'])
  @Get(':id')
  async getBookById(@Param('id', ParseIntPipe) id: number) {
    return await this.booksService.getBookById(id);
  }

  @Roles(['ADMIN'])
  @Post()
  async createBook(@Body() createBookData: CreateBookDto) {
    return await this.booksService.createBook(createBookData);
  }

  @Roles(['EDITOR', 'ADMIN'])
  @Patch(':id')
  async updateBookById(@Param('id', ParseIntPipe) id: number, @Body() updateBookData: UpdateBookDto) {
    return await this.booksService.updateBookById(id, updateBookData);
  }

  @Roles(['ADMIN'])
  @Delete(':id')
  async deleteBookById(@Param('id', ParseIntPipe) id: number) {
    return await this.booksService.deleteBookById(id);
  }
}
