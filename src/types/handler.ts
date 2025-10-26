import type {
	BlockButtonAction,
	Middleware,
	SlackActionMiddlewareArgs,
	SlackEventMiddlewareArgs,
} from '@slack/bolt';

export type ActionMiddleware = Middleware<
	SlackActionMiddlewareArgs<BlockButtonAction>
>;

export type MessageMiddleware = Middleware<SlackEventMiddlewareArgs<'message'>>;
