module.exports = async function(req, res, next) {
	let { user } = req.session;

	if (user && user.userConfirmed) {
		res.redirect("profile");
		return;
	}

	next();
};
