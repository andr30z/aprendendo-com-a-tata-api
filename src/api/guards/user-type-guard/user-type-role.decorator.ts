import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/api/users';

export const ROLES_KEY = 'type';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
