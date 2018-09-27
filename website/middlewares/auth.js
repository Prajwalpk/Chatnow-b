module.exports = function(req, res, next) {
	console.dir(req.session.user);
	if (req.session.user) {
		next();
		return;
	}

	res.render("access-denied");
};
