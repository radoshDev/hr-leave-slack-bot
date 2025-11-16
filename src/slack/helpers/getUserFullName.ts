import type { WebClient } from '@slack/web-api';

type Props = {
	client: WebClient;
	userId: string;
};

export const getUserFullName = async ({ client, userId }: Props) => {
	const info = await client.users.info({ user: userId });

	const fullName =
		info.user?.real_name ||
		info.user?.profile?.real_name ||
		info.user?.name ||
		'Unknown';

	return fullName;
};
