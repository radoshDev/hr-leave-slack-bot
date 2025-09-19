export const isValidTimeZone = (tz: string) => {
	try {
		new Intl.DateTimeFormat("en-US", { timeZone: tz }).format();
		return true;
	} catch {
		return false;
	}
};
