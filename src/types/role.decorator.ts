import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/schemas/user.schema';

export const RolesKey = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(RolesKey, roles);
