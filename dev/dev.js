const router = require('express').Router();


//dev routes 
router.get("/", (req, res) => {
	res.send("Accessed Dev");
});

module.exports = router;