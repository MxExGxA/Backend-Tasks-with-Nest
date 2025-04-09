import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';

@Module({
  providers: [BooksService, AuthorsService, PrismaService],
  controllers: [BooksController],
})
export class BooksModule {}
