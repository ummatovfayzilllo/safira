import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { jwtTokenType, jwtTokenTypeEnum } from '../types/jwt.types';

export const getJwtOptions = (
  config: ConfigService,
  type: jwtTokenType = jwtTokenTypeEnum.ACCESS,
) => {
  const options: JwtSignOptions = {
    secret: config.get<string>(`JWT_${type.toLocaleUpperCase()}_SECRET`),
    expiresIn: config.get<string>(`JWT_${type.toLocaleUpperCase()}_EXPIRES_IN`),
  };
  return options;
};

export const getToken = async (
  jwtService: JwtService,
  payload: any,
  config: ConfigService,
  type: jwtTokenType = jwtTokenTypeEnum.ACCESS,
) => {
  const token = await jwtService.signAsync(
    payload,
    getJwtOptions(config, type),
  );
  return token;
};

export const decodeToken = async <T>(
  jwtService: JwtService,
  token: string,
  config: ConfigService,
  type: jwtTokenType = jwtTokenTypeEnum.ACCESS,
) => {
  // @ts-ignore
  const result: T = await jwtService.verifyAsync<T>(token, {
    secret: getJwtOptions(config, type).secret,
  });
  return result;
};
