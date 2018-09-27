const { Auth } = require("aws-amplify");

exports.get = function(req, res) {
	res.render("register-confirmation");
};

exports.post = async function(req, res) {
	let {
		user: { username }
	} = req.session.user;
	let code = req.body.code;

	try {
		const confirmation = await Auth.confirmSignUp(username, code);
		req.session.user.userConfirmed = true;

		res.redirect("profile");
	} catch (err) {
		switch (err.code) {
			case "CodeMismatchException":
				res.render("register-confirmation", { message: err.message });
				break;
			default:
				res.redirect("oops");
		}
	}
};
