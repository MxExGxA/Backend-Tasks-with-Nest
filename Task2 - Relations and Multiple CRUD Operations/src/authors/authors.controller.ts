import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateAuthorDto } from './dto/createAuthor.dto';
import { UpdateAuthorDto } from './dto/updateAuthor.dto';
import { AuthorsService } from './authors.service';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  //retrieve all authors
  @Get()
  async getAllAuthors() {
    return await this.authorsService.getAllAuthors();
  }

  //retrieve author by id
  @Get(':id')
  async getAuthorById(@Param('id', ParseIntPipe) authorId: number) {
    return await this.authorsService.getAuthorById(authorId);
  }

  //create new author
  @Post()
  async createAuthor(@Body() createAuthorData: CreateAuthorDto) {
    return await this.authorsService.createAuthor(createAuthorData);
  }

  //update author data
  @Patch(':id')
  async updateAuthor(@Param('id', ParseIntPipe) authorId: number, @Body() updateAuthorData: UpdateAuthorDto) {
    return await this.authorsService.updateAuthor(authorId, updateAuthorData);
  }

  //delete author
  @Delete(':id')
  async deleteAuthor(@Param('id', ParseIntPipe) authorId: number) {
    return await this.authorsService.deleteAuthor(authorId);
  }
}
