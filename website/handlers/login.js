const { Auth } = require("aws-amplify");

exports.get = function(req, res) {
	res.render("login");
};

exports.post = async function(req, res) {
	let { email: username, password } = req.body;

	try {
		const user = await Auth.signIn(username, password);

		req.session.user = user;
		res.redirect("profile");
	} catch (err) {
		if (typeof err === "string") {
			res.render("login", {
				message: err
			});
		} else if (typeof err === "object" && err.message) {
			res.render("login", {
				message: err.message
			});
		} else {
			res.redirect("oops");
		}
	}
};
