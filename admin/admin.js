const router = require('express').Router();


//Admin route
router.get("/", (req, res) => {
	res.send("Accessed Admin");
});

module.exports = router;