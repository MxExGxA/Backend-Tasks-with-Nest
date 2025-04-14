import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthService } from './auth.service';

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
