import { Role } from '@prisma/client';

export type jwtTokenType = 'ACCESS' | 'REFRESH';

export interface JwtPayload {
  id: string;
  role: Role;
}

export interface JwtVerfyPayload {
  email: string;
  code: number;
  ip: string;
  agent: string;
}

export const enum jwtTokenTypeEnum {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}
