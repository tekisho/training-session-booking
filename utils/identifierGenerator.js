function generateId(length) {
	/* 
    Math.random() - random floating-point number from 0 to 1 (e.g. 0.1372398)
    .toString(36) - converts random number to 36 based numeric system (0-9, a-z)
    .substring(2, length + 2) - createas new string cutting "0."
    */
	let userId = Math.random()
		.toString(36)
		.substring(2, length + 2);
	return userId;
}

const personIdLength = 10;

function generatePersonId() {
	let generatedId;

	do {
		generatedId = generateId(personIdLength);
	} while (generatedId.length != personIdLength);

	return generatedId;
}

module.exports = {
	generatePersonId,
};
