import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAuthorDto } from './dto/createAuthor.dto';
import { UpdateAuthorDto } from './dto/updateAuthor.dto';
import { Author } from '@prisma/client';

@Injectable()
export class AuthorsService {
  constructor(private readonly prismaService: PrismaService) {}

  //retrieve all authors
  async getAllAuthors(): Promise<Author[]> {
    const authors = await this.prismaService.author.findMany();
    if (!authors.length) throw new NotFoundException('No Authors Found');
    return authors;
  }

  //retrieve author by id
  async getAuthorById(authorId: number): Promise<Author> {
    const author = await this.prismaService.author.findUnique({ where: { id: authorId } });
    if (!author) throw new NotFoundException(`Author is Not Found`);
    return author;
  }

  //create new author
  async createAuthor(createAuthorData: CreateAuthorDto): Promise<{ message: string; createdAuthor: Author }> {
    const authorExist = await this.prismaService.author.findUnique({
      where: { name: createAuthorData.name },
    });

    if (authorExist) throw new ConflictException('Author is Already Exist');

    const authorData = { ...createAuthorData };
    authorData.birthDate = new Date(authorData.birthDate).toISOString();

    const createdAuthor = await this.prismaService.author.create({ data: { ...authorData } });
    return { message: 'Author Successfully Created', createdAuthor };
  }

  //update author data
  async updateAuthor(
    authorId: number,
    updateAuthorData: UpdateAuthorDto,
  ): Promise<{ message: string; updatedAuthor: Author }> {
    await this.getAuthorById(authorId);

    const authorData = { ...updateAuthorData };
    if (authorData.birthDate) {
      authorData.birthDate = new Date(authorData.birthDate).toISOString();
    }

    const updatedAuthor = await this.prismaService.author.update({
      where: { id: authorId },
      data: { ...authorData },
    });
    return { message: 'Author Successfully Updated', updatedAuthor };
  }

  //delete author
  async deleteAuthor(authorId: number): Promise<{ message: string; deletedAuthor: Author }> {
    await this.getAuthorById(authorId);
    const deletedAuthor = await this.prismaService.author.delete({ where: { id: authorId } });
    return { message: 'Author Successfully Deleted', deletedAuthor };
  }
}
