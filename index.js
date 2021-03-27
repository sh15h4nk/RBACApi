const express = require('express');
const jwtManager = require('./JwtManager');
const morgan = require('morgan');

//initiating app
app = express();

//using morgan to log the requests 
app.use(morgan('combined'));

//to parse the data in the requests
app.use(express.json({ limit: "5MB" }));

//host and port
API_BIND_ADDR = "0.0.0.0";
API_PORT = 1337;

//modules of the users with different access level
app.use("/admin", jwtManager.admin, require("./admin/admin"))
app.use("/dev", jwtManager.dev, require("./dev/dev"))
app.use("/user", jwtManager.user, require("./user/user"))

//index route
app.get('/',(req, res) => {
	res.send("Available routes /admin /dev /user to generate token post name and role to /generate");
});


//to generate a token
app.post('/generate', (req, res) => {
	const { name, role } = req.body || null;
	if (!name || !role) res.status(406).send({"status":406, error:"missing name or role or both"});
	var data = {user: {name: name, role: role} }
	token = jwtManager.generateToken(data);
	res.send("Here is the token : " + token);
});

//listening app on the bindded address and port
app.listen(API_PORT, API_BIND_ADDR, () => {
	console.log(`Server running on ${API_BIND_ADDR}:${API_PORT} `);
});