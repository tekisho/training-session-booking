const sessionModel = require("../models/training-session.js");

async function create(sessionDto) {
	const newSession = new sessionModel({
		personId: sessionDto.personId,
		name: sessionDto.name,
		date: sessionDto.trainingDate,
		card: {
			number: sessionDto.card.number,
			expiryDate: sessionDto.card.expiryDate
		},
	});

	await newSession.save();
}

async function findByPersonId(personId) {
	let session = await sessionModel.findOne({ personId: personId });

	if (session === null) {
		let badRequestError = new Error(`Session with person id ${personId} was not found`);
		badRequestError.status = 404;
		throw badRequestError;
	}

	return session;
}

async function modifyByPersonId(personId, sessionData) {
	let session = await findByPersonId(personId);

	let [ day, month, year ] = sessionData.trainingDate.split("/");
	let formattedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).setHours(0, 0, 0, 0);

	if (session.name === sessionData.name && session.date.getTime() === formattedDate) {
		let badRequestError = new Error("At least one field must differ");
		badRequestError.status = 400;
		throw badRequestError;
	}

	session.name = sessionData.name;
	session.date = sessionData.trainingDate;

	await session.save();
}

async function deleteByPersonId(personId) {
	let session = await sessionModel.findOneAndDelete({ personId: personId });

	if (session === null) {
		let badRequestError = new Error(`Session with person id ${personId} was not found`);
		badRequestError.status = 404;
		throw badRequestError;
	}
}

async function findAll() {
	let sessionsFound = await sessionModel.find().sort({ updatedAt: -1 });
	return sessionsFound;
}

async function findAllByNameAndDates(personName, fromDate, toDate) {
	let sessionsFound = await sessionModel.find({ 
		name: personName,
		date: {
			$gte: fromDate,
			$lte: toDate
		}
	}).sort({ createdAt: 1 });

	return sessionsFound;
}

module.exports = {
	create,
	modifyByPersonId,
	deleteByPersonId,
	findByPersonId,
	findAll,
	findAllByNameAndDates
};
