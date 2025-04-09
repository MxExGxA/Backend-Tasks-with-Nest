import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBookDto } from './dto/updateBook.dto';
import { CreateBookDto } from './dto/createBook.dto';
import { Book } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly authorService: AuthorsService,
    private readonly prismaService: PrismaService,
  ) {}

  //retrieve all books for a specific author
  async getAllBooks(authorId: number): Promise<Book[]> {
    const books = await this.prismaService.book.findMany({ where: { authorId } });
    if (!books.length) throw new NotFoundException(`No Books Found`);
    return books;
  }

  //retrieve book by author and book ids
  async getBookById(authorId: number, bookId: number): Promise<Book> {
    const book = await this.prismaService.book.findUnique({ where: { id_authorId: { id: bookId, authorId } } });
    if (!book) throw new NotFoundException(`Book is Not Found`);
    return book;
  }

  //create new book for a specific author
  async createBook(authorId: number, createBookData: CreateBookDto) {
    //check if author exists, returns not found exception if not
    await this.authorService.getAuthorById(authorId);

    const bookData = { ...createBookData };
    bookData.publishedDate = new Date(bookData.publishedDate).toISOString();

    const createdBook = await this.prismaService.book.create({
      data: { ...bookData, author: { connect: { id: authorId } } },
    });

    return { message: 'Book Successfully Created', createdBook };
  }

  //update book data for a specific author
  async updateBook(authorId: number, bookId: number, updateBookData: UpdateBookDto) {
    //check if book exists, returns not found exception if not
    await this.getBookById(authorId, bookId);

    const bookData = { ...updateBookData };
    if (bookData.publishedDate) {
      bookData.publishedDate = new Date(bookData.publishedDate).toISOString();
    }

    const updatedBook = await this.prismaService.book.update({
      where: { id_authorId: { id: bookId, authorId } },
      data: { ...bookData },
    });

    return { message: 'Book Successfully Updated', updatedBook };
  }

  //delete book for a specific author
  async deleteBook(authorId: number, bookId: number) {
    //check if book exists, returns not found exception if not
    await this.getBookById(authorId, bookId);

    const deletedBook = await this.prismaService.book.delete({ where: { id_authorId: { id: bookId, authorId } } });
    return { message: 'Book Successfully Deleted', deletedBook };
  }
}
