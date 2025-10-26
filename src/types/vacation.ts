export type ParsedVacation = {
	start: Date;
	end: Date;
	days: number;
};

export type ParsedVacationWithUser = ParsedVacation & {
	userId: string;
};
