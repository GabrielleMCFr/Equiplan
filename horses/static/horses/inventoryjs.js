document.addEventListener('DOMContentLoaded', function() {

    // views
    document.getElementById('myinventory').style.display = 'block';
    document.getElementById('editinventory').style.display = 'none';
    document.getElementById('itemedit').style.display = 'none';
    document.getElementById('itemsearch').style.display = 'none';


    // wait for search event   
    document.querySelector('#searchitem').addEventListener('submit', () => search(event));
});


function add() {
    // views
    document.getElementById('myinventory').style.display = 'none';
    document.getElementById('editinventory').style.display = 'block';
    document.getElementById('itemedit').style.display = 'none';
    document.getElementById('itemsearch').style.display = 'none';
}

function goback() {
    document.getElementById('myinventory').style.display = 'block';
    document.getElementById('editinventory').style.display = 'none';
    document.getElementById('itemedit').style.display = 'none';
    document.getElementById('itemsearch').style.display = 'none';
}


function del(id) {

     //delete the form with a function
     fetch(`/edititem/${id}`)
     .then(response => response.json())
     .then(message => {
         console.log(message);

         
         // hide nicely with an animation and remove at the end of it:
         element = document.getElementById(`row+${id}`);
         element.style.animationPlayState = 'running';
         setTimeout(function (){
            element.remove()    
          }, 1500);
 
     })
     .catch(error => console.log(error));
}



function edititem(id) {

    // change views
    document.getElementById('myinventory').style.display = 'none';
    document.getElementById('editinventory').style.display = 'none';
    document.getElementById('itemedit').style.display = 'block';
    document.getElementById('itemsearch').style.display = 'none';

    element = document.getElementById('itemedit')
    element2 = document.getElementById('myinventory')

    //take actual values : 
    var actualname = document.getElementById(`col1+${id}`).getAttribute("data-value"); 
    var actualmol = document.getElementById(`col2+${id}`).getAttribute("data-value"); 
    var actualquant = document.getElementById(`col3+${id}`).getAttribute("data-value"); 
    var actuallot = document.getElementById(`col4+${id}`).getAttribute("data-value"); 
    var actualdate = document.getElementById(`col5+${id}`).getAttribute("data-value"); 


    if (actualdate != null) {
        var d = new Date(actualdate)
        d3 = d.getDate()
        d4 = d.getMonth()+1
        d5 = d.getFullYear()
        var actualdate = d5 + '-' + d4  + '-' + d3   
    }
    

    // prefill the form 
    element.querySelector('#itemdate').value = actualdate;
    element.querySelector('#itemname').value = actualname;
    element.querySelector('#itemmol').value = actualmol;
    element.querySelector('#itemquantity').value = actualquant;
    element.querySelector('#itemlot').value = actuallot;
    
    // event listener here: 
    element.querySelector('#itedit').onsubmit = function(e) {
        e.preventDefault();
        // get new values
        const newname = element.querySelector('#itemname').value;
        const newmol = element.querySelector('#itemmol').value;
        const newquant = element.querySelector('#itemquantity').value;
        const newlot = element.querySelector('#itemlot').value;
        const newdate = element.querySelector('#itemdate').value

        //get actual date
        var aujourdhui = new Date();
        var jour = aujourdhui.getUTCDate();

        //check that quantity value isnt negative. and maybe check for valid date ? 
        if (newquant < 0) {
            element.querySelector('#warning').innerHTML = "La quantité de produit ne peut être inférieure à 0."
        }

        if (newname.length < 1 ) {
            element.querySelector('#warning').innerHTML = "Le nom n'est pas indiqué."    
        }

        else {

            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/edititem/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    name : newname,
                    mol : newmol,
                    quantity : newquant,
                    lot : newlot, 
                    date : newdate,
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => response.json())
            .then(editeditem => { 
                console.log(editeditem)

                // format date
                var mydate = new Date(`${editeditem.dateend}`);
                var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
                var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

                // change div to actualize (just the row or just the 4 firsts col of the row)
                document.getElementById(`col1+${id}`).innerHTML = `${editeditem.name}`;
                document.getElementById(`col1+${id}`).setAttribute('data-value', `${editeditem.name}`);
                document.getElementById(`col2+${id}`).innerHTML = `${editeditem.molecule}`;
                document.getElementById(`col2+${id}`).setAttribute('data-value', `${editeditem.molecule}`);
                document.getElementById(`col3+${id}`).innerHTML = `${editeditem.quantity}`;
                document.getElementById(`col3+${id}`).setAttribute('data-value', `${editeditem.quantity}`);
                document.getElementById(`col4+${id}`).innerHTML = `${editeditem.lot}`;
                document.getElementById(`col4+${id}`).setAttribute('data-value', `${editeditem.lot}`);
                document.getElementById(`col5+${id}`).innerHTML = `${formateddate}`;
                document.getElementById(`col5+${id}`).setAttribute('data-value', `${editeditem.dateend}`);

                if (editeditem.quantity == null) {
                    document.getElementById(`col3+${id}`).innerHTML = ' '
                }

                if (editeditem.dateend == null) {
                    document.getElementById(`col5+${id}`).innerHTML = ' '  
                }

                if (editeditem.over == true) {
                    document.getElementById(`col5+${id}`).className = "warning"
                }

                if (editeditem.over == false) {
                    document.getElementById(`col5+${id}`).className = "normal"
                }

                if (editeditem.empty == false) {
                    document.getElementById(`row+${id}`).className = "anime"
                    document.getElementById(`col6+${id}`).innerHTML = `<button class="btn btn-light" id="edit+${id}" title="Modifier" onclick=edititem(${id})>✍</button>
                    <button class="btn btn-light" id="empty+${id}" title="Déclarer vide" onclick=empty(${id})>🗑</button>
                    <button class="btn btn-light" id="del+${id}" title="Supprimer" onclick=del(${id})>❌</button>`
                }

                if (editeditem.empty == true) {
                    document.getElementById(`row+${id}`).className = "empty anime"
                    document.getElementById(`col5+${id}`).className = "normal"
                    document.getElementById(`col6+${id}`).innerHTML = `<button class="btn btn-light" id="edit+${id}" title="Modifier" onclick=edititem(${id})>✍</button>
                    <button class="btn btn-light" id="del+${id}" title="Supprimer" onclick=del(${id})>❌</button>`
                }

                // change views
                document.getElementById('myinventory').style.display = 'block';
                document.getElementById('editinventory').style.display = 'none';
                document.getElementById('itemedit').style.display = 'none';
                document.getElementById('itemsearch').style.display = 'none';

            })
            .catch(error => console.log(error));
        }
    }    
}


function empty(id) {

    //delete the form with a function
    fetch(`/edititem/e-s/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);
        
        // change the div class once I know it.
        element = document.getElementById(`row+${id}`);
        element.className = "empty anime"

        elementpart = document.getElementById(`col3+${id}`)
        elementpart.innerHTML = '0'
        elementpart.setAttribute('data-value', '0');
        
        elementdate = document.getElementById(`col5+${id}`)
        elementdate.className = "empty"
        // change button (erase declarer vide option) 

        elementbutton = document.getElementById(`empty+${id}`)
        elementbutton.remove()
    
        
    })
    .catch(error => console.log(error));

}


function search(event) {

    event.preventDefault();

    element3 = document.getElementById('tablebody')
    //erase previous searches
    element3.innerHTML = ' '

    // change views
    document.getElementById('myinventory').style.display = 'none';
    document.getElementById('editinventory').style.display = 'none';
    document.getElementById('itemedit').style.display = 'none';
    document.getElementById('itemsearch').style.display = 'block';

    element = document.querySelector('#myinventory')

    // take data value for user id.
    var id = document.getElementById("myinventory").getAttribute("data-value");
    var context = "item"
    const tosearch = element.querySelector('#tosearch').value;

    // csrf token
    let csrftoken = getCookie('csrftoken');

    // fetch call
    fetch(`search/${id}/${context}`, {
        method: 'POST',
        body: JSON.stringify({
            search: tosearch,               
        }),
        headers: { "X-CSRFToken": csrftoken },
    }) 
    .then(response => response.json())
    .then(results => { 
        console.log(results)

        // reset form
        document.getElementById("searchitem").reset();

        // change div infos and view.
        for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `row+${results[i].id}`

            // format date
            var mydate = new Date(`${results[i].dateend}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();
                
            // not empty case
            if (results[i].empty == false) {
                row.innerHTML = `
                <th scope="row" id="col1+${results[i].id}" data-value="${results[i].name}">${results[i].name}</th>
                <td id="col2+${results[i].id}" data-value="${results[i].molecule}">${results[i].molecule}</td>
                <td id="col3+${results[i].id}" data-value="${results[i].quantity}">${results[i].quantity}</td>
                <td id="col4+${results[i].id}" data-value="${results[i].lot}">${results[i].lot}</td>        
                <td id="col5+${results[i].id}" data-value="${results[i].dateend}">${formateddate}</td>
                <td id="col6+${results[i].id}">
                <button class="btn btn-light" id="edit+${results[i].id}" title="Modifier" onclick=edititem(${results[i].id})>✍</button>
                <button class="btn btn-light" id="empty+${results[i].id}" title="Déclarer vide" onclick=empty(${results[i].id})>🗑</button>
                <button class="btn btn-light" id="del+${results[i].id}" title="Supprimer" onclick=del(${results[i].id})>❌</button>
                </td> `

                // over case
                if (results[i].over == true) {
                    col = document.getElementById(`col5+${results[i].id}`)
                    col.className = "warning"
                }
            }

            // empty case
            else if (results[i].empty == true)  {
                row.className = 'empty anime'
                row.innerHTML = `
                <th scope="row" id="col1+${results[i].id}" data-value="${results[i].name}">${results[i].name}</th>
                <td id="col2+${results[i].id}" data-value="${results[i].molecule}">${results[i].molecule}</td>
                <td id="col3+${results[i].id}" data-value="${results[i].quantity}">${results[i].quantity}</td>
                <td id="col4+${results[i].id}" data-value="${results[i].lot}">${results[i].lot}</td>    
                <td id="col5+${results[i].id}" data-value="${results[i].dateend}">${formateddate}</td>
                <td id="col6+${results[i].id}">
                <button class="btn btn-light" id="edit+${results[i].id}" title="Modifier" onclick=edititem(${results[i].id})>✍</button>
                <button class="btn btn-light" id="del+${results[i].id}" title="Supprimer" onclick=del(${results[i].id})>❌</button>
                </td>`
            } 
            
            element3.append(row);
        }                        
    })
    .catch(error => console.log(error));
}


function yearview(year) {
    //onclick of the year, fetch .
    var id = document.getElementById(`myinventory`).getAttribute("data-value"); 
    element3 = document.getElementById('bodyinv')

    // erase previous rows.
    element3.innerHTML = ''

    // get the years entries with a function
    fetch(`/pastinventory/${id}/${year}`)
    .then(response => response.json())
    .then(results => { 
        console.log("Success")

        // change div infos and view.

        buttonyear= document.getElementById('showyear')
        buttonyear.innerHTML = `${year}`
    
        for (let i = 0; i < results.length; i++) {
            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `row+${results[i].id}`
            // format date
            var mydate = new Date(`${results[i].dateend}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();
                
            // not empty case
            if (results[i].empty == false) {
                row.innerHTML = `
                <th scope="row" id="col1+${results[i].id}" data-value="${results[i].name}">${results[i].name}</th>
                <td id="col2+${results[i].id}" data-value="${results[i].molecule}">${results[i].molecule}</td>
                <td id="col3+${results[i].id}" data-value="${results[i].quantity}">${results[i].quantity}</td>
                <td id="col4+${results[i].id}" data-value="${results[i].lot}">${results[i].lot}</td>        
                <td id="col5+${results[i].id}" data-value="${results[i].dateend}">${formateddate}</td>
                <td id="col6+${results[i].id}">
                <button class="btn btn-light" id="edit+${results[i].id}" title="Modifier" onclick=edititem(${results[i].id})>✍</button>
                <button class="btn btn-light" id="empty+${results[i].id}" title="Déclarer vide" onclick=empty(${results[i].id})>🗑</button>
                <button class="btn btn-light" id="del+${results[i].id}" title="Supprimer" onclick=del(${results[i].id})>❌</button>
                </td>`

                // over case
                if (results[i].over == true) {
                    row.innerHTML = `
                        <th scope="row" id="col1+${results[i].id}" data-value="${results[i].name}">${results[i].name}</th>
                        <td id="col2+${results[i].id}" data-value="${results[i].molecule}">${results[i].molecule}</td>
                        <td id="col3+${results[i].id}" data-value="${results[i].quantity}">${results[i].quantity}</td>
                        <td id="col4+${results[i].id}" data-value="${results[i].lot}">${results[i].lot}</td>        
                        <td id="col5+${results[i].id}" data-value="${results[i].dateend}" class="warning">${formateddate}</td>
                        <td id="col6+${results[i].id}">
                        <button class="btn btn-light" id="edit+${results[i].id}" title="Modifier" onclick=edititem(${results[i].id})>✍</button>
                        <button class="btn btn-light" id="empty+${results[i].id}" title="Déclarer vide" onclick=empty(${results[i].id})>🗑</button>
                        <button class="btn btn-light" id="del+${results[i].id}" title="Supprimer" onclick=del(${results[i].id})>❌</button>
                        </td>`
                }
            }

            // empty case
            else if (results[i].empty == true)  {
                row.className = 'empty anime'
                row.innerHTML = `
                <th scope="row" id="col1+${results[i].id}" data-value="${results[i].name}">${results[i].name}</th>
                <td id="col2+${results[i].id}" data-value="${results[i].molecule}">${results[i].molecule}</td>
                <td id="col3+${results[i].id}" data-value="${results[i].quantity}">${results[i].quantity}</td>
                <td id="col4+${results[i].id}" data-value="${results[i].lot}">${results[i].lot}</td>    
                <td id="col5+${results[i].id}" data-value="${results[i].dateend}">${formateddate}</td>
                <td id="col6+${results[i].id}">
                <button class="btn btn-light" id="edit+${results[i].id}" title="Modifier" onclick=edititem(${results[i].id})>✍</button>
                <button class="btn btn-light" id="del+${results[i].id}" title="Supprimer" onclick=del(${results[i].id})>❌</button>
                </td>`
            }  
            
            element3.append(row);
        }

    })
    .catch(error => console.log(error));
    
}


// function copied from https://docs.djangoproject.com/en/dev/ref/csrf/#ajax, because chrome doesn't let me use the module.
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue; 
}