import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateBookDto } from './dto/updateBook.dto';

@Injectable()
export class BookService {
  constructor(private readonly prismaService: PrismaService) {}

  //retreives all books
  async getAllBooks() {
    const books = await this.prismaService.book.findMany();
    if (!books.length) throw new NotFoundException('No Books Found');
    return books;
  }

  //retreive a single book by it's id
  async getBookById(id: number) {
    const book = await this.prismaService.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException(`Book with ID ${id} was not found.`);
    return book;
  }

  //adds a new book
  async createBook(createBookData: CreateBookDto) {
    const createdBook = await this.prismaService.book.create({
      data: { ...createBookData, publishedDate: new Date(createBookData.publishedDate) },
    });
    return { message: 'book created!', ...createdBook };
  }

  //update a book by it's id
  async updateBook(id: number, updateBookData: UpdateBookDto) {
    const book = await this.prismaService.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException(`Book with ID ${id} was not found.`);

    const data = { ...updateBookData };

    if (data.publishedDate) {
      data.publishedDate = new Date(data.publishedDate).toISOString();
    }

    const updatedBook = await this.prismaService.book.update({
      where: { id },
      data,
    });

    return { message: 'book updated!', ...updatedBook };
  }

  //delete a book by it's id
  async deleteBook(id: number) {
    const book = await this.prismaService.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException(`Book with ID ${id} was not found.`);

    const deletedBook = await this.prismaService.book.delete({ where: { id } });
    return { message: `book deleted!`, ...deletedBook };
  }
}
