import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { BookService } from './book.service';
import { HttpExceptionFilter } from 'src/common/filters/http.filter';
import { PrismaExceptionFilter } from 'src/common/filters/prisma.filter';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UpdateBookDto } from './dto/updateBook.dto';

@UseGuards(ThrottlerGuard)
@UseFilters(HttpExceptionFilter, PrismaExceptionFilter)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  //retreives all books
  @Get()
  async getAllBooks() {
    return await this.bookService.getAllBooks();
  }

  //retreives a single book by it's id
  @Get(':id')
  async getBookById(@Param('id', ParseIntPipe) id: number) {
    return await this.bookService.getBookById(id);
  }

  //adds a new book
  @Post()
  async createBook(@Body() createBookData: CreateBookDto) {
    return await this.bookService.createBook(createBookData);
  }

  //updates a book by it's id
  @Patch(':id')
  async updateBook(@Param('id', ParseIntPipe) id: number, @Body() updateBookData: UpdateBookDto) {
    return await this.bookService.updateBook(id, updateBookData);
  }

  //deletes a book by it's id
  @Delete(':id')
  async deleteBook(@Param('id', ParseIntPipe) id: number) {
    return await this.bookService.deleteBook(id);
  }
}
