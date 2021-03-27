//importing jsonwebtoken package
const jwt = require('jsonwebtoken');

//some temp jwt_secret generally this will be taken from the .env
const JWT_SECRET="1337_SECRET_TOKEN";

//expiry time of the token
const JWT_EXPIRY_TIME='1337h';



//to send error message to the end point
sendError = (res, err, respcode) => {
	err = err || "Internal server error";
	respcode = respcode || 500;
	if (typeof err !== "string") err = "Internal server error!";
	let message = {
		code: respcode,
		status: "error",
		message: err,
	};
	res.status(respcode);
	res.json(message);
	res.end();
};

//to send success message to the end point
sendSuccess = (res, data) => {
	respcode = 200;
	data = data === undefined ? {} : data;
	let message = {
		code: respcode,
		status: "success",
		data: data,
	};
	res.status(respcode);
	res.json(message);
	res.end();
};




//this function returns token from the headers if exists or returns null
retriveToken = req => {
	return req.headers["token-jwt"] || null;
};

//to decode the jwt token
decodeToken = (token) => {
	return jwt.verify(token, JWT_SECRET, (err, data) => {
		if (err) {	
			return false;
		}
		return data;
	});
};

//to generate the token
generateToken = (data, secret = JWT_SECRET) => {
	return jwt.sign(data, secret, {
		expiresIn: JWT_EXPIRY_TIME,
	});
};

module.exports = {
	admin: (req, res, next) => {
		//retriving the tokken 
		token = retriveToken(req);
		req.jwt_token = token;

		//if token doesn't exists
		if (!token) return sendError(res, "No token", 403);

		//decoding token
		data = decodeToken(token);

		//if decode doesn't return the user data
		if (!data.user) return sendError(res, "Invalid Token", 403);
		req.jwt_data = data;

		//checking the role of the user 
		//this is generally done after retriving the user data from the db but for now we are doing it static
		if(data.user.role === 'admin'){
			next();
		}
		//if user is not admin then send error message
		else
			return sendError(res, "client is not admin", 403);		
	},

	dev: (req, res, next) => {
		token = retriveToken(req);
		req.jwt_token = token;

		if (!token) return sendError(res, "No token", 403);
		data = decodeToken(token);

		if (!data.user) return sendError(res, "Invalid Token", 403);
		req.jwt_data = data;

		if(data.user.role === 'dev')
			next();
		
		else
			return sendError(res, "Client is not dev", 403);		
	},

	user: (req, res, next) => {
		token = retriveToken(req);
		req.jwt_token = token;

		if (!token) return sendError(res, "No token", 403);
		data = decodeToken(token);

		if (!data.user) return sendError(res, "Invalid token", 403);
		req.jwt_data = data;

		if(data.user.role === 'user')
			next();
		
		else
			return sendError(res, "Client is not user", 403);
	},
	
	generateToken,
	sendError,
	sendSuccess,
};