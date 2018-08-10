const express = require("express");
const logger = require("morgan");
const hbs = require("express-handlebars");
const compression = require("compression");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const Amplify = require("aws-amplify").default;
const helmet = require("helmet");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

global.fetch = require("node-fetch");

const requiresLogin = require("./middlewares/auth");
const hasLoggedIn = require("./middlewares/hasLoggedIn");
const {
	homeHandler,
	loginGetHandler,
	loginPostHandler,
	registerGetHandler,
	registerPostHandler,
	forgotPasswordGetHandler,
	forgotPasswordPostHandler,
	registerConfirmationGetHandler,
	registerConfirmationPostHandler,
	errorHandler,
	logOutHandler
} = require("./handlers");

const CONFIG = {
	cognito: {
		REGION: "us-east-1",
		USER_POOL_ID: "us-east-1_iyNsjToDL",
		APP_CLIENT_ID: "767b6ncekh4mh1ue0r7s57usu3",
		IDENTITY_POOL_ID: "us-east-1:b5c55085-f4b8-4a30-ac56-5e17b499b6c6"
	}
};

Amplify.configure({
	Auth: {
		mandatorySignIn: true,
		region: CONFIG.cognito.REGION,
		userPoolId: CONFIG.cognito.USER_POOL_ID,
		identityPoolId: CONFIG.cognito.IDENTITY_POOL_ID,
		userPoolWebClientId: CONFIG.cognito.APP_CLIENT_ID
	}
});

const app = express();

app.set("port", process.env.PORT || 8888);
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", hbs({ defaultLayout: "skeleton" }));
app.set("view engine", "handlebars");

app.use(helmet());
app.use(compression());
app.use(logger("dev"));
app.use(cookieParser());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		name: "session",
		keys: ["deakin", "chatnow-b"],
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	})
);
const PORT = app.get("port");

app.listen(PORT, start);

// Routes

app.get("/", homeHandler);
app.get("/login", hasLoggedIn, loginGetHandler);
app.post("/login", loginPostHandler);
app.get("/register", hasLoggedIn, registerGetHandler);
app.post("/register", hasLoggedIn, registerPostHandler);
app.get("/register-confirmation", hasLoggedIn, registerConfirmationGetHandler);
app.post(
	"/register-confirmation",
	hasLoggedIn,
	registerConfirmationPostHandler
);
app.get("/forgot-password", hasLoggedIn, forgotPasswordGetHandler);
app.get("/log-out", logOutHandler);

app.get("/access-denied", hasLoggedIn, (req, res) => res.send("Access denied"));
app.get("/profile", requiresLogin, (req, res) => {
	res.render("Profile");
});
app.get("/oops", errorHandler);

//  Functions

function start() {
	console.log(`Chatnow-b is now runnig at http://localhost:${PORT}`);
}
