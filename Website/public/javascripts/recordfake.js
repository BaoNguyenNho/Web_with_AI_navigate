URL = window.URL || window.webkitURL;
const fs = require('fs');
import { commandTable } from "./commandTable";
import { getResult } from "./getResult";
// import {LocalStorage} from "node-localstorage";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// import { LocalStorage } from "node-localstorage/LocalStorage.js";
// localStorage = new LocalStorage('E:/Temporary (chứa code các bài tập)/Da_phuong_tien/Website/scratch');
var gumStream;
var rec;
var result = document.getElementById("result").setValue('');
var recordButton = document.getElementById("action");
// var commandKeys = ['One','Two','Three','Four','Five']
// var commands = {
//     'One': document.getElementById("One"),
//     'Two': document.getElementById("Two"),
//     'Three': document.getElementById("Three"),
//     'Four': document.getElementById("Four"),
//     'Five': document.getElementById("Five")
// }
// var temp_btns ={
//     'One': document.getElementById("One_btn"),
//     'Two': document.getElementById("Two_btn"),
//     'Three': document.getElementById("Three_btn"),
//     'Four': document.getElementById("Four_btn"),
//     'Five': document.getElementById("Five_btn")
// }
// var regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
// var regex = new RegExp(expression);


commandTable.setCommands();
window.addEventListener("load", function(){
    commandTable.initialLink();
});
recordButton.addEventListener("click", function(event){
    event.preventDefault();
    // console.log("recordButton clicked");

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext;
    var input;
    var constraints = {
        audio: true,
        video: false
    } 
    /* Disable the record button until we get a success or fail from getUserMedia() */

    recordButton.disabled = true;
    result.value='';
    /* We're using the standard promise based getUserMedia()

    https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia */

    navigator.mediaDevices.getUserMedia(constraints).then( function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ..."); 
        /* assign to gumStream for later use */
        gumStream = stream;
        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);
        /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
        rec = new Recorder(input, {
            numChannels: 1
        }) 
        //start the recording process 
        rec.record()
        console.log("Recording started");
        commandTable.isBtnEnable(true)

        setTimeout(() => {
            stopRecording();
        }, 1500);
    }).catch(function(err) {
        //enable the record button if getUserMedia() fails 
        recordButton.disabled = false;
    });
});


function stopRecording() {
    console.log("Recording stopped");
    //disable the stop button, enable the record too allow for new recordings 
    recordButton.disabled = false;
    //reset button just in case the recording is stopped while paused 
    //tell the recorder to stop the recording 
    rec.stop(); //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createDownloadLink 
    rec.exportWAV(getResult);

    fs.readFile('../data/table.json', 'utf8', (err, data) => {

        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        } else {
    
            const dt = JSON.parse(data);
            result.value = dt["Result"]
        }
    });
    // stream.getTracks()[0].stop();
}



// for (let i of commandKeys){

//    commands[i].addEventListener('change',function(event){
//         // alert(this.value)
//         localStorage.setItem(i, commands[i].value)
//    })
//    temp_btns[i].addEventListener('click',function(event){
//         navigate(commands[i].value)
//     })
// }



function setValue(res){
    result.value = JSON.parse(res);
    url = commands[result.value].value
    if (result.onchange){
        for (let i of commandKeys){
            temp_btns[i].disabled = false;
        }
        setTimeout(() => {
            navigate(url)
            for (let i of commandKeys){
                temp_btns[i].disabled = true;
            }
        }, 1500);
    } 
}
// function navigate(url){
//     // var url = commands[result.value].value;
//     // console.log(url);
//     if (regex.test(url)) {
//         window.open(url);
//     } else {
//         alert("this is not url");
//     }
//     // window.open("https://www.google.com/");
// }

