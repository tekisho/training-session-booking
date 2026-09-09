const createError = require("http-errors");

const SessionDto = require("../dtos/trainingSessionDto.js");
const sessionService = require("../services/trainingSessionService.js");

const identifierGenerator = require("../utils/identifierGenerator.js");

async function createSession(req, res, next) {
	try {
		if (!req.body.name || !req.body.trainingDate || !req.body.cardNumber || !req.body.cardExpiryDate || !req.body.cardSecureCode) {
			let badRequestError = new Error("Each field must be specified");
			badRequestError.status = 400;
			throw badRequestError;
		}

		const sessionDto = new SessionDto(
			identifierGenerator.generatePersonId(),
			req.body.name,
			req.body.trainingDate,
			{
				number: req.body.cardNumber,
				expiryDate: req.body.cardExpiryDate
			}
		);

		await sessionService.create(sessionDto);

		console.log(`New session created successfully for ${sessionDto.name}`);
		res.cookie("personId", sessionDto.personId, { maxAge: 60000 * 5, httpOnly: true });
		res.redirect(`/session/create/success/?personId=${sessionDto.personId}`);
	} catch (err) {
		console.error(`Error occurred during session creation. ${err.stack}`);
		next(err);
	}
}

async function getSessionModificationForm(req, res, next) {
	try {
		let personId = req.params.personId;

		let sessionFound = await sessionService.findByPersonId(personId);
		let sessionData = sessionFound.toObject();

		let day = sessionFound.date.getDate();
		let month = sessionFound.date.getMonth() + 1;
		let year = sessionFound.date.getFullYear();

	    let formattedDate = day.toString() + "/" + month.toString() + "/" + year.toString();

		sessionData.date = formattedDate;
		
		res.render("pages/session-modification", { 
			title: "TSB: Session Modification", 
			session: sessionData
		});
	} catch (err) {
		console.error(`Error occurred during session modification form loading. ${err.stack}`);
		next(err);
	}
}
async function modifySession(req, res, next) {
	try {
		let personId = req.params.personId;

		let sessionData = {
			name: req.body.name,
			trainingDate: req.body.trainingDate
		};

		await sessionService.modifyByPersonId(personId, sessionData)

		res.redirect("/session/list");
	} catch (err) {
		console.error(`Error occurred during session modification. ${err.stack}`);
		next(err);
	}
}

async function deleteSession(req, res, next) {
	try {
		const personId = req.params.personId;
		await sessionService.deleteByPersonId(personId);

		res.status(204).end();
		console.log(`Session with personId ${personId} sucsessfully deleted`);
	} catch (err) {
		next(err);
	}
}

async function findAllSessions(req, res, next) {
	try {
		let sessionsFound = await sessionService.findAll();

		res.render("pages/session-list", {
			title: "TSB: Session List",
			sessions: sessionsFound
		});
	} catch (err) {
		next(err);
	}
}

async function createSessionsReport(req, res, next) {
	try {
		if (!req.body.name || !req.body.fromDate || !req.body.toDate) {
			let badRequestError = new Error("Each field must be specified");
			badRequestError.status = 400;
			throw badRequestError;
		}

		let [ fromDay, fromMonth, fromYear ] = req.body.fromDate.split("/");
		let [ toDay, toMonth, toYear ] = req.body.toDate.split("/");

		let formattedFromDate = new Date(parseInt(fromYear), parseInt(fromMonth) - 1, parseInt(fromDay));
		let formattedToDate = new Date(parseInt(toYear), parseInt(toMonth) - 1, parseInt(toDay));

		if (formattedFromDate > formattedToDate) {
			let badRequestError = new Error("Intial date must be \"bigger\" or \"equal\" than final");
			badRequestError.status = 400;
			throw badRequestError;
		}

		let reportData = {
			personName: req.body.name,
			initialDate: formattedFromDate,
			finalDate: formattedToDate
		}

		let sessionsFound = await sessionService.findAllByNameAndDates(reportData.personName, reportData.initialDate, reportData.finalDate);

		res.render("pages/session-report-list", {
			title: `TSB: Session Gen. Report`,
			reportData: reportData,
			sessions: sessionsFound
		});
	} catch (err) {
		next(err);
	}
}

module.exports = {
	createSession,
	modifySession,
	getSessionModificationForm,
	deleteSession,
	createSessionsReport,
	findAllSessions,
};
