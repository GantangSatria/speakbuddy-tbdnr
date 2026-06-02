export interface JwtPayload {
  sub: string;   // user id
  email: string;
  role: string;
}

export interface ITokenService {
  sign(payload: JwtPayload): string;
  verify(token: string): JwtPayload;
}