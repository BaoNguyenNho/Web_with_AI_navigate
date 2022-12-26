var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
const cors = require('cors');
router.use(cors({
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
router.post('/', cors(), function(req, res, next) {
  dateTime = req.body.result[0];
  command = req.body.result[1];
  link = req.body.result[2];
  console.log("The request is ", req.body.result);
  res.send("hello " + JSON.stringify(req.body.result))
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('E:/Temporary (chứa code các bài tập)/Da_phuong_tien/Website/scratch');
    console.log("localstorage");
  }
  localStorage.setItem( dateTime, ([command, link]));
});




module.exports = router;
