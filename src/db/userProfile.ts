import { prisma } from './prisma';
import type { UserProfile } from '@prisma/client';

type CreateUserProfile = (args: {
	userId: string;
	fullNameProvider: () => Promise<string>;
}) => Promise<UserProfile>;

export const createUserProfile: CreateUserProfile = async ({
	userId,
	fullNameProvider,
}) => {
	const existing = await prisma.userProfile.findUnique({ where: { userId } });

	if (existing) return existing;

	const fullName = await fullNameProvider();

	return prisma.userProfile.create({
		data: {
			userId,
			fullName,
		},
	});
};

export const updateUserFullName = async (userId: string, fullName: string) => {
	return prisma.userProfile.upsert({
		where: { userId },
		create: { userId, fullName },
		update: { fullName },
	});
};
