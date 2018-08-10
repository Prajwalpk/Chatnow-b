const { Auth } = require("aws-amplify");

exports.get = function(req, res) {
	res.render("login");
};

exports.post = async function(req, res) {
	let { email: username, password, name } = req.body;

	try {
		const user = await Auth.signIn({
			username,
			password
		});

		req.session.user = user;
		res.redirect("profile");
	} catch (err) {
		res.redirect("oops");
	}
};
