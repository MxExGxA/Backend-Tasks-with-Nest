import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly salt = 10;

  async registerNewUser(registerUserData: RegisterUserDto) {
    const { username, password } = registerUserData;

    //check if user exsists
    const userExists = await this.prismaService.user.findUnique({ where: { username } });
    if (userExists) throw new ConflictException('This user is already exsit');

    //create user if not exist
    const hashedPassword = await bcrypt.hash(password, this.salt);

    const createdUser = await this.prismaService.user.create({
      data: { username, password: hashedPassword },
      omit: { password: true },
    });

    return { message: 'user successfully registered', createdUser };
  }

  async loginUser(loginUserData: LoginUserDto) {
    const user = await this.prismaService.user.findUnique({ where: { username: loginUserData.username } });
    if (!user) throw new UnauthorizedException('invalid username or password');

    const isPasswordMatch = await bcrypt.compare(loginUserData.password, user.password);
    if (!isPasswordMatch) throw new UnauthorizedException('invalid username or password');

    const token = await this.jwtService.signAsync({ id: user.id, username: user.username });
    const { password, ...userData } = user;

    return { message: 'user successfully logged in', userData, token };
  }
}
