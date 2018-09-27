const { Auth } = require("aws-amplify");

exports.get = function(req, res) {
	res.render("register");
};

exports.post = async function(req, res) {
	let { email: username, password, name } = req.body;
	try {
		const response = await Auth.signUp({
			username,
			password,
			attributes: {
				name
			}
		});

		let newUser = await response;

		req.session.user = newUser;
		res.redirect("register-confirmation");
	} catch (err) {
		if (typeof err === "string") {
			res.render("register", {
				message: err
			});
		} else if (typeof err === "object" && err.message) {
			res.render("register", {
				message: err.message
			});
		} else {
			res.redirect("oops");
		}
	}
};
