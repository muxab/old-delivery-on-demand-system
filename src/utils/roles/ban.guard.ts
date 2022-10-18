import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccountStatus } from './account-status.enum';
import { STATUS_KEY } from './ban.decorator';

@Injectable()
export class BanGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredStatus = this.reflector.getAllAndOverride<AccountStatus[]>(STATUS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredStatus) {
      return true;
    }
    const {user} = context.switchToHttp().getRequest();

    return requiredStatus.some((status)=> user.status?.includes(status));
  }
}
