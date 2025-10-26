import type {
	BlockButtonAction,
	Middleware,
	SlackActionMiddlewareArgs,
} from '@slack/bolt';

export type ActionMiddleware = Middleware<
	SlackActionMiddlewareArgs<BlockButtonAction>
>;
