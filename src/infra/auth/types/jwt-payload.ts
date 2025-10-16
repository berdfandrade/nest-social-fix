import { Roles } from '@common/constants/enums/user-roles.constant';

export type JwtPayloadProps = {
	sub: string;
	role: Roles;
	iat: number;
	exp: number;
};
