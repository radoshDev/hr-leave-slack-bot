import type { Block, KnownBlock } from '@slack/types';
import type { LeaveRequest, Status } from '@prisma/client';

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

export type Blocks = (KnownBlock | Block)[];

export type LeaveDecisionStatus = Exclude<Status, 'PENDING'>;

export type LeaveDecision = {
	hrUserId: string;
	requestData: LeaveRequest;
	status: LeaveDecisionStatus;
};
