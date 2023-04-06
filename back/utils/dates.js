const getIsoDate = (dateStr) => {
	const date = new Date(dateStr);
	return date.toISOString();
};

module.exports = { getIsoDate };
