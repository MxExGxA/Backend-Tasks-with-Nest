import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { BooksService } from './books.service';

@Controller('authors/:authorId/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  //retrieve all books for specific author
  @Get()
  async getAllBooks(@Param('authorId', ParseIntPipe) authorId: number) {
    return await this.booksService.getAllBooks(authorId);
  }

  //retrieve book by id
  @Get(':id')
  async getBookById(@Param('authorId', ParseIntPipe) authorId: number, @Param('id', ParseIntPipe) bookId: number) {
    return await this.booksService.getBookById(authorId, bookId);
  }

  //create new book
  @Post()
  async createBook(@Param('authorId', ParseIntPipe) authorId: number, @Body() createBookData: CreateBookDto) {
    return await this.booksService.createBook(authorId, createBookData);
  }

  //update book data
  @Patch(':id')
  async updateBook(
    @Param('authorId', ParseIntPipe) authorId: number,
    @Param('id', ParseIntPipe) bookId: number,
    @Body() updateBookData: UpdateBookDto,
  ) {
    return await this.booksService.updateBook(authorId, bookId, updateBookData);
  }

  //delete book
  @Delete(':id')
  async deleteBook(@Param('authorId', ParseIntPipe) authorId: number, @Param('id', ParseIntPipe) bookId: number) {
    return await this.booksService.deleteBook(authorId, bookId);
  }
}
