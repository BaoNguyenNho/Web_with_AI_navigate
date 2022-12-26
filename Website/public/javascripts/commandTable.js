const commandTable = () => {
    const fs = require('fs');
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

    const isBtnEnable = (bool) => {
        for (let i of commandKeys){
            temp_btns[i].disabled = bool;
        }
    }

    const setCommands= () => {
        for (let i of commandKeys){
            commands[i].addEventListener('change',function(event){
                localStorage.setItem(i, commands[i].value)
                saveLink(i, commands[i].value)
            })
            temp_btns[i].addEventListener('click',function(event){
                navigate(commands[i].value)
            })
        }

        const saveLink = (key, value) => {
            fs.writeFile('../data/table.json', 
            {
                key: value

            }, function (err, data) {
                if (err) throw err;
                console.log('write file successfully');
            });
        }

        var regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
        const navigate = (url) => {
            if (regex.test(url)) {
                window.open(url);
            } else {
                alert("this is not url");
            }
        }
    }

    const initialLink = () =>{
        fs.readFile('../data/initial.json', 'utf8', (err, data) => {

            if (err) {
                console.log(`Error reading file from disk: ${err}`);
            } else {
        
                // parse JSON string to JSON object
                const initial = JSON.parse(data);
        
                // print all databases
                for (let i of commandKeys){
                    commands[i].value = initial[i]
                 }
            }
        });
    }
    
}



module.exports = commandTable;