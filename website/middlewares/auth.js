module.exports = function(req, res, next) {
	if (req.session.user) {
		next();
		return;
	}

	res.render("access-denied");
};
