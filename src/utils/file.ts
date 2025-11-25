export const convertCsvToArray = (csv) => {
	const rows = csv.split("\n");
	const records = [] as any[];
	rows.forEach((row) => {
		records.push(row.split(","));
	});
	records.shift();
	return records;
};
