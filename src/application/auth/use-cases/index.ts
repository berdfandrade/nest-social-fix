import { AuthenticateUserUseCase } from './authenticate-user/authenticate-user.use-case';
import { RefreshTokenUseCase } from './refresh-token/refresh-token.use-case';

export const AuthUseCases = [AuthenticateUserUseCase, RefreshTokenUseCase];
