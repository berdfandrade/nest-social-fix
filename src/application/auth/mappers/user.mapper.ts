import { UserDocument } from '@infra/database/schemas/users/user.schema';
import { instanceToInstance } from 'class-transformer';

const mapAuthUserData = (
	user: UserDocument,
	auth: { token: string; refreshToken: string },
) => {
	return instanceToInstance({
		user: {
			...user,
			password: undefined,
		},
		...auth,
	});
};

export { mapAuthUserData };
