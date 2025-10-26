export type ParsedVacation = {
	startDate: Date;
	endDate: Date;
	days: number;
	year: number;
};

export type ParsedVacationWithUser = ParsedVacation & {
	userId: string;
};
