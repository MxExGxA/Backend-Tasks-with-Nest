import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request['user'];

    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles.includes(user.role)) {
      throw new ForbiddenException('You Do Not Have The Permission To Access This Route!');
    }

    return true;
  }
}
