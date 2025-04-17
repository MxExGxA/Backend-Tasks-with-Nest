import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}

  //retreive all books
  async getAllBooks() {
    const allBooks = await this.prismaService.book.findMany();
    if (!allBooks.length) return { message: 'No Books Created Yet!', allBooks };
    return allBooks;
  }

  //retreive book by its id
  async getBookById(id: number) {
    const book = await this.prismaService.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book Is Not Found!');
    return book;
  }

  //create new book
  async createBook(createBookData: CreateBookDto) {
    const bookData = { ...createBookData };
    //convert to iso string date
    bookData.publishedDate = new Date(bookData.publishedDate).toISOString();

    const createdBook = await this.prismaService.book.create({ data: { ...bookData } });
    return { message: 'Book Successfully Created', createdBook };
  }

  //update book by its id
  async updateBookById(id: number, updateBookData: UpdateBookDto) {
    //check if book exists
    await this.getBookById(id);

    const bookData = { ...updateBookData };

    if (bookData.publishedDate) {
      bookData.publishedDate = new Date(bookData.publishedDate).toISOString();
    }

    const updatedBook = await this.prismaService.book.update({ where: { id }, data: { ...bookData } });
    return { message: 'Book Successfully Updated', updatedBook };
  }

  //delete book by its id
  async deleteBookById(id: number) {
    //check if book exists
    await this.getBookById(id);

    const deletedBook = await this.prismaService.book.delete({ where: { id } });
    return { message: 'Book Successfully Deleted', deletedBook };
  }
}
