module.exports = function(req, res, next) {
	res.status(500);
	res.render("error");
};
