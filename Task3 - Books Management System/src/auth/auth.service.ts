import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  private readonly salt = 10;

  async registerNewUser(registerUserData: RegisterUserDto) {
    const { username, password } = registerUserData;

    //check if user exists
    const userExist = await this.prismaService.user.findUnique({ where: { username: registerUserData.username } });
    if (userExist) throw new ConflictException(`The User is Already Exist`);

    const hashedPassword = await bcrypt.hash(password, this.salt);

    const createdUser = await this.prismaService.user.create({
      data: { username, password: hashedPassword },
      omit: { password: true },
    });
    return { message: 'user successfully registered', createdUser };
  }

  async loginUser(loginUserData: LoginUserDto) {
    const { username, password } = loginUserData;

    const user = await this.prismaService.user.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException();

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new UnauthorizedException();

    const token = await this.jwtService.signAsync({ id: user.id, username });

    return { message: 'user successfully logged in', token };
  }
}
