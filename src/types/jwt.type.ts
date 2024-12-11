import { Role } from '../schemas/user.schema';

export interface JwtPayload {
  role: Role;
  id: string;
}
