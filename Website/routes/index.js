var express = require('express');
var router = express.Router();
// var anotherrecord = require('../public/javascripts/anotherrecord')
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('E:/Temporary (chứa code các bài tập)/Da_phuong_tien/Website/scratch');
    console.log("localstorage");
  }
  // console.log(localStorage)
  // keys = Object.keys(localStorage);
  // console.log(keys);
  var his=[];
  for (let i = 0; i < localStorage.length; i++){
      var arr= localStorage.getItem(localStorage.key(i)).split(",")
      his.push({
          dateTime:localStorage.key(i), 
          command:JSON.stringify(arr[0]),
          link: JSON.stringify(arr[1])
      })
  }
  // console.log(data);
  res.render('index_fake', { title: 'Express', history:his });
});

// if (typeof localStorage === "undefined" || localStorage === null) {
//   var LocalStorage = require('node-localstorage').LocalStorage;
//   localStorage = new LocalStorage('E:/Temporary (chứa code các bài tập)/Da_phuong_tien/Website/scratch');
//   console.log("localstorage");
// }

// anotherrecord
module.exports = router;
