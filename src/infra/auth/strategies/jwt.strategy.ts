import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'src/env';
import { AuthService } from '../auth.service';
import { JwtPayloadProps } from '../types/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: env.JWT_SECRET,
		});
	}

	public async validate(jwtPayload: JwtPayloadProps) {
		const user = await this.authService.validateUser(jwtPayload.sub);
		if (!user) {
			throw new ForbiddenException(
				'Usuário não encontrado. Faça login novamente.',
			);
		}

		return user;
	}
}
