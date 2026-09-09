const errorHandler = (err, req, res, next) => {
	err.status = (err.status) ? err.status : 500;
	
	res.render("error.ejs", {
		message: err.message,
		status: err.status,
		title: `TSB: Error ${err.status}`,
	});
};

module.exports = errorHandler;