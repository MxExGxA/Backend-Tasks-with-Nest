import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { BooksService } from './books.service';

@UseGuards(AuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getAllBooks() {
    return await this.booksService.getAllBooks();
  }

  @Get(':id')
  async getBookById(@Param('id') id: string) {
    return await this.booksService.getBookById(id);
  }

  @Post()
  async createBook(@Body() createBookData: CreateBookDto) {
    return await this.booksService.createBook(createBookData);
  }

  @Patch(':id')
  async updateBook(@Param('id') id: string, @Body() updateBookData: UpdateBookDto) {
    return await this.booksService.updateBook(id, updateBookData);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    return await this.booksService.deleteBook(id);
  }
}
