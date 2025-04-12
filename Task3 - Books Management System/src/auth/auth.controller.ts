import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerNewUser(@Body() registerUserData: RegisterUserDto) {
    return await this.authService.registerNewUser(registerUserData);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async loginUser(@Body() loginUserData: LoginUserDto) {
    return await this.authService.loginUser(loginUserData);
  }
}
