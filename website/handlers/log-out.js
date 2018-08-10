const { Auth } = require("aws-amplify");

module.exports = async function(req, res) {
	try {
		let signOff = await Auth.signOut();
		req.session = null;

		res.redirect("/");
	} catch (err) {
		res.redirect("oops");
	}
};
