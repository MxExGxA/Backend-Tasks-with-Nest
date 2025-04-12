import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllBooks() {
    const books = await this.prismaService.book.findMany();
    if (!books.length) throw new NotFoundException('No Books Found');
    return books;
  }

  async getBookById(id: string) {
    const book = await this.prismaService.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book Not Found');
    return book;
  }

  async createBook(createBookData: CreateBookDto) {
    const bookData = { ...createBookData };
    bookData.publishedDate = new Date(bookData.publishedDate).toISOString();
    const createdBook = await this.prismaService.book.create({ data: { ...bookData } });
    return { message: 'Book Successfully Created!', createdBook };
  }

  async updateBook(id: string, updateBookData: UpdateBookDto) {
    await this.getBookById(id);
    const bookData = { ...updateBookData };

    if (bookData.publishedDate) {
      bookData.publishedDate = new Date(bookData.publishedDate).toISOString();
    }

    const updatedBook = await this.prismaService.book.update({ where: { id }, data: { ...updateBookData } });
    return { message: 'Book Successfully Updated!', updatedBook };
  }

  async deleteBook(id: string) {
    await this.getBookById(id);
    const deletedBook = await this.prismaService.book.delete({ where: { id } });
    return { message: 'Book Successfully Deleted!', deletedBook };
  }
}
