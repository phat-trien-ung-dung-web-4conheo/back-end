const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("we are on login");
});

module.exports = router;
