const router = require('express').Router();


//user routes
router.get("/", (req, res) => {
	res.send("Accessed user");
});

module.exports = router;