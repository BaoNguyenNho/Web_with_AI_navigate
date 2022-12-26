URL = window.URL || window.webkitURL;
var gumStream;
var rec;
var result = document.getElementById("result");
var recordButton = document.getElementById("action");
var commandKeys = ['One','Two','Three','Four','Five']
var commands = {
    'One': document.getElementById("One"),
    'Two': document.getElementById("Two"),
    'Three': document.getElementById("Three"),
    'Four': document.getElementById("Four"),
    'Five': document.getElementById("Five")
}
var temp_btns ={
    'One': document.getElementById("One_btn"),
    'Two': document.getElementById("Two_btn"),
    'Three': document.getElementById("Three_btn"),
    'Four': document.getElementById("Four_btn"),
    'Five': document.getElementById("Five_btn")
}
var init = {
    "One":"https://www.google.com/",
    "Two":"https://www.facebook.com/",
    "Three":"https://www.youtube.com/",
    "Four":"https://wikipedia.org/",
    "Five":"https://mail.google.com/"
}
var regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
var j = 1;
// for (let i in commandKeys){
//     commands[i].defaultValue = init[i]
//     console.log(i);
// }
for (let i of commandKeys){

    commands[i].defaultValue = init[i]
   commands[i].addEventListener('change',function(event){
        // alert(this.value)
        localStorage.setItem(i, commands[i].value)
   })
   temp_btns[i].addEventListener('click',function(event){
        navigate(commands[i].value)
    })
}

recordButton.addEventListener("click", function(event){
    event.preventDefault();

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext;
    var input;
    var constraints = {
        audio: true,
        video: false
    } 
    /* Disable the record button until we get a success or fail from getUserMedia() */
    result.value ='';
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
        recordButton.disabled = true;
        console.log("Recording started");
        for (let i of commandKeys){
            temp_btns[i].disabled = false;
        }

        // getAudioContext().resume();

        setTimeout(() => {
            stopRecording();
            // for (let i of commandKeys){
            //     temp_btns[i].disabled = true;
            // }
        }, 1500);
    }).catch(function(err) {
        //enable the record button if getUserMedia() fails 
        recordButton.disabled = false;
    });
});


function stopRecording() {
    recordButton.disabled = false;
    console.log("Recording stopped");
    //disable the stop button, enable the record too allow for new recordings 
    
    //reset button just in case the recording is stopped while paused 
    //tell the recorder to stop the recording 
    rec.stop(); //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createDownloadLink 
    rec.exportWAV(createDownloadLink);
    // stream.getTracks()[0].stop();
}

function createDownloadLink(blob) {
    // var url = URL.createObjectURL(blob);
    // console.log("URL is " + url);
    // console.log("Blob is " + blob);

    let formData = new FormData();
    formData.append('audio', blob, 'test_audio.wav');

    fetch('http://127.0.0.1:5000/predict', {
        headers: {
            "Accept": "application/json"
          },
        method: 'POST',
        body: formData,
        contentType: 'multipart/form-data',  //multipart/form-data
        processData: false,
        mode:'cors'
    })
    .then(res => res.json()
    ).then( res => 
    {
        var ans = JSON.stringify(res.charAt(0).toUpperCase() + res.slice(1));
        // result.value = JSON.parse(ans);
        setValue(ans)
        
    });
}
// result.addEventListener("change", function(event){
//     window.open("https://www.google.com/");
// })



window.addEventListener("load", function(){
    setTable();
    for (let i of commandKeys){
        if (this.localStorage.getItem(i)){
            commands[i].value = this.localStorage.getItem(i)
        } 
     }
});

function setValue(res){
    result.value = JSON.parse(res);
    var string;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    
    if (result.value !='Blank'){
        url = commands[result.value].value
        if (result.onchange){
            string = result.value+", "+url;
            
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
    else{
        string = "Blank, No result";
        alert("Cannot recognize. Please record again")
        
    }
    localStorage.setItem(dateTime, string)
    var part =string.split(", "); 
    var text = `
            <tr>
                <td>
                    <div class="d-flex align-items-center">${j}</div>
                </td>
                <td>
                    <div class="d-flex align-items-center">${dateTime}</div>
                </td>
                <td>
                    <div class="d-flex align-items-center">${part[0]}</div>
                </td>
                <td>
                    <div class="d-flex align-items-center">${part[1]}</div>
                </td>
          </tr>`;
    sendData(part[0], part[1])
    document.getElementById("History_body").innerHTML+=text;
    
}
function navigate(url){
    // var url = commands[result.value].value;
    // console.log(url);
    if (regex.test(url)) {
        window.open(url);
    } else {
        alert("this is not url");
    }
    // window.open("https://www.google.com/");
}

function sendData(command, link){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    fetch('http://127.0.0.1:3001/users', {
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json'
          },
        method: 'POST',
        body: JSON.stringify(
            { result: [dateTime, command, link]}
            // {a:1, b: 2}
            ),
        // contentType: 'multipart/form-data',  //multipart/form-data
        processData: false,
        // mode:'no-cors'
    }).then(res => {
        console.log(res);
    })
}

function setTable(){
    // var commands = ['One','Two','Three','Four','Five'];
    
    for (let key in localStorage){
        var part =localStorage.getItem(key).split(", "); 
        if (!commandKeys.includes(key)){
            var text = `
            <tr>
                <td>
                    <div class="d-flex align-items-center">${j}</div>
                </td>
                <td>
                    <div class="d-flex align-items-center">${key}</div>
                </td>
                <td>
                    <div class="d-flex align-items-center">${part[0]}</div>
                </td>
                <td>
                    <div class="d-flex align-items-center">${part[1]}</div>
                </td>
          </tr>`;
          j++;
          document.getElementById("History_body").innerHTML+=text;
        }
    }
}
window.addEventListener("load", function(){
    
});

// result.addEventListener("change", function(){
//     setTable();
// })