var result = document.getElementById('result')
function setTable(){
    var commands = ['One','Two','Three','Four','Five'];
    var j = 1;
    for (let key in localStorage){
        var part =localStorage.getItem(key).split(", "); 
        if (!commands.includes(key)){
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
    setTable();
});

result.addEventListener("change", function(){
    setTable();
})