const express = require('express');
const router = express.Router();

var { checkTimer,initalTimer,fetchQuestions,saveAns,getAns,checkAnsStatus } = require("../controller/extra.controller");

router.route("/testTimer").post(checkTimer);
router.route("/initalTimer").post(initalTimer);
router.route("/fetchQuestions").get(fetchQuestions);
router.route("/saveAns").post(saveAns);
router.route("/getAns").post(getAns);
router.route("/checkAnsStatus").post(checkAnsStatus);

module.exports = router;