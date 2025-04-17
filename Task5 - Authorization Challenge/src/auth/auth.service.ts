import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly salt = 10;

  async registerUser(registerUserData: RegisterUserDto) {
    const { username, password } = registerUserData;

    //check if user exists
    const user = await this.prismaService.user.findUnique({ where: { username } });
    if (user) throw new ConflictException('This User is already Exists!');

    const hashedPassword = await bcrypt.hash(password, this.salt);
    const createdUser = await this.prismaService.user.create({
      data: { username, password: hashedPassword },
      omit: { password: true },
    });

    return { message: 'User Successfully Created', createdUser };
  }

  async loginUser(loginUserData: LoginUserDto) {
    const { username, password } = loginUserData;

    //check if user exists
    const user = await this.prismaService.user.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException('invalid username or password!');

    //check if password matches
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('invalid username or password!');

    //login user
    const token = await this.jwtService.signAsync({ id: user.id, username: user.username, role: user.role });

    return { message: 'User Successfully Logged In', user: { id: user.id, username, role: user.role }, token };
  }
}
