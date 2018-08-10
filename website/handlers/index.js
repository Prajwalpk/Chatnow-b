module.exports = {
	homeHandler: require("./home"),
	loginGetHandler: require("./login").get,
	loginPostHandler: require("./login").post,
	registerGetHandler: require("./register").get,
	registerPostHandler: require("./register").post,
	forgotPasswordGetHandler: require("./forgot-password").get,
	forgotPasswordPostHandler: require("./forgot-password").post,
	registerConfirmationGetHandler: require("./register-confirmation").get,
	registerConfirmationPostHandler: require("./register-confirmation").post,
	errorHandler: require("./error"),
	logOutHandler: require("./log-out")
};
