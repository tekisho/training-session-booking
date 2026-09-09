const express = require("express");

const router = express.Router();
const createError = require("http-errors");

const sessionController = require("../controllers/trainingSessionController.js");

router.get("/booking", (req, res, next) => {
	res.render("pages/session-booking", { title: "TSB: Session Booking" });
});

router.post("/create", sessionController.createSession);
router.get("/create/success", (req, res, next) => {
	// using cookies.personId & query.personId to restrict access to page (restricted, if booking wasnt made or made not within dedicated time)
	let savedPersonId = req.cookies.personId;
	let queryPersonId = req.query.personId;

	if (!queryPersonId || savedPersonId != queryPersonId) {
		next(createError(404));
	}

	res.render("pages/session-creation-success", {
		title: "TSB: Session Registered",
		personId: savedPersonId,
	});
});

router.get("/list", sessionController.findAllSessions);

router.get("/modify/:personId", sessionController.getSessionModificationForm)
router.post("/modify/:personId", sessionController.modifySession);

router.delete("/delete/:personId", sessionController.deleteSession);

router.get("/report", (req, res, next) => {
	res.render("pages/session-report", { title: "TSB: Session Report" });
});
router.post("/report", sessionController.createSessionsReport);

module.exports = router;
