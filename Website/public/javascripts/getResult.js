const getResult = (blob) => {

    const fs = require('fs');
    let formData = new FormData();
    let result;
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
        result = JSON.stringify(res.charAt(0).toUpperCase() + res.slice(1));
        fs.writeFile('../data/table.json', 
        {
            Result: result

        }, function (err, data) {
            if (err) throw err;
            console.log('write file successfully');
        });
    });
}

export {getResult}