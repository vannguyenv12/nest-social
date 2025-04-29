import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const currentUser = request.currentUser;

    const requiredRoles = this.reflector.get(
      ROLES_KEY,
      context.getHandler(),
    ) as IRole[];

    if (!requiredRoles) {
      return true;
    }

    if (requiredRoles.length === 0) {
      return true;
    }

    if (requiredRoles.includes('admin') && currentUser.role === 'admin') {
      return true;
    }

    if (requiredRoles.includes('user') && currentUser.role === 'user') {
      const userId = currentUser._id;
      const resourceId = request.params.id;

      if (userId === resourceId) return true;
      throw new ForbiddenException('You can only access your own resources');
    }

    throw new ForbiddenException('You do not have enough permission');
  }
}
