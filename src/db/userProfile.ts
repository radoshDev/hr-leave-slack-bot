import { prisma } from './prisma';
import type { UserProfile } from '@prisma/client';
import type { WebClient } from '@slack/web-api';

type CreateUserProfile = (args: {
	userId: string;
	client: WebClient;
}) => Promise<UserProfile>;

export const createUserProfile: CreateUserProfile = async ({
	userId,
	client,
}) => {
	const existing = await prisma.userProfile.findUnique({ where: { userId } });

	if (existing) return existing;

	const info = await client.users.info({ user: userId });

	const fullName =
		info.user?.real_name ||
		info.user?.profile?.real_name ||
		info.user?.name ||
		'Unknown';

	return prisma.userProfile.create({
		data: {
			userId,
			fullName,
		},
	});
};
