export const groupBy = (items, getKey) => {
	return items.reduce((grouped, item) => {
		const key = getKey(item);
		if (key in grouped) {
			const previousItems = grouped[key];
			return {
				...grouped,
				[key]: [...previousItems, item],
			};
		}
		return {
			...grouped,
			[key]: [item],
		};
	}, {});
};

export const getBooleanValue = (record) => {
	return record ? (record == "1" ? true : false) : null;
};
