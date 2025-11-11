import type { LeaveRequest, Status } from '@prisma/client';
import type {
	BlockButtonAction,
	BlockStaticSelectAction,
	Middleware,
	SlackActionMiddlewareArgs,
	SlackCommandMiddlewareArgs,
	SlackEventMiddlewareArgs,
} from '@slack/bolt';
import type { Block, KnownBlock } from '@slack/types';

export type ActionMiddleware = Middleware<
	SlackActionMiddlewareArgs<BlockButtonAction>
>;

export type SelectMiddleware = Middleware<
	SlackActionMiddlewareArgs<BlockStaticSelectAction>
>;

export type CommandMiddleware = Middleware<SlackCommandMiddlewareArgs>;

export type MessageMiddleware = Middleware<SlackEventMiddlewareArgs<'message'>>;

export type Blocks = (KnownBlock | Block)[];

export type LeaveDecisionStatus = Exclude<Status, 'PENDING'>;

export type LeaveDecision = {
	hrUserId: string;
	requestData: LeaveRequest;
	status: LeaveDecisionStatus;
};
