import { Roles } from '@common/constants/enums/user-roles.constant';

import { SetMetadata } from '@nestjs/common';

export const ALLOWED_ROLES_KEY = Symbol('allowedRoles');

export const AllowedRoles = (...roles: Roles[]) =>
	SetMetadata(ALLOWED_ROLES_KEY, roles);
