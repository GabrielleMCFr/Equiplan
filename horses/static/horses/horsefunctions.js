function editinfos(id) {

    // change concerned view
    document.getElementById('infos').style.display = 'none';
    document.getElementById('forminfos').style.display = 'block';  

    // select element
    element = document.getElementById('forminfos');

    // EVENT EDIT INFOS
    element.querySelector('#horseinfos').onsubmit = function(e) {
        e.preventDefault();

        // get new values
        const newname = element.querySelector('#horsename').value;
        const newsex = element.querySelector('#horsesex').value;
        const newage = element.querySelector('#horseage').value;
        const newbreed = element.querySelector('#horsebreed').value;
        const newcoat = element.querySelector('#horsecoat').value;
        const newifce = element.querySelector('#horseifce').value;
        const newueln = element.querySelector('#horseueln').value;
        const newtest = element.querySelector('#horsetests').value;

        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/edithorse/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                name: newname,
                sex: newsex,
                age: newage,
                breed: newbreed,
                coat: newcoat,
                ifce: newifce,
                ueln: newueln, 
                tests: newtest               
            }),
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => response.json())
        .then(editedhorse => { 

            // change div infos.
            element2 = document.getElementById('infos')
            if (editedhorse.age != null) {
                var get_year = document.getElementById('yeartoday')
                var act_year = get_year.getAttribute('data-value')

                var editedage = act_year - editedhorse.age

                element2.innerHTML = `<h2>${editedhorse.name} <button class="editbutton rounded-pill" id="edithorse" onclick=editinfos(${editedhorse.id}) >Modifier &#128394</button></h2>
                <h3> ${editedhorse.sex}, ${editedhorse.age} </h3>
                <h3> ${editedage} ans</h3>
                <h3> ${editedhorse.coat}</h3>
                <h3> ${editedhorse.breed} </h3>
                <h5> N SIRE : ${editedhorse.ifce} </h5>
                <h5> N UELN/transpondeur : ${editedhorse.ueln} </h5>
                <h5> Tests : ${editedhorse.tests} </h5>`

            }

            else {
                element2.innerHTML = `<h2>${editedhorse.name} <button class="editbutton rounded-pill" id="edithorse" onclick=editinfos(${editedhorse.id}) >Modifier &#128394</button></h2>
                <h3> ${editedhorse.sex} </h3>
                <h3> ${editedhorse.coat}</h3>
                <h3> ${editedhorse.breed} </h3>
                <h5> N SIRE : ${editedhorse.ifce} </h5>
                <h5> N UELN/transpondeur : ${editedhorse.ueln} </h5>
                <h5> Tests : ${editedhorse.tests} </h5>`
            }
            

            // change views.
            // change concerned view
            document.getElementById('infos').style.display = 'block';
            document.getElementById('forminfos').style.display = 'none'; 
            
            document.getElementById("infos").focus({preventScroll:false})
            
        })
        .catch(error => console.log(error));
    }
}


function changeavatar(nb) {
    var id = document.getElementById(`infos`).getAttribute("data-value"); 

    // csrf token
    let csrftoken = getCookie('csrftoken')

    fetch(`/edithorsepic/${id}`, {
        method: 'POST',
        body: JSON.stringify({
            context : nb,
        }),
        headers: { "X-CSRFToken": csrftoken },
    })
    .then(response => response.json())
    .then(message => {
        console.log(message);
        window.location.reload()
    })
}


function editnotes(id) {
    // change views
    document.getElementById('notes').style.display = 'none';
    document.getElementById('notesedit').style.display = 'block';

    // select element
    element = document.getElementById('notesedit');

    // EVENT EDIT INFOS
    element.querySelector('#editnt').onsubmit = function(e) {
        e.preventDefault();

        //get new value
        var actnotes = element.querySelector('#newnotes').value;
        
        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/editnotes/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                notes: actnotes,          
            }),
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => response.json())
        .then(editednotes => { 
            console.log("Success")
            
             // change notes div
             element2 = document.getElementById('notes')

             if (editednotes.notes == "") {
                 element2.innerHTML = `<h3>Notes <button class="editbutton rounded-pill" id="enotes" onclick=editnotes(${id}) >Modifier &#128394</button></h3> 
                                 <p> Aucune note pour le moment.</p> `
             }
            
             else {                
                 element2.innerHTML = `<h3>Notes <button class="editbutton rounded-pill" id="enotes" onclick=editnotes(${id}) >Modifier &#128394</button></h3> 
                 <p> ${editednotes.notes}</p> `
             }


            // change view
            document.getElementById('notes').style.display = 'block';
            document.getElementById('notesedit').style.display = 'none';   
            
            document.getElementById("notes").focus({preventScroll:false})
        })
        .catch(error => console.log(error));        
    }
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


function newvaccin(id) {

    // change views
    document.getElementById('vax').style.display = 'none';
    document.getElementById('newvacc').style.display = 'block';
    document.getElementById('editvacc').style.display = 'none';

    //select element
    elementform = document.getElementById('newvacc')

    // submit event
    elementform.querySelector('#newvax').onsubmit = function(ev) {
        ev.preventDefault();

        form = elementform.querySelector('#newvax')

        //get form values
        formdata = new FormData(form)  
        
        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/newvax/${id}`, {
            method: 'POST',
            body:formdata,
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => {
            if (response.ok) {
                return response.json();
              } 
            else {
                document.getElementById('crwarningvax').innerHTML = "Une erreur s'est produite. Vérifiez les informations que vous avez saisies, le type de vaccin doit être indiqué, les dates sont optionnelles mais si indiquées, le rappel doit être ultérieur à la date de réalisation du vaccin."
                document.getElementById("crwarningvax").focus({preventScroll:false})
                throw new Error('Something went wrong');               
              }
        })
        .then(vaccin => { 
            
            // format date
            var mydate = new Date(`${vaccin.date}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
             var formateddate1 = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();
            
            var mydate2 = new Date(`${vaccin.next}`);
            var month2 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate2.getMonth()];
            var formateddate2 = mydate2.getDate() + ' ' + month2 + ' ' + mydate2.getFullYear();

            dateyear = mydate.getFullYear();
            elemtmp = document.getElementById('vax');
            current_year = elemtmp.querySelector('#vshowselectyear').getAttribute('data-value');

            //get actual date
            get_year = document.getElementById('yeartoday')
            act_year = get_year.getAttribute('data-value')

            // avant/après cases years limits
            fut_year = parseInt(act_year) + 2
            ant_year = parseInt(act_year) - 2
            
            // change table if its the concerned year.
            if ( dateyear == current_year || dateyear == null) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `row+${vaccin.id}`

                element = document.getElementById('bodyvax')

                row.innerHTML = `<th scope="row" id="col1+${vaccin.id}" data-value="${vaccin.date}">${formateddate1}</th>
                <td id="col2+${vaccin.id}" data-value="${vaccin.kind}">${vaccin.kind}</td>
                <td id="col3+${vaccin.id}" data-value="${vaccin.next}">${formateddate2}</td> 
                <td id="col4+${vaccin.id}">  
                <button class="btn btn-light" id="edit+${vaccin.id}" title="Modifier" onclick=editvax(${vaccin.id})>✍</button>
                <button class="btn btn-light" id="del+${vaccin.id}" title="Supprimer" onclick=deletevax(${vaccin.id})>❌</button>           
                </td>`

                // diff views changing if the next date is null or not
                if (vaccin.next == null) {
                    row.innerHTML = `<th scope="row" id="col1+${vaccin.id}" data-value="${vaccin.date}">${formateddate1}</th>
                    <td id="col2+${vaccin.id}" data-value="${vaccin.kind}">${vaccin.kind}</td>
                    <td id="col3+${vaccin.id}" data-value="${vaccin.next}"></td> 
                    <td id="col4+${vaccin.id}">  
                    <button class="btn btn-light" id="edit+${vaccin.id}" title="Modifier" onclick=editvax(${vaccin.id})>✍</button>
                    <button class="btn btn-light" id="del+${vaccin.id}" title="Supprimer" onclick=deletevax(${vaccin.id})>❌</button>           
                    </td>`  
                }
           
                element.prepend(row)
            }

            else if ( current_year == 1111  && dateyear > fut_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `row+${vaccin.id}`

                element = document.getElementById('bodyvax')

                row.innerHTML = `<th scope="row" id="col1+${vaccin.id}" data-value="${vaccin.date}">${formateddate1}</th>
                <td id="col2+${vaccin.id}" data-value="${vaccin.kind}">${vaccin.kind}</td>
                <td id="col3+${vaccin.id}" data-value="${vaccin.next}">${formateddate2}</td> 
                <td id="col4+${vaccin.id}">  
                <button class="btn btn-light" id="edit+${vaccin.id}" title="Modifier" onclick=editvax(${vaccin.id})>✍</button>
                <button class="btn btn-light" id="del+${vaccin.id}" title="Supprimer" onclick=deletevax(${vaccin.id})>❌</button>           
                </td>`

                // diff views changing if the next date is null or not
                if (vaccin.next == null) {
                    row.innerHTML = `<th scope="row" id="col1+${vaccin.id}" data-value="${vaccin.date}">${formateddate1}</th>
                    <td id="col2+${vaccin.id}" data-value="${vaccin.kind}">${vaccin.kind}</td>
                    <td id="col3+${vaccin.id}" data-value="${vaccin.next}"></td> 
                    <td id="col4+${vaccin.id}">  
                    <button class="btn btn-light" id="edit+${vaccin.id}" title="Modifier" onclick=editvax(${vaccin.id})>✍</button>
                    <button class="btn btn-light" id="del+${vaccin.id}" title="Supprimer" onclick=deletevax(${vaccin.id})>❌</button>           
                    </td>`  
                }          
                element.prepend(row)
            }

            else if ( current_year == 1001 && dateyear < ant_year) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `row+${vaccin.id}`

                element = document.getElementById('bodyvax')

                row.innerHTML = `<th scope="row" id="col1+${vaccin.id}" data-value="${vaccin.date}">${formateddate1}</th>
                <td id="col2+${vaccin.id}" data-value="${vaccin.kind}">${vaccin.kind}</td>
                <td id="col3+${vaccin.id}" data-value="${vaccin.next}">${formateddate2}</td> 
                <td id="col4+${vaccin.id}">  
                <button class="btn btn-light" id="edit+${vaccin.id}" title="Modifier" onclick=editvax(${vaccin.id})>✍</button>
                <button class="btn btn-light" id="del+${vaccin.id}" title="Supprimer" onclick=deletevax(${vaccin.id})>❌</button>           
                </td>`

                // diff views changing if the next date is null or not
                if (vaccin.next == null) {
                    row.innerHTML = `<th scope="row" id="col1+${vaccin.id}" data-value="${vaccin.date}">${formateddate1}</th>
                    <td id="col2+${vaccin.id}" data-value="${vaccin.kind}">${vaccin.kind}</td>
                    <td id="col3+${vaccin.id}" data-value="${vaccin.next}"></td> 
                    <td id="col4+${vaccin.id}">  
                    <button class="btn btn-light" id="edit+${vaccin.id}" title="Modifier" onclick=editvax(${vaccin.id})>✍</button>
                    <button class="btn btn-light" id="del+${vaccin.id}" title="Supprimer" onclick=deletevax(${vaccin.id})>❌</button>           
                    </td>`  
                }          
                element.prepend(row)

            }

            document.getElementById('crwarningvax').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"
            elementform.querySelector('#newvax').reset()

            // change views
            document.getElementById('vax').style.display = 'block';
            document.getElementById('newvacc').style.display = 'none';    
            
            document.getElementById("vax").focus({preventScroll:false})
        })
        .catch(error => {
            console.log(error)       
        });
    }   
}


function deletevax(id) {

    //delete the form with a function
    fetch(`/newvax/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);
 
        // hide nicely with an animation and remove at the end of it:
        element = document.getElementById(`row+${id}`);
        element.style.animationPlayState = 'running';
        setTimeout(function (){
           element.remove()    
         }, 1000);
    })
    .catch(error => console.log(error));
}


function editvax(id) {

    // change views
    document.getElementById('vax').style.display = 'none';
    document.getElementById('newvacc').style.display = 'none';
    document.getElementById('editvacc').style.display = 'block';

    // select element
    element = document.getElementById('editvacc')

    //take actual values : 
    var actualdate = document.getElementById(`col1+${id}`).getAttribute("data-value"); 
    var actualkind = document.getElementById(`col2+${id}`).getAttribute("data-value"); 
    var actualnext = document.getElementById(`col3+${id}`).getAttribute("data-value"); 
   
    // check for validity
    if ( !isNaN(Date.parse(actualdate)) ) {
        actualdate = new Date(actualdate).toISOString().substring(0, 10)
    }
  
    if ( !isNaN(Date.parse(actualnext)) ) {
        actualnext = new Date(actualnext).toISOString().substring(0, 10)
    }
    
    // prefill the form 
    element.querySelector('#vaxdate').value = actualdate;
    element.querySelector('#vaxkind').value = actualkind;
    element.querySelector('#vaxdaterapp').value = actualnext;

    // event listener here: 
    element.querySelector('#editavaccin').onsubmit = function(e) {
        e.preventDefault();
        // get new values
        const newdatev = element.querySelector('#vaxdate').value;
        const newkind = element.querySelector('#vaxkind').value;
        const newrapp = element.querySelector('#vaxdaterapp').value;
        
        var d1 = new Date(newdatev)
        var d2 = new Date(newrapp)

        if (newkind.length < 1 ) {
            element.querySelector('#warningvax').innerHTML = "Le type de vaccin n'est pas indiqué."    
            document.getElementById("warningvax").focus({preventScroll:false})
        }

        else if (newkind.length > 200 ) {
            element.querySelector('#warningvax').innerHTML = "La case du type de vaccin ne peut contenir que 200 charactères."   
            document.getElementById("warningvax").focus({preventScroll:false}) 
        }

        else if (newdatev.length < 1) {
            element.querySelector('#warningvax').innerHTML = "La date du vaccin n'est pas indiquée."    
            document.getElementById("warningvax").focus({preventScroll:false})
        }

        else if (d1 != null && d2 != null && d1 >= d2) {
            element.querySelector('#warningvax').innerHTML = "Le rappel doit être ultérieur à la date de réalisation du vaccin."    
            document.getElementById("warningvax").focus({preventScroll:false})
        }


        else {
            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch
            // fetch call
            fetch(`/editvax/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    kind : newkind,
                    date : newdatev,
                    next : newrapp,
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => {
                if (response.ok) {
                    return response.json();
                  } 
                else {
                    document.getElementById('warningvax').innerHTML = "Une erreur s'est produite. Vérifiez les informations que vous avez saisies, le type de vaccin doit être indiqué, les dates sont optionnelles mais si indiquées, le rappel doit être ultérieur à la date de réalisation du vaccin."
                    document.getElementById("warningvax").focus({preventScroll:false})
                    throw new Error('Something went wrong');               
                  }
            })
            .then(editedvax => { 

                // change div
                // format date
                var mydate = new Date(`${editedvax.date}`);
                var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
                var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

                // format date
                var mydaten = new Date(`${editedvax.next}`);
                var monthn = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydaten.getMonth()];
                var formateddaten = mydaten.getDate() + ' ' + monthn + ' ' + mydaten.getFullYear();
                
                // act in function of the year view.
                // select element and get year set actually showed
                elemtmp = document.getElementById('vax');
                current_year = elemtmp.querySelector('#vshowselectyear').getAttribute('data-value');
                // year of the real actual date
                get_year = document.getElementById('yeartoday')
                act_year = get_year.getAttribute('data-value')
                // year of the vax date
                dateyear = mydate.getFullYear()
                // limit for previous years
                fut_year = parseInt(act_year) + 2
                ant_year = parseInt(act_year) - 2

                // change view in function of the edited year.
                // case where the edited year is still the same (exept for "avant")
                if ( dateyear == current_year || dateyear == null) {

                    // change div to actualize (just the row or just the 4 firsts col of the row)
                    document.getElementById(`col1+${id}`).innerHTML = `${formateddate}`
                    document.getElementById(`col1+${id}`).setAttribute('data-value', `${editedvax.date}`);
                    document.getElementById(`col2+${id}`).innerHTML = `${editedvax.kind}`
                    document.getElementById(`col2+${id}`).setAttribute('data-value', `${editedvax.kind}`);
                    document.getElementById(`col3+${id}`).innerHTML = `${formateddaten}`
                    document.getElementById(`col3+${id}`).setAttribute('data-value', `${editedvax.next}`);

                    if (editedvax.next == null) {
                        document.getElementById(`col3+${id}`).innerHTML = ' '
                    }
                }

                // case where the edited year is still the same and it's "avant" categ
                else if (current_year == 1001 && dateyear < ant_year) {
                    // change div to actualize (just the row or just the 4 firsts col of the row)
                    document.getElementById(`col1+${id}`).innerHTML = `${formateddate}`
                    document.getElementById(`col1+${id}`).setAttribute('data-value', `${editedvax.date}`);
                    document.getElementById(`col2+${id}`).innerHTML = `${editedvax.kind}`
                    document.getElementById(`col2+${id}`).setAttribute('data-value', `${editedvax.kind}`);
                    document.getElementById(`col3+${id}`).innerHTML = `${formateddaten}`
                    document.getElementById(`col3+${id}`).setAttribute('data-value', `${editedvax.next}`);

                    if (editedvax.next == null) {
                        document.getElementById(`col3+${id}`).innerHTML = ' '
                    }                   
                }

                else if ( current_year == 1111  && dateyear > fut_year) {
                    // change div to actualize (just the row or just the 4 firsts col of the row)
                    document.getElementById(`col1+${id}`).innerHTML = `${formateddate}`
                    document.getElementById(`col1+${id}`).setAttribute('data-value', `${editedvax.date}`);
                    document.getElementById(`col2+${id}`).innerHTML = `${editedvax.kind}`
                    document.getElementById(`col2+${id}`).setAttribute('data-value', `${editedvax.kind}`);
                    document.getElementById(`col3+${id}`).innerHTML = `${formateddaten}`
                    document.getElementById(`col3+${id}`).setAttribute('data-value', `${editedvax.next}`);

                    if (editedvax.next == null) {
                        document.getElementById(`col3+${id}`).innerHTML = ' '
                    } 
                }

                // case where the edited year doesnt match the previous one and is not 'avant'
                else {
                    //delete view of the row.
                    rowtmp = document.getElementById(`row+${id}`);
                    rowtmp.remove()
                }

                // reset form
                document.getElementById('editavaccin').reset();
                document.getElementById('warningvax').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"
   
                // change views
                document.getElementById('vax').style.display = 'block';
                document.getElementById('newvacc').style.display = 'none';
                document.getElementById('editvacc').style.display = 'none';

                document.getElementById("vax").focus({preventScroll:false})
            })
            .catch(error => console.log(error));
        }
    }
}



function vacyearview(year) {

    // get user.id and select body of the dates table.
    var id = document.getElementById(`infos`).getAttribute("data-value"); 
    bodyelement = document.getElementById('bodyvax');

    // erase previous rows.
    bodyelement.innerHTML = ''

    // get context
    var context = "vaccins"

    //charge the year entries with fetch
    fetch(`/yearview/${id}/${year}/${context}`)
    .then(response => response.json())
    .then(results => { 
        console.log("Success")

        // change year button   
        buttonyear = document.getElementById('vshowselectyear');
        buttonyear.setAttribute('data-value', `${year}`);
        buttonyear.innerHTML = `${year}`;

        if (year == 1001) {
            buttonyear.innerHTML = "Avant" 
        }

        else if (year == 1111) {
            buttonyear.innerHTML = "Après"     
        }

        for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `row+${results[i].id}`

            // format date
            var mydate = new Date(`${results[i].date}`);
            var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
             "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + mymonth + ' ' + mydate.getFullYear() 
            
            var mydate2 = new Date(`${results[i].next}`);
            var month2 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate2.getMonth()];
            var formateddate2 = mydate2.getDate() + ' ' + month2 + ' ' + mydate2.getFullYear();

            // create row
            row.innerHTML = `<th scope="row" id="col1+${results[i].id}" data-value="${results[i].date}">${formateddate}</th>
            <td id="col2+${results[i].id}" data-value="${results[i].kind}">${results[i].kind}</td>
            <td id="col3+${results[i].id}" data-value="${results[i].next}">${formateddate2}</td> 
            <td id="col4+${results[i].id}">  
            <button class="btn btn-light" id="edit+${results[i].id}" title="Modifier" onclick=editvax(${results[i].id})>✍</button>
            <button class="btn btn-light" id="del+${results[i].id}" title="Supprimer" onclick=deletevax(${results[i].id})>❌</button>           
            </td>`

            

            if (results[i].next == null) {
                row.innerHTML = `<th scope="row" id="col1+${results[i].id}" data-value="${results[i].date}">${formateddate}</th>
                <td id="col2+${results[i].id}" data-value="${results[i].kind}">${results[i].kind}</td>
                <td id="col3+${results[i].id}" data-value="${results[i].next}"></td> 
                <td id="col4+${results[i].id}">  
                <button class="btn btn-light" id="edit+${results[i].id}" title="Modifier" onclick=editvax(${results[i].id})>✍</button>
                <button class="btn btn-light" id="del+${results[i].id}" title="Supprimer" onclick=deletevax(${results[i].id})>❌</button>           
                </td>`  
            }
                 
            bodyelement.append(row);
        }
    }) 
    .catch(error => console.log(error));  
}


function newdates(id) {

    // id : horse.id

    // change views
    document.getElementById('dates').style.display = 'none';
    document.getElementById('datesedit').style.display = 'none';
    document.getElementById('datesnew').style.display = 'block';

    //select element
    elementform = document.getElementById('datesnew')

    // submit event
    elementform.querySelector('#newdate').onsubmit = function(ev) {
        ev.preventDefault();

        //get form values 
        const newrea = elementform.querySelector('#d_r').value;
        const newdt = elementform.querySelector('#d_dt').value;
        const newi = elementform.querySelector('#d_i').value;

        //check values and display warnings:
        if (newdt.length < 1 ) {
            elementform.querySelector('#crwarningdate').innerHTML = "La date de rendez-vous n'est pas indiquée."   
            document.getElementById("crwarningdate").focus({preventScroll:false}) 
        }

        else if (newrea.length < 1 ) {
            elementform.querySelector('#crwarningdate').innerHTML = "Le motif du rendez-vous n'est pas indiqué."    
            document.getElementById("crwarningdate").focus({preventScroll:false}) 
        }

        else if (newrea.length > 300) {
            elementform.querySelector('#crwarningdate').innerHTML = "La case du motif du rendez-vous ne peut contenir que 300 charactères." 
            document.getElementById("crwarningdate").focus({preventScroll:false})    
        }

        else if (newi.length > 200) {
            elementform.querySelector('#crwarningdate').innerHTML = "La case de l'intervenant ne peut contenir que 200 charactères." 
            document.getElementById("crwarningdate").focus({preventScroll:false})    
        }

        else {
            // csrf token
            let csrftoken = getCookie('csrftoken');
            
            // fetch call
            fetch(`/newdate/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    reason : newrea,
                    date : newdt,
                    other : newi,
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => response.json())
            .then(crdate => { 
                            
                // format date
                var mydate = new Date(`${crdate.date}`);
                var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
                var minutes = ('0'+ mydate.getMinutes()).slice(-2);
                var hours = mydate.getHours()
                var formateddatetime = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear() + ' ' + mydate.getHours() + ':' + minutes;

                dateyear = mydate.getFullYear()
                elemtmp = document.getElementById('dates');
                current_year = elemtmp.querySelector('#dshowselectyear').getAttribute('data-value');

                //get actual date
                get_year = document.getElementById('yeartoday')
                act_year = get_year.getAttribute('data-value')
                fut_year = parseInt(act_year) + 2 
                
                // change table if its the concerned year.
                if ( dateyear == current_year || dateyear == null) {
                    //change innerhtml : create row, fill it, append it at the beggining of the table.
                    const row = document.createElement('tr')
                    row.className = 'anime'
                    row.id = `drow+${crdate.id}`
                    
                    // body of the main table
                    elementtable = document.getElementById('bodydates')

                    // create new row
                    row.innerHTML = `<th scope="row" id="dcol1+${crdate.id}" data-value="${crdate.date}" hours-value="${hours}" minutes-value="${minutes}">${formateddatetime}</th>
                    <td id="dcol2+${crdate.id}" data-value="${crdate.other}">${crdate.other}</td>
                    <td id="dcol3+${crdate.id}" data-value="${crdate.reason}">${crdate.reason}</td> 
                    <td id="dcol4+${crdate.id}">  
                    <button class="btn btn-light" id="dedit+${crdate.id}" title="Modifier" onclick=editdate(${crdate.id})>✍</button>
                    <button class="btn btn-light" id="ddel+${crdate.id}" title="Supprimer" onclick=deletedate(${crdate.id})>❌</button>           
                    </td>`
                    
                    // add row to table, first rank
                    elementtable.prepend(row)
                }

                // change table if year is in the categorie "after" and if its date is past 2 years from now.
                else if ( current_year == 1111  && dateyear > fut_year) {

                    //change innerhtml : create row, fill it, append it at the beggining of the table.
                    const row = document.createElement('tr')
                    row.className = 'anime'
                    row.id = `drow+${crdate.id}`
                    
                    // body of the main table
                    elementtable = document.getElementById('bodydates')

                    // create new row
                    row.innerHTML = `<th scope="row" id="dcol1+${crdate.id}" data-value="${crdate.date}" hours-value="${hours}" minutes-value="${minutes}">${formateddatetime}</th>
                    <td id="dcol2+${crdate.id}" data-value="${crdate.other}">${crdate.other}</td>
                    <td id="dcol3+${crdate.id}" data-value="${crdate.reason}">${crdate.reason}</td> 
                    <td id="dcol4+${crdate.id}">  
                    <button class="btn btn-light" id="dedit+${crdate.id}" title="Modifier" onclick=editdate(${crdate.id})>✍</button>
                    <button class="btn btn-light" id="ddel+${crdate.id}" title="Supprimer" onclick=deletedate(${crdate.id})>❌</button>           
                    </td>`
                    
                    // add row to table, first rank
                    elementtable.prepend(row)

                }

                // change views
                document.getElementById('dates').style.display = 'block';
                document.getElementById('datesedit').style.display = 'none';
                document.getElementById('datesnew').style.display = 'none';

                document.getElementById("dates").focus({preventScroll:false})
                
                // reset form and erase warnings
                elementform.querySelector('#newdate').reset()   
                elementform.querySelector('#crwarningdate').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"    
            })
            .catch(error => {
                console.log(error)       
            });
        }   
    }
}


function deletedate(id) {

    //delete the form with a function
    fetch(`/newdate/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);

        
        // hide nicely with an animation and remove at the end of it:
        element = document.getElementById(`drow+${id}`);
        element.style.animationPlayState = 'running';
        setTimeout(function (){
           element.remove()    
         }, 1000);

    })
    .catch(error => console.log(error));
}


function editdate(id) {
    // id : date.id

    // change views
    document.getElementById('dates').style.display = 'none';
    document.getElementById('datesedit').style.display = 'block';
    document.getElementById('datesnew').style.display = 'none';
   
    // select element
    element = document.getElementById('datesedit')

    //take actual values : 
    var actualdate = document.getElementById(`dcol1+${id}`).getAttribute("data-value"); 
    var actualhours = document.getElementById(`dcol1+${id}`).getAttribute("hours-value"); 
    var actualminutes = document.getElementById(`dcol1+${id}`).getAttribute("minutes-value"); 
    var actualother = document.getElementById(`dcol2+${id}`).getAttribute("data-value"); 
    var actualreason = document.getElementById(`dcol3+${id}`).getAttribute("data-value"); 
    
    // ex format datetime : 2017-06-01T08:30
    var td = new Date(actualdate)
    td.setUTCHours(actualhours)
    td.setMinutes(actualminutes)
    //console.log(td)
    //td.setTime( td.getTime() - new Date().getTimezoneOffset()*60*1000 );
    td = td.toISOString().substr(0, 16);
    

    // other technique :
    //var td1 = td.getDate()
    //var td2 = td.getMonth()+1
    //var td3 = td.getFullYear()
    //var td4 = td.getHours()
    //var td5 = td.getMinutes()
    //actdate = td3 + '-' + td2  + '-' + td1 + 'T' + td4 + ':' + td5
    
    // prefill form
    element.querySelector('#de_r').value = actualreason;
    element.querySelector('#de_dt').value = td;
    element.querySelector('#de_i').value = actualother;

    // event listener :

    element.querySelector('#edtdate').onsubmit = function(e) {
        e.preventDefault();

        // get new values
        const edtreason = element.querySelector('#de_r').value;
        const edtdatetime = element.querySelector('#de_dt').value;
        const edtother = element.querySelector('#de_i').value;

        // warnings
        if (edtdatetime.length < 1 ) {
            element.querySelector('#edtwarningdate').innerHTML = "La date de rendez-vous n'est pas indiquée." 
            document.getElementById("edtwarningdate").focus({preventScroll:false})    
        }

        else if (edtreason.length < 1) {
            element.querySelector('#edtwarningdate').innerHTML = "Le motif rendez-vous n'est pas indiqué." 
            document.getElementById("edtwarningdate").focus({preventScroll:false})      
        }

        else if (edtreason.length > 300) {
            element.querySelector('#edtwarningdate').innerHTML = "Le motif rendez-vous est limité à 300 charactères." 
            document.getElementById("edtwarningdate").focus({preventScroll:false})      
        }

        else {
            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/editdate/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    reason : edtreason,
                    date : edtdatetime,
                    other : edtother,
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => response.json())
            .then(editeddate => {

                // format date
                var myedtdate = new Date(`${editeddate.date}`);
                var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myedtdate.getMonth()];
                var myminutes = ('0'+ myedtdate.getMinutes()).slice(-2);
                var formateddt = myedtdate.getDate() + ' ' + mymonth + ' ' + myedtdate.getFullYear() + ' ' + myedtdate.getHours() + ':' + myminutes;
                
                var edthours = myedtdate.getHours()
                var edtminutes = myedtdate.getMinutes()

                dateyear = myedtdate.getFullYear()
                elemtmp = document.getElementById('dates');
                current_year = elemtmp.querySelector('#dshowselectyear').getAttribute('data-value');

                //get actual date
                get_year = document.getElementById('yeartoday')
                act_year = get_year.getAttribute('data-value')
                fut_year = parseInt(act_year) + 2 
            
                // change table if its the concerned year (and also if the date can't be found somehow.)
                if ( current_year != 1111 && dateyear == current_year || dateyear == null) {
                    // change div to actualize 
                    document.getElementById(`dcol1+${id}`).innerHTML = `${formateddt}`;
                    document.getElementById(`dcol1+${id}`).setAttribute('data-value', `${editeddate.date}`);
                    document.getElementById(`dcol1+${id}`).setAttribute('hours-value', `${edthours}`);
                    document.getElementById(`dcol1+${id}`).setAttribute('minutes-value', `${edtminutes}`);
                    document.getElementById(`dcol2+${id}`).innerHTML = `${editeddate.other}`;
                    document.getElementById(`dcol2+${id}`).setAttribute('data-value', `${editeddate.other}`);
                    document.getElementById(`dcol3+${id}`).innerHTML = `${editeddate.reason}`;
                    document.getElementById(`dcol3+${id}`).setAttribute('data-value', `${editeddate.reason}`);
                }

                // change table if year is in the categorie "after" and if its date is past 2 years from now.
                else if ( current_year == 1111  && dateyear > fut_year) {
                    // change div to actualize 
                    document.getElementById(`dcol1+${id}`).innerHTML = `${formateddt}`;
                    document.getElementById(`dcol1+${id}`).setAttribute('data-value', `${editeddate.date}`);
                    document.getElementById(`dcol1+${id}`).setAttribute('hours-value', `${edthours}`);
                    document.getElementById(`dcol1+${id}`).setAttribute('minutes-value', `${edtminutes}`);
                    document.getElementById(`dcol2+${id}`).innerHTML = `${editeddate.other}`;
                    document.getElementById(`dcol2+${id}`).setAttribute('data-value', `${editeddate.other}`);
                    document.getElementById(`dcol3+${id}`).innerHTML = `${editeddate.reason}`;
                    document.getElementById(`dcol3+${id}`).setAttribute('data-value', `${editeddate.reason}`);
                }
                
                // if we change years in edit, don't show it if it changes categs showed.
                else {
                    //delete view of the row.
                    rowtodel = document.getElementById(`drow+${id}`);
                    rowtodel.remove()
                }

                // reset form, and warnings
                document.getElementById('edtdate').reset()
                document.getElementById('edtwarningdate').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"
                

                // change views
                document.getElementById('dates').style.display = 'block';
                document.getElementById('datesedit').style.display = 'none';
                document.getElementById('datesnew').style.display = 'none';

                document.getElementById("dates").focus({preventScroll:false})

            })
            .catch(error => console.log(error));
        }        
    }    
}


function dateyearview(year) {

    // get user.id and select body of the dates table.
    var id = document.getElementById(`infos`).getAttribute("data-value"); 
    bodyelement = document.getElementById('bodydates');

    // erase previous rows.
    bodyelement.innerHTML = ''

    // get context
    var context = "dates"

    //charge the year entries with fetch
    fetch(`/yearview/${id}/${year}/${context}`)
    .then(response => response.json())
    .then(results => { 
        console.log("Success")

        // change year button   
        buttonyear = document.getElementById('dshowselectyear');
        buttonyear.setAttribute('data-value', `${year}`);
        buttonyear.innerHTML = `${year}`;

        if (year == 1111) {
            buttonyear.innerHTML = "Après" 
        }

        for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `drow+${results[i].id}`

            // format date
            var mydate = new Date(`${results[i].date}`);
            var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
             "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var minutes = ('0'+ mydate.getMinutes()).slice(-2);
            var formateddt = mydate.getDate() + ' ' + mymonth + ' ' + mydate.getFullYear() + ' ' + mydate.getUTCHours() + ':' + minutes;

            var valminutes = mydate.getMinutes()
            var valhours = mydate.getUTCHours()
                 
            // create row
            row.innerHTML = `<th scope="row" id="dcol1+${results[i].id}" data-value="${results[i].date}" hours-value="${valhours}" minutes-value="${valminutes}">${formateddt}</th>
            <td id="dcol2+${results[i].id}" data-value="${results[i].other}">${results[i].other}</td>
            <td id="dcol3+${results[i].id}" data-value="${results[i].reason}">${results[i].reason}</td> 
            <td id="dcol4+${results[i].id}">  
            <button class="btn btn-light" id="dedit+${results[i].id}" title="Modifier" onclick=editdate(${results[i].id})>✍</button>
            <button class="btn btn-light" id="ddel+${results[i].id}" title="Supprimer" onclick=deletedate(${results[i].id})>❌</button>           
            </td>`
                 
            bodyelement.append(row);
        }
    }) 
    .catch(error => console.log(error));  
}



function newfarriery(id) {
    // id: horse id

    // change views
    document.getElementById('farriery').style.display = 'none';
    document.getElementById('farrieryedit').style.display = 'none';
    document.getElementById('farrierynew').style.display = 'block';

    // select element
    elementform = document.getElementById('farrierynew')

    // submit event
    elementform.querySelector('#newfarr').onsubmit = function(e) {
        e.preventDefault();

        form = elementform.querySelector('#newfarr')

        //get form values
        formdata = new FormData(form)  
        
        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/farriery/${id}`, {
            method: 'POST',
            body:formdata,
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => {
            if (response.ok) {
                return response.json();
              } 
            else {
                document.getElementById('crwarningfarr').innerHTML = "Une erreur s'est produite. Veuillez vérifier les informations que vous avez saisies."
                document.getElementById("crwarningfarr").focus({preventScroll:false})  
                throw new Error('Something went wrong');   
              }
        })
        .then(farr => { 

            // format date
            var mydate = new Date(`${farr.date}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

            dateyear = mydate.getFullYear();
            elemtmp = document.getElementById('farriery');
            current_year = elemtmp.querySelector('#mshowselectyear').getAttribute('data-value');

            //get actual date
            get_year = document.getElementById('yeartoday')
            act_year = get_year.getAttribute('data-value')

            // avant/après cases years limits
            fut_year = parseInt(act_year) + 2
            ant_year = parseInt(act_year) - 2

            // change table if its the concerned year.
            if ( dateyear == current_year || dateyear == null) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `mrow+${farr.id}`

                elementtbody = document.getElementById('bodyfarr')

                row.innerHTML = `<th scope="row" id="mcol1+${farr.id}" data-value="${farr.date}">${formateddate}</th>
                <td id="mcol2+${farr.id}" data-value="${farr.farrier}">${farr.farrier}</td>
                <td id="mcol3+${farr.id}" data-value="${farr.type}">${farr.type}</td>   
                <td id="mcol4+${farr.id}">  
                  <button class="btn btn-light" id="fedit+${farr.id}" title="Modifier" onclick=editfarriery(${farr.id})>✍</button>
                  <button class="btn btn-light" id="fdel+${farr.id}" title="Supprimer" onclick=deletefarriery(${farr.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)
            }

            else if ( current_year == 1111  && dateyear > fut_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `mrow+${farr.id}`

                elementtbody = document.getElementById('bodyfarr')

                row.innerHTML = `<th scope="row" id="mcol1+${farr.id}" data-value="${farr.date}">${formateddate}</th>
                <td id="mcol2+${farr.id}" data-value="${farr.farrier}">${farr.farrier}</td>
                <td id="mcol3+${farr.id}" data-value="${farr.type}">${farr.type}</td>   
                <td id="mcol4+${farr.id}">  
                  <button class="btn btn-light" id="fedit+${farr.id}" title="Modifier" onclick=editfarriery(${farr.id})>✍</button>
                  <button class="btn btn-light" id="fdel+${farr.id}" title="Supprimer" onclick=deletefarriery(${farr.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)

            }

            else if ( current_year == 1001 && dateyear < ant_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `mrow+${farr.id}`

                elementtbody = document.getElementById('bodyfarr')

                row.innerHTML = `<th scope="row" id="mcol1+${farr.id}" data-value="${farr.date}">${formateddate}</th>
                <td id="mcol2+${farr.id}" data-value="${farr.farrier}">${farr.farrier}</td>
                <td id="mcol3+${farr.id}" data-value="${farr.type}">${farr.type}</td>   
                <td id="mcol4+${farr.id}">  
                  <button class="btn btn-light" id="fedit+${farr.id}" title="Modifier" onclick=editfarriery(${farr.id})>✍</button>
                  <button class="btn btn-light" id="fdel+${farr.id}" title="Supprimer" onclick=deletefarriery(${farr.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)

            }

            // reset form and warnings an d change views
            document.getElementById('newfarr').reset();  
            document.getElementById('crwarningfarr').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"

            document.getElementById('farriery').style.display = 'block';
            document.getElementById('farrieryedit').style.display = 'none';
            document.getElementById('farrierynew').style.display = 'none';

            document.getElementById("farriery").focus({preventScroll:false})
        })
        .catch(error => {
            console.log(error)       
        });
    }
}


function deletefarriery(id) {
    // id : farr id

    //delete the form with a function
    fetch(`/farriery/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);
        
        // hide nicely with an animation and remove at the end of it:
        element = document.getElementById(`mrow+${id}`);
        element.style.animationPlayState = 'running';
        setTimeout(function (){
           element.remove()    
         }, 1000);

    })
    .catch(error => console.log(error));   
}


function editfarriery(id) {
    // id : farr id

    // change views
    document.getElementById('farriery').style.display = 'none';
    document.getElementById('farrieryedit').style.display = 'block';
    document.getElementById('farrierynew').style.display = 'none';

    // select element
    element = document.getElementById('farrieryedit')

    //take actual values : 
    var actualdate = document.getElementById(`mcol1+${id}`).getAttribute("data-value"); 
    var actualfarrier = document.getElementById(`mcol2+${id}`).getAttribute("data-value"); 
    var actualtype = document.getElementById(`mcol3+${id}`).getAttribute("data-value"); 

    if ( !isNaN(Date.parse(actualdate)) ) {
        actualdate = new Date(actualdate).toISOString().substring(0, 10)
    }
    
    // prefill form
    element.querySelector('#m_f').value = actualfarrier;
    element.querySelector('#m_d').value = actualdate;
    element.querySelector('#m_n').value = actualtype;

    // event listener :
    element.querySelector('#edfarr').onsubmit = function(e) {
        e.preventDefault();

        // get new values
        const ndate = element.querySelector('#m_d').value;
        const nfarrier = element.querySelector('#m_f').value;
        const ntype = element.querySelector('#m_n').value;

        // warnings 
        if (ndate.length < 1 ) {
            element.querySelector('#edtwarningfarr').innerHTML = "La date de rendez-vous n'est pas indiquée."  
            document.getElementById("edtwarningfarr").focus({preventScroll:false})  
        }

        else if (nfarrier.length < 1) {
            element.querySelector('#edtwarningfarr').innerHTML = "Le maréchal n'est pas indiqué. A défaut, remplissez 'Non spécifié'." 
            document.getElementById("edtwarningfarr").focus({preventScroll:false})
        }

        else if (nfarrier.length > 200) {
            element.querySelector('#edtwarningfarr').innerHTML = "La case du maréchal ne peut contenir que 200 charactères." 
            document.getElementById("edtwarningfarr").focus({preventScroll:false})
        }

        else if (ntype.length > 300) {
            element.querySelector('#edtwarningfarr').innerHTML = "La case du type de ferrure ne peut contenir que 300 charactères." 
            document.getElementById("edtwarningfarr").focus({preventScroll:false})
        }

        else {

            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/editfarriery/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    type : ntype,
                    date : ndate,
                    farrier : nfarrier,
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => response.json())
            .then(response => {
                if (response.ok) {
                    return response.json();
                  } 
                else {
                    document.getElementById('edtwarningfarr').innerHTML = "Une erreur s'est produite. Veuillez vérifier les informations que vous avez saisies."
                    document.getElementById("edtwarningfarr").focus({preventScroll:false})  
                    throw new Error('Something went wrong');   
                  }
            })
            .then(edtfar => {

                // format date
                var myedtdate = new Date(`${edtfar.date}`);
                var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myedtdate.getMonth()];
                var formateddate = myedtdate.getDate() + ' ' + mymonth + ' ' + myedtdate.getFullYear() 
                
                // year of the entry
                dateyear = myedtdate.getFullYear()

                // year showed 
                elemtmp = document.getElementById('farriery');
                current_year = elemtmp.querySelector('#mshowselectyear').getAttribute('data-value');

                //get actual date
                get_year = document.getElementById('yeartoday')
                act_year = get_year.getAttribute('data-value')

                // avant/après cases years limits
                fut_year = parseInt(act_year) + 2
                ant_year = parseInt(act_year) - 2

                // change table if its the concerned year (and also if the date can't be found somehow.)
                if ( current_year != 1111 && current_year != 1001 && dateyear == current_year || dateyear == null) {
                    // change div to actualize 
                    document.getElementById(`mcol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`mcol1+${id}`).setAttribute('data-value', `${edtfar.date}`);
                    document.getElementById(`mcol2+${id}`).innerHTML = `${edtfar.farrier}`;
                    document.getElementById(`mcol2+${id}`).setAttribute('data-value', `${edtfar.farrier}`);
                    document.getElementById(`mcol3+${id}`).innerHTML = `${edtfar.type}`;
                    document.getElementById(`mcol3+${id}`).setAttribute('data-value', `${edtfar.type}`);
                }

                // change table if year is in the categorie "after" and if its date is past 2 years from now.
                else if ( current_year == 1111  && dateyear > fut_year) {
                    // change div to actualize 
                    document.getElementById(`mcol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`mcol1+${id}`).setAttribute('data-value', `${edtfar.date}`);
                    document.getElementById(`mcol2+${id}`).innerHTML = `${edtfar.farrier}`;
                    document.getElementById(`mcol2+${id}`).setAttribute('data-value', `${edtfar.farrier}`);
                    document.getElementById(`mcol3+${id}`).innerHTML = `${edtfar.type}`;
                    document.getElementById(`mcol3+${id}`).setAttribute('data-value', `${edtfar.type}`);
                }

                // change table if year is in the categorie "avant" and if its date is before 2 years from now.
                else if ( current_year == 1001 && dateyear < ant_year) {
                    document.getElementById(`mcol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`mcol1+${id}`).setAttribute('data-value', `${edtfar.date}`);
                    document.getElementById(`mcol2+${id}`).innerHTML = `${edtfar.farrier}`;
                    document.getElementById(`mcol2+${id}`).setAttribute('data-value', `${edtfar.farrier}`);
                    document.getElementById(`mcol3+${id}`).innerHTML = `${edtfar.type}`;
                    document.getElementById(`mcol3+${id}`).setAttribute('data-value', `${edtfar.type}`);
                }

                // if we change years in edit, don't show it if it changes categs showed.
                else {
                    //delete view of the row.
                    rowtodel = document.getElementById(`mrow+${id}`);
                    rowtodel.remove()
                }

                // reset form and warnings
                document.getElementById('edfarr').reset();
                document.getElementById('edtwarningfarr').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"

                // change views
                document.getElementById('farriery').style.display = 'block';
                document.getElementById('farrieryedit').style.display = 'none';
                document.getElementById('farrierynew').style.display = 'none';

                document.getElementById("farriery").focus({preventScroll:false})
            })
            .catch(error => console.log(error));
        }
    }
}


function farryearview(year) {

    // get user.id and select body of the dates table.
    var id = document.getElementById(`infos`).getAttribute("data-value"); 
    bodyelement = document.getElementById('bodyfarr');

    // erase previous rows.
    bodyelement.innerHTML = ''

    // get context
    var context = "farriery"

     //charge the year entries with fetch
     fetch(`/yearview/${id}/${year}/${context}`)
     .then(response => response.json())
     .then(results => { 
         console.log("Success")

         // change year button   
        buttonyear = document.getElementById('mshowselectyear');
        buttonyear.setAttribute('data-value', `${year}`);
        buttonyear.innerHTML = `${year}`;

        if (year == 1001) {
            buttonyear.innerHTML = "Avant" 
        }

        else if (year == 1111) {
            buttonyear.innerHTML = "Après"     
        }

        for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `mrow+${results[i].id}`

            // format date
            var mydate = new Date(`${results[i].date}`);
            var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
             "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + mymonth + ' ' + mydate.getFullYear() 

            row.innerHTML = `<th scope="row" id="mcol1+${results[i].id}" data-value="${results[i].date}">${formateddate}</th>
            <td id="mcol2+${results[i].id}" data-value="${results[i].farrier}">${results[i].farrier}</td>
            <td id="mcol3+${results[i].id}" data-value="${results[i].type}">${results[i].type}</td>   
            <td id="mcol4+${results[i].id}">  
              <button class="btn btn-light" id="fedit+${results[i].id}" title="Modifier" onclick=editfarriery(${results[i].id})>✍</button>
              <button class="btn btn-light" id="fdel+${results[i].id}" title="Supprimer" onclick=deletefarriery(${results[i].id})>❌</button>          
            </td> `

            bodyelement.append(row);
        }
    })
    .catch(error => console.log(error));
}


function newdewormer(id) {
    // id : horse.id

    // change views
    document.getElementById('wormer').style.display = 'none';
    document.getElementById('wormeredit').style.display = 'none';
    document.getElementById('wormernew').style.display = 'block';

    // select element
    element = document.getElementById('wormernew')

    // submit event
    element.querySelector('#newdew').onsubmit = function(e) {
        e.preventDefault();

        form = element.querySelector('#newdew')

        //get form values
        formdata = new FormData(form)  
        
        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        // fetch call
        fetch(`/dewormer/${id}`, {
            method: 'POST',
            body:formdata,
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => {
            if (response.ok) {
                return response.json();
              } 
            else {
                document.getElementById('crwarningdew').innerHTML = "Une erreur s'est produite. Vérifiez les informations que vous avez entrées, le nom et la date du vermifuge doivent être indiqués. Si la date du prochain vermifuge est indiquée, elle doit être supérieure à la date d'administration du vermifuge."
                document.getElementById("crwarningdew").focus({preventScroll:false})
                throw new Error('Something went wrong');   
              }
        })
        .then(dew => { 

            // format date
            var mydate = new Date(`${dew.date}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

            var mydate2 = new Date(`${dew.nextdate}`);
            var month2 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate2.getMonth()];
            var formateddate2 = mydate2.getDate() + ' ' + month2 + ' ' + mydate2.getFullYear();

            dateyear = mydate.getFullYear();
            elemtmp = document.getElementById('wormer');
            current_year = elemtmp.querySelector('#wshowselectyear').getAttribute('data-value');

            //get actual date
            get_year = document.getElementById('yeartoday')
            act_year = get_year.getAttribute('data-value')

            // avant/après cases years limits
            fut_year = parseInt(act_year) + 2
            ant_year = parseInt(act_year) - 2

            // change table if its the concerned year.
            if ( dateyear == current_year || dateyear == null) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `wrow+${dew.id}`

                elementtbody = document.getElementById('bodydew')

                if (dew.nextdate == null) {
                    row.innerHTML = `<th scope="row" id="wcol1+${dew.id}" data-value="${dew.date}">${formateddate}</th>
                    <td id="wcol2+${dew.id}" data-value="${dew.name}">${dew.name}</td>
                    <td id="wcol3+${dew.id}" data-value="${dew.molecule}">${dew.molecule}</td>   
                    <td id="wcol4+${dew.id}" data-value="${dew.nextname}">${dew.nextname}</td>   
                    <td id="wcol5+${dew.id}" data-value="${dew.nextdate}"></td>  
                    <td id="wcol6+${dew.id}">
                      <button class="btn btn-light" id="wedit+${dew.id}" title="Modifier" onclick=editdew(${dew.id})>✍</button>
                      <button class="btn btn-light" id="wdel+${dew.id}" title="Supprimer" onclick=deletedew(${dew.id})>❌</button>
                    </td> `
                }

                else if (dew.nextdate != null) {
                    row.innerHTML = `<th scope="row" id="wcol1+${dew.id}" data-value="${dew.date}">${formateddate}</th>
                    <td id="wcol2+${dew.id}" data-value="${dew.name}">${dew.name}</td>
                    <td id="wcol3+${dew.id}" data-value="${dew.molecule}">${dew.molecule}</td>   
                    <td id="wcol4+${dew.id}" data-value="${dew.nextname}">${dew.nextname}</td>   
                    <td id="wcol5+${dew.id}" data-value="${dew.nextdate}">${formateddate2}</td>  
                    <td id="wcol6+${dew.id}">
                      <button class="btn btn-light" id="wedit+${dew.id}" title="Modifier" onclick=editdew(${dew.id})>✍</button>
                      <button class="btn btn-light" id="wdel+${dew.id}" title="Supprimer" onclick=deletedew(${dew.id})>❌</button>
                    </td> `    
                }
                elementtbody.prepend(row)
            }

            else if ( current_year == 1111  && dateyear > fut_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `wrow+${dew.id}`

                elementtbody = document.getElementById('bodydew')

                if (dew.nextdate == null) {
                    row.innerHTML = `<th scope="row" id="wcol1+${dew.id}" data-value="${dew.date}">${formateddate}</th>
                    <td id="wcol2+${dew.id}" data-value="${dew.name}">${dew.name}</td>
                    <td id="wcol3+${dew.id}" data-value="${dew.molecule}">${dew.molecule}</td>   
                    <td id="wcol4+${dew.id}" data-value="${dew.nextname}">${dew.nextname}</td>   
                    <td id="wcol5+${dew.id}" data-value="${dew.nextdate}"></td>  
                    <td id="wcol6+${dew.id}">
                      <button class="btn btn-light" id="wedit+${dew.id}" title="Modifier" onclick=editdew(${dew.id})>✍</button>
                      <button class="btn btn-light" id="wdel+${dew.id}" title="Supprimer" onclick=deletedew(${dew.id})>❌</button>
                    </td> `
                }

                else if (dew.nextdate != null) {
                    row.innerHTML = `<th scope="row" id="wcol1+${dew.id}" data-value="${dew.date}">${formateddate}</th>
                    <td id="wcol2+${dew.id}" data-value="${dew.name}">${dew.name}</td>
                    <td id="wcol3+${dew.id}" data-value="${dew.molecule}">${dew.molecule}</td>   
                    <td id="wcol4+${dew.id}" data-value="${dew.nextname}">${dew.nextname}</td>   
                    <td id="wcol5+${dew.id}" data-value="${dew.nextdate}">${formateddate2}</td>  
                    <td id="wcol6+${dew.id}">
                      <button class="btn btn-light" id="wedit+${dew.id}" title="Modifier" onclick=editdew(${dew.id})>✍</button>
                      <button class="btn btn-light" id="wdel+${dew.id}" title="Supprimer" onclick=deletedew(${dew.id})>❌</button>
                    </td> `    
                }

                elementtbody.prepend(row)
            }

            else if ( current_year == 1001 && dateyear < ant_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `wrow+${dew.id}`

                elementtbody = document.getElementById('bodydew')

                if (dew.nextdate == null) {
                    row.innerHTML = `<th scope="row" id="wcol1+${dew.id}" data-value="${dew.date}">${formateddate}</th>
                    <td id="wcol2+${dew.id}" data-value="${dew.name}">${dew.name}</td>
                    <td id="wcol3+${dew.id}" data-value="${dew.molecule}">${dew.molecule}</td>   
                    <td id="wcol4+${dew.id}" data-value="${dew.nextname}">${dew.nextname}</td>   
                    <td id="wcol5+${dew.id}" data-value="${dew.nextdate}"></td>  
                    <td id="wcol6+${dew.id}">
                      <button class="btn btn-light" id="wedit+${dew.id}" title="Modifier" onclick=editdew(${dew.id})>✍</button>
                      <button class="btn btn-light" id="wdel+${dew.id}" title="Supprimer" onclick=deletedew(${dew.id})>❌</button>
                    </td> `
                }

                else if (dew.nextdate != null) {
                    row.innerHTML = `<th scope="row" id="wcol1+${dew.id}" data-value="${dew.date}">${formateddate}</th>
                    <td id="wcol2+${dew.id}" data-value="${dew.name}">${dew.name}</td>
                    <td id="wcol3+${dew.id}" data-value="${dew.molecule}">${dew.molecule}</td>   
                    <td id="wcol4+${dew.id}" data-value="${dew.nextname}">${dew.nextname}</td>   
                    <td id="wcol5+${dew.id}" data-value="${dew.nextdate}">${formateddate2}</td>  
                    <td id="wcol6+${dew.id}">
                      <button class="btn btn-light" id="wedit+${dew.id}" title="Modifier" onclick=editdew(${dew.id})>✍</button>
                      <button class="btn btn-light" id="wdel+${dew.id}" title="Supprimer" onclick=deletedew(${dew.id})>❌</button>
                    </td> `    
                }

                elementtbody.prepend(row)
            }

            // reset form and warnings an d change views
            document.getElementById('newdew').reset();  
            document.getElementById('crwarningdew').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"

            document.getElementById('wormer').style.display = 'block';
            document.getElementById('wormeredit').style.display = 'none';
            document.getElementById('wormernew').style.display = 'none';

            document.getElementById("wormer").focus({preventScroll:false})

        })
        .catch(error => console.log(error));
    }
}


function deletedew(id) {
    // id : dewormer.id

    //delete the form with a function
    fetch(`/dewormer/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);
        
        // hide nicely with an animation and remove at the end of it:
        element = document.getElementById(`wrow+${id}`);
        element.style.animationPlayState = 'running';
        setTimeout(function (){
           element.remove()    
         }, 1000);
    })
    .catch(error => console.log(error));   
}


function editdew(id) {
    // id : dewormer.id

    // change views
    document.getElementById('wormer').style.display = 'none';
    document.getElementById('wormeredit').style.display = 'block';
    document.getElementById('wormernew').style.display = 'none';

    // select element
    element = document.getElementById('wormeredit')

    //take actual values : 
    var actualdate = document.getElementById(`wcol1+${id}`).getAttribute("data-value"); 
    var actualname = document.getElementById(`wcol2+${id}`).getAttribute("data-value"); 
    var actualmol = document.getElementById(`wcol3+${id}`).getAttribute("data-value"); 
    var actualnextname = document.getElementById(`wcol4+${id}`).getAttribute("data-value"); 
    var actualnextdate = document.getElementById(`wcol5+${id}`).getAttribute("data-value"); 

    // check for validity
    if ( !isNaN(Date.parse(actualdate)) ) {
        actualdate = new Date(actualdate).toISOString().substring(0, 10)
    }
  
    if ( !isNaN(Date.parse(actualnextdate)) ) {
        actualnextdate = new Date(actualnextdate).toISOString().substring(0, 10)
    }

    // prefill the form 
    element.querySelector('#dewdate').value = actualdate;
    element.querySelector('#dewname').value = actualname;
    element.querySelector('#dewmol').value = actualmol;
    element.querySelector('#dewdatenext').value = actualnextdate;
    element.querySelector('#dewnamenext').value = actualnextname;

    // event listener here: 
    element.querySelector('#editdew').onsubmit = function(e) {
        e.preventDefault();

        // get new values
        const newdate = element.querySelector('#dewdate').value;
        const newname = element.querySelector('#dewname').value;
        const newmol = element.querySelector('#dewmol').value;
        const newnextdate = element.querySelector('#dewdatenext').value;
        const newnextname = element.querySelector('#dewnamenext').value;

        var d1 = new Date(newdate)
        var d2 = new Date(newnextdate)

        // warnings
        if (newname.length < 1 ) {
            element.querySelector('#edtwarningdew').innerHTML = "Le nom du vermifuge n'est pas indiqué." 
            document.getElementById("edtwarningdew").focus({preventScroll:false})   
        }

        else if (newname.length > 30 ) {
            element.querySelector('#edtwarningdew').innerHTML = "La case du nom du vermifuge ne peut contenir que 30 charactères."  
            document.getElementById("edtwarningdew").focus({preventScroll:false})     
        }

        else if (newdate.length < 1) {
            element.querySelector('#edtwarningdew').innerHTML = "La date du vermifuge n'est pas indiquée."  
            document.getElementById("edtwarningdew").focus({preventScroll:false})     
        }

        else if (newnextname.length > 30) {
            element.querySelector('#edtwarningdew').innerHTML = "La case du nom du prochain vermifuge ne peut contenir que 30 charactères."
            document.getElementById("edtwarningdew").focus({preventScroll:false})       
        }

        else if (newmol.length > 50) {
            element.querySelector('#edtwarningdew').innerHTML = "La case de la molécule du vermifuge ne peut contenir que 50 charactères."
            document.getElementById("edtwarningdew").focus({preventScroll:false})       
        }

        else if (d1 != null && d2 != null && d1 >= d2) {
            element.querySelector('#edtwarningdew').innerHTML = "La date du prochain vermifuge doit être ultérieure à la date d'administration initiale."    
            document.getElementById("edtwarningdew").focus({preventScroll:false})   
        }
   
        else {
            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/editdewormer/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    name : newname,
                    molecule : newmol,
                    date : newdate,
                    nextdate : newnextdate,
                    nextname : newnextname
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => {
                if (response.ok) {
                    return response.json();
                  } 
                else {
                    document.getElementById('edtwarningdew').innerHTML = "Une erreur s'est produite. Veuillez vérifier les informations que vous avez saisies."
                    document.getElementById("edtwarningdew").focus({preventScroll:false})  
                    throw new Error('Something went wrong');   
                  }
            })
            .then(editeddew => { 
                console.log(editeddew)

                // format date
                var mydate = new Date(`${editeddew.date}`);
                var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
                var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

                var mydate2 = new Date(`${editeddew.nextdate}`);
                var month2 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate2.getMonth()];
                var formateddate2 = mydate2.getDate() + ' ' + month2 + ' ' + mydate2.getFullYear();

                dateyear = mydate.getFullYear();
                elemtmp = document.getElementById('wormer');
                current_year = elemtmp.querySelector('#wshowselectyear').getAttribute('data-value');

                //get actual date
                get_year = document.getElementById('yeartoday')
                act_year = get_year.getAttribute('data-value')

                // avant/après cases years limits
                fut_year = parseInt(act_year) + 2
                ant_year = parseInt(act_year) - 2

                // change view in function of the edited year.
                // case where the edited year is still the same (exept for "avant" and "après")
                if (current_year != 1000 && dateyear == current_year || dateyear == null) {

                    // change div to actualize 
                    document.getElementById(`wcol1+${id}`).innerHTML = `${formateddate}`
                    document.getElementById(`wcol1+${id}`).setAttribute('data-value', `${editeddew.date}`);
                    document.getElementById(`wcol2+${id}`).innerHTML = `${editeddew.name}`
                    document.getElementById(`wcol2+${id}`).setAttribute('data-value', `${editeddew.name}`);
                    document.getElementById(`wcol3+${id}`).innerHTML = `${editeddew.molecule}`
                    document.getElementById(`wcol3+${id}`).setAttribute('data-value', `${editeddew.molecule}`);
                    document.getElementById(`wcol4+${id}`).innerHTML = `${editeddew.nextname}`
                    document.getElementById(`wcol4+${id}`).setAttribute('data-value', `${editeddew.nextname}`); 
                    document.getElementById(`wcol5+${id}`).innerHTML = `${formateddate2}`
                    document.getElementById(`wcol5+${id}`).setAttribute('data-value', `${editeddew.next}`);

                    if (editeddew.molecule == null) {
                        document.getElementById(`wcol3+${id}`).innerHTML = ' '
                    }

                    if (editeddew.nextdate == null) {
                        document.getElementById(`wcol5+${id}`).innerHTML = ' '
                    }

                    if (editeddew.nextname == null) {
                        document.getElementById(`wcol4+${id}`).innerHTML = ' '
                    }
                }

                // case where the edited year is still the same and it's "avant" categ
                else if (current_year == 1001 && dateyear < ant_year) {
                    // change div to actualize 
                    document.getElementById(`wcol1+${id}`).innerHTML = `${formateddate}`
                    document.getElementById(`wcol1+${id}`).setAttribute('data-value', `${editeddew.date}`);
                    document.getElementById(`wcol2+${id}`).innerHTML = `${editeddew.name}`
                    document.getElementById(`wcol2+${id}`).setAttribute('data-value', `${editeddew.name}`);
                    document.getElementById(`wcol3+${id}`).innerHTML = `${editeddew.molecule}`
                    document.getElementById(`wcol3+${id}`).setAttribute('data-value', `${editeddew.molecule}`);
                    document.getElementById(`wcol4+${id}`).innerHTML = `${editeddew.nextname}`
                    document.getElementById(`wcol4+${id}`).setAttribute('data-value', `${editeddew.nextname}`); 
                    document.getElementById(`wcol5+${id}`).innerHTML = `${formateddate2}`
                    document.getElementById(`wcol5+${id}`).setAttribute('data-value', `${editeddew.next}`);

                    if (editeddew.molecule == null) {
                        document.getElementById(`wcol3+${id}`).innerHTML = ' '
                    }

                    if (editeddew.nextdate == null) {
                        document.getElementById(`wcol5+${id}`).innerHTML = ' '
                    }

                    if (editeddew.nextname == null) {
                        document.getElementById(`wcol4+${id}`).innerHTML = ' '
                    }
                }

                // case if it's still in 'après' 
                else if ( current_year == 1111  && dateyear > fut_year) {
                    // change div to actualize 
                    document.getElementById(`wcol1+${id}`).innerHTML = `${formateddate}`
                    document.getElementById(`wcol1+${id}`).setAttribute('data-value', `${editeddew.date}`);
                    document.getElementById(`wcol2+${id}`).innerHTML = `${editeddew.name}`
                    document.getElementById(`wcol2+${id}`).setAttribute('data-value', `${editeddew.name}`);
                    document.getElementById(`wcol3+${id}`).innerHTML = `${editeddew.molecule}`
                    document.getElementById(`wcol3+${id}`).setAttribute('data-value', `${editeddew.molecule}`);
                    document.getElementById(`wcol4+${id}`).innerHTML = `${editeddew.nextname}`
                    document.getElementById(`wcol4+${id}`).setAttribute('data-value', `${editeddew.nextname}`); 
                    document.getElementById(`wcol5+${id}`).innerHTML = `${formateddate2}`
                    document.getElementById(`wcol5+${id}`).setAttribute('data-value', `${editeddew.next}`);

                    if (editeddew.molecule == null) {
                        document.getElementById(`wcol3+${id}`).innerHTML = ' '
                    }

                    if (editeddew.nextdate == null) {
                        document.getElementById(`wcol5+${id}`).innerHTML = ' '
                    }

                    if (editeddew.nextname == null) {
                        document.getElementById(`wcol4+${id}`).innerHTML = ' '
                    }
                }

                // case where the edited year doesnt match the previous one and is not 'avant'
                else {
                    //delete view of the row.
                    rowtmp = document.getElementById(`wrow+${id}`);
                    rowtmp.remove()
                } 

                // reset form
                document.getElementById('editdew').reset();
   
                // change views
                document.getElementById('wormer').style.display = 'block';
                document.getElementById('wormeredit').style.display = 'none';
                document.getElementById('wormernew').style.display = 'none';
                document.getElementById('edtwarningdew').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"


                document.getElementById("wormer").focus({preventScroll:false})
            })
            .catch(error => console.log(error));
        }
    }
}


function dewyearview(year) {
    // get user.id and select body of the dates table.
    var id = document.getElementById(`infos`).getAttribute("data-value"); 
    bodyelement = document.getElementById('bodydew');

    // erase previous rows.
    bodyelement.innerHTML = ''

    // get context
    var context = "dewormer"

    //charge the year entries with fetch
    fetch(`/yearview/${id}/${year}/${context}`)
    .then(response => response.json())
    .then(results => { 
        console.log("Success")

        // change year button   
        buttonyear = document.getElementById('wshowselectyear');
        buttonyear.setAttribute('data-value', `${year}`);
        buttonyear.innerHTML = `${year}`;

        if (year == 1001) {
            buttonyear.innerHTML = "Avant" 
        }

        else if (year == 1111) {
            buttonyear.innerHTML = "Après"     
        }

        for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `wrow+${results[i].id}`

            // format date
            var mydate = new Date(`${results[i].date}`);
            var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + mymonth + ' ' + mydate.getFullYear() 

            var mydate2 = new Date(`${results[i].nextdate}`);
            var month2 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate2.getMonth()];
            var formateddate2 = mydate2.getDate() + ' ' + month2 + ' ' + mydate2.getFullYear();

            if (results[i].nextdate == null) {
                row.innerHTML = `<th scope="row" id="wcol1+${results[i].id}" data-value="${results[i].date}">${formateddate}</th>
                <td id="wcol2+${results[i].id}" data-value="${results[i].name}">${results[i].name}</td>
                <td id="wcol3+${results[i].id}" data-value="${results[i].molecule}">${results[i].molecule}</td>   
                <td id="wcol4+${results[i].id}" data-value="${results[i].nextname}">${results[i].nextname}</td>   
                <td id="wcol5+${results[i].id}" data-value="${results[i].nextdate}"></td>  
                <td id="wcol6+${results[i].id}">
                <button class="btn btn-light" id="wedit+${results[i].id}" title="Modifier" onclick=editdew(${results[i].id})>✍</button>
                <button class="btn btn-light" id="wdel+${results[i].id}" title="Supprimer" onclick=deletedew(${results[i].id})>❌</button>
                </td> `
            }

            else if (results[i].nextdate != null) {
                row.innerHTML = `<th scope="row" id="wcol1+${results[i].id}" data-value="${results[i].date}">${formateddate}</th>
                <td id="wcol2+${results[i].id}" data-value="${results[i].name}">${results[i].name}</td>
                <td id="wcol3+${results[i].id}" data-value="${results[i].molecule}">${results[i].molecule}</td>   
                <td id="wcol4+${results[i].id}" data-value="${results[i].nextname}">${results[i].nextname}</td>   
                <td id="wcol5+${results[i].id}" data-value="${results[i].nextdate}">${formateddate2}</td>  
                <td id="wcol6+${results[i].id}">
                <button class="btn btn-light" id="wedit+${results[i].id}" title="Modifier" onclick=editdew(${results[i].id})>✍</button>
                <button class="btn btn-light" id="wdel+${results[i].id}" title="Supprimer" onclick=deletedew(${results[i].id})>❌</button>
                </td> `
            }
            bodyelement.append(row);
        }
    })
    .catch(error => console.log(error));
}


function newdentistry(id) {
    // id : horse.id

    // change views
    document.getElementById('dentist').style.display = 'none';
    document.getElementById('dentistedit').style.display = 'none';
    document.getElementById('dentistnew').style.display = 'block';

    // select element
    elementform = document.getElementById('dentistnew')

    // submit event
    elementform.querySelector('#newdent').onsubmit = function(e) {
        e.preventDefault();

        form = elementform.querySelector('#newdent')

        //get form values
        formdata = new FormData(form)  
        
        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/dentistry/${id}`, {
            method: 'POST',
            body:formdata,
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => {
            if (response.ok) {
                return response.json();
              } 
            else {
                document.getElementById('crwarningdent').innerHTML = "Une erreur s'est produite. Veuillez vérifier les informations que vous avez saisies."
                document.getElementById("crwarningdent").focus({preventScroll:false})   
                throw new Error('Something went wrong');   
              }
        })
        .then(dent => {

            // format date
            var mydate = new Date(`${dent.date}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

            dateyear = mydate.getFullYear();
            elemtmp = document.getElementById('dentist');
            current_year = elemtmp.querySelector('#dtshowselectyear').getAttribute('data-value');

            //get actual date
            get_year = document.getElementById('yeartoday')
            act_year = get_year.getAttribute('data-value')

            // avant case years limit
            ant_year = parseInt(act_year) - 4

            // change table if its the concerned year.
            if ( dateyear == current_year || dateyear == null) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `dtrow+${dent.id}`

                elementtbody = document.getElementById('bodydent')

                row.innerHTML = `<th scope="row" id="dtcol1+${dent.id}" data-value="${dent.date}">${formateddate}</th>
                <td id="dtcol2+${dent.id}" data-value="${dent.dentist}">${dent.dentist}</td>
                <td id="dtcol3+${dent.id}" data-value="${dent.diagnostic}">${dent.diagnostic}</td>   
                <td id="dtcol4+${dent.id}">  
                  <button class="btn btn-light" id="dtedit+${dent.id}" title="Modifier" onclick=editdentistry(${dent.id})>✍</button>
                  <button class="btn btn-light" id="dydel+${dent.id}" title="Supprimer" onclick=deletedentistry(${dent.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)
            }

            else if ( current_year == 1000 && dateyear < ant_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `dtrow+${dent.id}`

                elementtbody = document.getElementById('bodydent')

                row.innerHTML = `<th scope="row" id="dtcol1+${dent.id}" data-value="${dent.date}">${formateddate}</th>
                <td id="dtcol2+${dent.id}" data-value="${dent.dentist}">${dent.dentist}</td>
                <td id="dtcol3+${dent.id}" data-value="${dent.diagnostic}">${dent.diagnostic}</td>   
                <td id="dtcol4+${dent.id}">  
                  <button class="btn btn-light" id="dtedit+${dent.id}" title="Modifier" onclick=editdentistry(${dent.id})>✍</button>
                  <button class="btn btn-light" id="dydel+${dent.id}" title="Supprimer" onclick=deletedentistry(${dent.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)
            }

            // reset form and warnings an d change views
            document.getElementById('newdent').reset();  
            document.getElementById('crwarningdent').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"

            // change views
            document.getElementById('dentist').style.display = 'block';
            document.getElementById('dentistedit').style.display = 'none';
            document.getElementById('dentistnew').style.display = 'none';

            document.getElementById("dentist").focus({preventScroll:false})
        })
        .catch(error => console.log(error));
    }
}


function deletedentistry(id) {
    //id : dentistry id

    //delete the form with a function
    fetch(`/dentistry/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);
        
        // hide nicely with an animation and remove at the end of it:
        element = document.getElementById(`dtrow+${id}`);
        element.style.animationPlayState = 'running';
        setTimeout(function (){
           element.remove()    
         }, 1000);
    })
    .catch(error => console.log(error));   
}


function editdentistry(id) {
    //id : dentistry.id

    // change views
    document.getElementById('dentist').style.display = 'none';
    document.getElementById('dentistedit').style.display = 'block';
    document.getElementById('dentistnew').style.display = 'none';

    // select element
    element = document.getElementById('dentistedit')

    //take actual values : 
    var actualdate = document.getElementById(`dtcol1+${id}`).getAttribute("data-value"); 
    var actualdentist = document.getElementById(`dtcol2+${id}`).getAttribute("data-value"); 
    var actualdiag = document.getElementById(`dtcol3+${id}`).getAttribute("data-value"); 

    if ( !isNaN(Date.parse(actualdate)) ) {
        actualdate = new Date(actualdate).toISOString().substring(0, 10)
    }

    // prefill form
    element.querySelector('#dt_de').value = actualdentist;
    element.querySelector('#dt_d').value = actualdate;
    element.querySelector('#dt_diag').value = actualdiag;


    // event listener :
    element.querySelector('#edtdent').onsubmit = function(e) {
        e.preventDefault();

        const newdentist = element.querySelector('#dt_de').value;
        const newdate = element.querySelector('#dt_d').value;
        const newdiag = element.querySelector('#dt_diag').value;

        // warnings
        // warnings 
        if (newdate.length < 1 ) {
            element.querySelector('#edtwarningdent').innerHTML = "La date n'est pas indiquée."
            document.getElementById("edtwarningdent").focus({preventScroll:false})    
        }

        else if (newdentist.length < 1) {
            element.querySelector('#edtwarningdent').innerHTML = "Le dentiste n'est pas indiqué. A défaut, remplissez 'Non spécifié'." 
            document.getElementById("edtwarningdent").focus({preventScroll:false})
        }

        else if (newdentist.length > 200) {
            element.querySelector('#edtwarningdent').innerHTML = "La case du dentiste ne peut contenir que 200 charactères." 
            document.getElementById("edtwarningdent").focus({preventScroll:false})
        }

        else if (newdiag.length > 300) {
            element.querySelector('#edtwarningdent').innerHTML = "La case du diagnostic ne peut contenir que 300 charactères." 
            document.getElementById("edtwarningdent").focus({preventScroll:false})
        }

        else {

            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/editdentistry/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    diagnostic : newdiag,
                    date : newdate,
                    dentist : newdentist,
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => {
                if (response.ok) {
                    return response.json();
                  } 
                else {
                    document.getElementById('edtwarningdent').innerHTML = "Une erreur s'est produite. Vérifiez les informations que vous avez saisies."
                    document.getElementById("edtwarningdent").focus({preventScroll:false})
                    throw new Error('Something went wrong');               
                  }
            })
            .then(result => {

                // format date
                var myedtdate = new Date(`${result.date}`);
                var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myedtdate.getMonth()];
                var formateddate = myedtdate.getDate() + ' ' + mymonth + ' ' + myedtdate.getFullYear();
                
                // year of the entry
                dateyear = myedtdate.getFullYear()

                // year showed 
                elemtmp = document.getElementById('dentist');
                current_year = elemtmp.querySelector('#dtshowselectyear').getAttribute('data-value');

                //get actual date
                get_year = document.getElementById('yeartoday')
                act_year = get_year.getAttribute('data-value')

                // avant case year limits
                ant_year = parseInt(act_year) - 4

                // change table if its the concerned year (and also if the date can't be found somehow.)
                if ( dateyear == current_year || dateyear == null) {
                    // change div to actualize 
                    document.getElementById(`dtcol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`dtcol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`dtcol2+${id}`).innerHTML = `${result.dentist}`;
                    document.getElementById(`dtcol2+${id}`).setAttribute('data-value', `${result.dentist}`);
                    document.getElementById(`dtcol3+${id}`).innerHTML = `${result.diagnostic}`;
                    document.getElementById(`dtcol3+${id}`).setAttribute('data-value', `${result.diagnostic}`);
                }

                // change table if its the concerned avant categ
                else if ( current_year == 1000 && dateyear < ant_year) {    
                    // change div to actualize 
                    document.getElementById(`dtcol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`dtcol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`dtcol2+${id}`).innerHTML = `${result.dentist}`;
                    document.getElementById(`dtcol2+${id}`).setAttribute('data-value', `${result.dentist}`);
                    document.getElementById(`dtcol3+${id}`).innerHTML = `${result.diagnostic}`;
                    document.getElementById(`dtcol3+${id}`).setAttribute('data-value', `${result.diagnostic}`);
                }

                // if we change years in edit, don't show it if it changes categs showed.
                else {
                    //delete view of the row.
                    rowtodel = document.getElementById(`dtrow+${id}`);
                    rowtodel.remove()
                }

                // reset form and warnings
                document.getElementById('edtdent').reset();
                document.getElementById('edtwarningdent').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"

                // change views
                document.getElementById('dentist').style.display = 'block';
                document.getElementById('dentistedit').style.display = 'none';
                document.getElementById('dentistnew').style.display = 'none';

                document.getElementById("dentist").focus({preventScroll:false})

            })
            .catch(error => console.log(error));
        }
    }
}


function dentyearview(year) {

    // get user.id and select body of the dates table.
    var id = document.getElementById(`infos`).getAttribute("data-value"); 
    bodyelement = document.getElementById('bodydent');

    // erase previous rows.
    bodyelement.innerHTML = ''

    // get context
    var context = "dentistry"

    //charge the year entries with fetch
    fetch(`/yearview/${id}/${year}/${context}`)
    .then(response => response.json())
    .then(results => { 
        console.log("Success")

        // change year button   
       buttonyear = document.getElementById('dtshowselectyear');
       buttonyear.setAttribute('data-value', `${year}`);
       buttonyear.innerHTML = `${year}`;

       if (year == 1000) {
        buttonyear.innerHTML = "Avant" 
        }

        for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `dtrow+${results[i].id}`

            // format date
            var mydate = new Date(`${results[i].date}`);
            var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
             "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + mymonth + ' ' + mydate.getFullYear() 

            row.innerHTML = `<th scope="row" id="dtcol1+${results[i].id}" data-value="${results[i].date}">${formateddate}</th>
            <td id="dtcol2+${results[i].id}" data-value="${results[i].dentist}">${results[i].dentist}</td>
            <td id="dtcol3+${results[i].id}" data-value="${results[i].diagnostic}">${results[i].diagnostic}</td>   
            <td id="dtcol4+${results[i].id}">  
              <button class="btn btn-light" id="dtedit+${results[i].id}" title="Modifier" onclick=editdentistry(${results[i].id})>✍</button>
              <button class="btn btn-light" id="dydel+${results[i].id}" title="Supprimer" onclick=deletedentistry(${results[i].id})>❌</button>          
            </td>`

            bodyelement.append(row);
        }
    })
    .catch(error => console.log(error));
}


function editpedigree(id) {
    // id: horseid

    // change views
    document.getElementById('pedig').style.display = 'none';
    document.getElementById('editpedig').style.display = 'block';

    // select element
    element = document.getElementById('editpedig')

    // get actual values
    var asire = document.getElementById('shsire').getAttribute("data-value");
    var asiresire = document.getElementById('shsiresire').getAttribute("data-value");
    var asiredam = document.getElementById('shsiredam').getAttribute("data-value");
    var adam = document.getElementById('shdam').getAttribute("data-value");
    var adamsire = document.getElementById('shdamsire').getAttribute("data-value");
    var adamdam = document.getElementById('shdamdam').getAttribute("data-value");

    // prefill the form
    element.querySelector('#hsire').value = asire
    element.querySelector('#hsiresire').value = asiresire
    element.querySelector('#hsiredam').value = asiredam
    element.querySelector('#hdam').value = adam
    element.querySelector('#hdamsire').value = adamsire
    element.querySelector('#hdamdam').value = adamdam

    // event listener :
    element.querySelector('#edtpedi').onsubmit = function(e) {
        e.preventDefault();

        const sire = element.querySelector('#hsire').value;
        const siresire = element.querySelector('#hsiresire').value;
        const siredam = element.querySelector('#hsiredam').value;
        const dam = element.querySelector('#hdam').value;
        const damsire = element.querySelector('#hdamsire').value;
        const damdam = element.querySelector('#hdamdam').value;

        // warnings 
        if (sire.length > 80 || siresire.length > 80 || siredam.length > 80 || dam.length > 80 || damsire.length > 80 || damdam.length > 80 ) {
            element.querySelector('#edtwarningpedi').innerHTML = 'Les champs sont limités à 80 charactères.'
            document.getElementById("edtwarningpedi").focus({preventScroll:false})
        }

        else {
            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/editpedigree/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    sire : sire,
                    siresire : siresire,
                    siredam : siredam,
                    dam : dam,
                    damsire : damsire,
                    damdam : damdam,
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => response.json())
            .then(result => {

                document.getElementById('shsire').innerHTML = `&#9794 ${result.sire}`
                document.getElementById('shsiresire').innerHTML = `&#9794 ${result.siresire}`
                document.getElementById('shsiredam').innerHTML = `&#9792 ${result.siredam}`
                document.getElementById('shdam').innerHTML = `&#9792 ${result.dam}`
                document.getElementById('shdamsire').innerHTML = `&#9794 ${result.damsire}`
                document.getElementById('shdamdam').innerHTML = `&#9792 ${result.damdam}`

                document.getElementById('shsire').setAttribute('data-value', `${result.sire}`);
                document.getElementById('shsiresire').setAttribute('data-value', `${result.siresire}`);
                document.getElementById('shsiredam').setAttribute('data-value', `${result.siredam}`);
                document.getElementById('shdam').setAttribute('data-value', `${result.dam}`);
                document.getElementById('shdamsire').setAttribute('data-value', `${result.damsire}`);
                document.getElementById('shdamdam').setAttribute('data-value', `${result.damdam}`);

                // reset form and change views
                document.getElementById('edtpedi').reset()

                document.getElementById('pedig').style.display = 'block';
                document.getElementById('editpedig').style.display = 'none';

            })
            .catch(error => console.log(error));
        }
    }
}


function addosteo(id) {
    // id: horseid

    // change views
    document.getElementById('osteo').style.display = 'none';
    document.getElementById('osteoedit').style.display = 'none';
    document.getElementById('osteonew').style.display = 'block';

    // select element
    elementform = document.getElementById('osteonew');

    // submit event
    elementform.querySelector('#newos').onsubmit = function(e) {
        e.preventDefault();

        form = elementform.querySelector('#newos')

        //get form values
        formdata = new FormData(form)  
        
        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/osteopathy/${id}`, {
            method: 'POST',
            body:formdata,
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => {
            if (response.ok) {
                return response.json();
              } 
            else {
                document.getElementById('crwarningos').innerHTML = "Une erreur s'est produite. Veuillez vérifier les informations que vous avez saisies."
                document.getElementById("crwarningos").focus({preventScroll:false})
                throw new Error('Something went wrong');   
              }
        })
        .then(result => {

            // format date
            var mydate = new Date(`${result.date}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

            dateyear = mydate.getFullYear();
            elemtmp = document.getElementById('osteo');
            current_year = elemtmp.querySelector('#osshowselectyear').getAttribute('data-value');

            //get actual date
            get_year = document.getElementById('yeartoday')
            act_year = get_year.getAttribute('data-value')

            // avant case years limit
            ant_year = parseInt(act_year) - 4

            // change table if its the concerned year.
            if ( dateyear == current_year || dateyear == null) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `osrow+${result.id}`

                elementtbody = document.getElementById('bodyosteo')

                row.innerHTML = `<th scope="row" id="oscol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="oscol2+${result.id}" data-value="${result.osteo}">${result.osteo}</td>
                <td id="oscol3+${result.id}" data-value="${result.diagnostic}">${result.diagnostic}</td>
                <td id="oscol4+${result.id}" data-value="${result.reeducation}">${result.reeducation}</td>   
                <td id="oscol5+${result.id}">  
                  <button class="btn btn-light" id="osedit+${result.id}" title="Modifier" onclick=editosteo(${result.id})>✍</button>
                  <button class="btn btn-light" id="osdel+${result.id}" title="Supprimer" onclick=deleteosteo(${result.id})>❌</button>          
                </td>  `

                elementtbody.prepend(row)
            }

            else if ( current_year == 1000 && dateyear < ant_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `osrow+${result.id}`

                elementtbody = document.getElementById('bodyosteo')

                row.innerHTML = `<th scope="row" id="oscol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="oscol2+${result.id}" data-value="${result.osteo}">${result.osteo}</td>
                <td id="oscol3+${result.id}" data-value="${result.diagnostic}">${result.diagnostic}</td>
                <td id="oscol4+${result.id}" data-value="${result.reeducation}">${result.reeducation}</td>   
                <td id="oscol5+${result.id}">  
                  <button class="btn btn-light" id="osedit+${result.id}" title="Modifier" onclick=editosteo(${result.id})>✍</button>
                  <button class="btn btn-light" id="osdel+${result.id}" title="Supprimer" onclick=deleteosteo(${result.id})>❌</button>          
                </td>  `

                elementtbody.prepend(row)
            }

            // reset form and warnings an d change views
            document.getElementById('newos').reset();  
            document.getElementById('crwarningos').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"

            // change views
            document.getElementById('osteo').style.display = 'block';
            document.getElementById('osteoedit').style.display = 'none';
            document.getElementById('osteonew').style.display = 'none';

            document.getElementById("osteo").focus({preventScroll:false})
        })
        .catch(error => console.log(error));
    }
}


function deleteosteo(id) {
    // id : osteoid

    //delete the entry with a function
    fetch(`/osteopathy/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);
        
        // hide nicely with an animation and remove at the end of it:
        element = document.getElementById(`osrow+${id}`);
        element.style.animationPlayState = 'running';
        setTimeout(function (){
           element.remove()    
         }, 1000);
    })
    .catch(error => console.log(error));   
}


function editosteo(id) {
    // id : osteoid

    // change views
    document.getElementById('osteo').style.display = 'none';
    document.getElementById('osteoedit').style.display = 'block';
    document.getElementById('osteonew').style.display = 'none';

    // select element
    element = document.getElementById('osteoedit')

    //take actual values : 
    var actualdate = document.getElementById(`oscol1+${id}`).getAttribute("data-value"); 
    var actualosteo = document.getElementById(`oscol2+${id}`).getAttribute("data-value"); 
    var actualdiag = document.getElementById(`oscol3+${id}`).getAttribute("data-value"); 
    var actualreed = document.getElementById(`oscol4+${id}`).getAttribute("data-value"); 

    if ( !isNaN(Date.parse(actualdate)) ) {
        actualdate = new Date(actualdate).toISOString().substring(0, 10)
    }

    // prefill form
    element.querySelector('#os_o').value = actualosteo;
    element.querySelector('#os_d').value = actualdate;
    element.querySelector('#os_diag').value = actualdiag;
    element.querySelector('#os_reed').value = actualreed;

    // event listener
    element.querySelector('#edtos').onsubmit = function(e) {
        e.preventDefault();

        const newosteo = element.querySelector('#os_o').value;
        const newdate = element.querySelector('#os_d').value;
        const newdiag = element.querySelector('#os_diag').value;
        const newreed = element.querySelector('#os_reed').value;

        // warnings 
        if (newdate.length < 1 ) {
            element.querySelector('#edtwarningos').innerHTML = "La date n'est pas indiquée."    
            document.getElementById("edtwarningos").focus({preventScroll:false})
        }

        else if (newosteo.length < 1) {
            element.querySelector('#edtwarningos').innerHTML = "L'ostéopathe n'est pas indiqué. A défaut, remplissez 'Non spécifié'."
            document.getElementById("edtwarningos").focus({preventScroll:false})
        }

        else if (newosteo.length > 200) {
            element.querySelector('#edtwarningos').innerHTML = "La case de l'ostéopathe ne peut contenir que 200 charactères." 
            document.getElementById("edtwarningos").focus({preventScroll:false})
        }

        else if (newdiag.length > 2000) {
            element.querySelector('#edtwarningos').innerHTML = "La case du diagnostic ne peut contenir que 2000 charactères." 
            document.getElementById("edtwarningos").focus({preventScroll:false})
        }

        else if (newreed.length > 2000) {
            element.querySelector('#edtwarningos').innerHTML = "La case de la rééducation ne peut contenir que 2000 charactères." 
            document.getElementById("edtwarningos").focus({preventScroll:false})
        }

        else {

            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/editosteopathy/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    diagnostic : newdiag,
                    date : newdate,
                    osteo : newosteo,
                    reeducation : newreed,
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => {
                if (response.ok) {
                    return response.json();
                  } 
                else {
                    document.getElementById('edtwarningos').innerHTML = "Une erreur s'est produite. Vérifiez les informations que vous avez saisies."
                    document.getElementById("edtwarningos").focus({preventScroll:false})
                    throw new Error('Something went wrong');               
                  }
            })
            .then(result => {

                // format date
                var myedtdate = new Date(`${result.date}`);
                var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myedtdate.getMonth()];
                var formateddate = myedtdate.getDate() + ' ' + mymonth + ' ' + myedtdate.getFullYear();
                
                // year of the entry
                dateyear = myedtdate.getFullYear()

                // year showed 
                elemtmp = document.getElementById('osteo');
                current_year = elemtmp.querySelector('#osshowselectyear').getAttribute('data-value');

                //get actual date
                get_year = document.getElementById('yeartoday')
                act_year = get_year.getAttribute('data-value')

                // avant case year limits
                ant_year = parseInt(act_year) - 4

                // change table if its the concerned year (and also if the date can't be found somehow.)
                if ( dateyear == current_year || dateyear == null) {
                    // change div to actualize 
                    document.getElementById(`oscol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`oscol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`oscol2+${id}`).innerHTML = `${result.osteo}`;
                    document.getElementById(`oscol2+${id}`).setAttribute('data-value', `${result.osteo}`);
                    document.getElementById(`oscol3+${id}`).innerHTML = `${result.diagnostic}`;
                    document.getElementById(`oscol3+${id}`).setAttribute('data-value', `${result.diagnostic}`);
                    document.getElementById(`oscol4+${id}`).innerHTML = `${result.reeducation}`;
                    document.getElementById(`oscol4+${id}`).setAttribute('data-value', `${result.reeducation}`);
                }

                // change table if its the concerned avant categ
                else if ( current_year == 1000 && dateyear < ant_year) {    
                    // change div to actualize 
                    document.getElementById(`oscol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`oscol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`oscol2+${id}`).innerHTML = `${result.osteo}`;
                    document.getElementById(`oscol2+${id}`).setAttribute('data-value', `${result.osteo}`);
                    document.getElementById(`oscol3+${id}`).innerHTML = `${result.diagnostic}`;
                    document.getElementById(`oscol3+${id}`).setAttribute('data-value', `${result.diagnostic}`);
                    document.getElementById(`oscol4+${id}`).innerHTML = `${result.reeducation}`;
                    document.getElementById(`oscol4+${id}`).setAttribute('data-value', `${result.reeducation}`);
                    
                }

                // if we change years in edit, don't show it if it changes categs showed.
                else {
                    //delete view of the row.
                    rowtodel = document.getElementById(`osrow+${id}`);
                    rowtodel.remove()
                }

                // reset form and warnings
                document.getElementById('edtos').reset();
                document.getElementById('edtwarningos').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"
                
                // change views
                document.getElementById('osteo').style.display = 'block';
                document.getElementById('osteoedit').style.display = 'none';
                document.getElementById('osteonew').style.display = 'none';

                document.getElementById("osteo").focus({preventScroll:false})

            })
            .catch(error => console.log(error));
        }
    }
}


function osteoyearview(year) {

    // get user.id and select body of the dates table.
    var id = document.getElementById(`infos`).getAttribute("data-value"); 
    bodyelement = document.getElementById('bodyosteo');

    // erase previous rows.
    bodyelement.innerHTML = ''

    // get context
    var context = "osteopathy"

    //charge the year entries with fetch
    fetch(`/yearview/${id}/${year}/${context}`)
    .then(response => response.json())
    .then(results => { 
        console.log("Success")

        // change year button   
       buttonyear = document.getElementById('osshowselectyear');
       buttonyear.setAttribute('data-value', `${year}`);
       buttonyear.innerHTML = `${year}`;

       if (year == 1000) {
        buttonyear.innerHTML = "Avant" 
        }

        for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `osrow+${results[i].id}`

            // format date
            var mydate = new Date(`${results[i].date}`);
            var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
             "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + mymonth + ' ' + mydate.getFullYear() 

            row.innerHTML = `<th scope="row" id="oscol1+${results[i].id}" data-value="${results[i].date}">${formateddate}</th>
            <td id="oscol2+${results[i].id}" data-value="${results[i].osteo}">${results[i].osteo}</td>
            <td id="oscol3+${results[i].id}" data-value="${results[i].diagnostic}">${results[i].diagnostic}</td>
            <td id="oscol4+${results[i].id}" data-value="${results[i].reeducation}">${results[i].reeducation}</td>   
            <td id="oscol5+${results[i].id}">  
              <button class="btn btn-light" id="osedit+${results[i].id}" title="Modifier" onclick=editosteo(${results[i].id})>✍</button>
              <button class="btn btn-light" id="osdel+${results[i].id}" title="Supprimer" onclick=deleteosteo(${results[i].id})>❌</button>          
            </td>  `

            bodyelement.append(row);
        }
    })
    .catch(error => console.log(error));
}


function addcontest(id) {
    // id : horseid

    // change views
    document.getElementById('concours').style.display = 'none';
    document.getElementById('concoursedit').style.display = 'none';
    document.getElementById('concoursnew').style.display = 'block';

    // select element
    elementform = document.getElementById('concoursnew')

    // submit event
    elementform.querySelector('#newcc').onsubmit = function(e) {
        e.preventDefault();

        form = elementform.querySelector('#newcc')

        //get form values
        formdata = new FormData(form)  
        
        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/contest/${id}`, {
            method: 'POST',
            body:formdata,
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => {
            if (response.ok) {
                return response.json();
              } 
            else {
                document.getElementById('crwarningcc').innerHTML = "Une erreur s'est produite. Veuillez vérifier les informations que vous avez saisies."
                document.getElementById("crwarningcc").focus({preventScroll:false})
                throw new Error('Something went wrong');   
              }
        })
        .then(result => {

            // format date
            var mydate = new Date(`${result.date}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

            dateyear = mydate.getFullYear();
            elemtmp = document.getElementById('concours');
            current_year = elemtmp.querySelector('#ccshowselectyear').getAttribute('data-value');

            //get actual date
            get_year = document.getElementById('yeartoday')
            act_year = get_year.getAttribute('data-value')

            // avant/après cases years limits
            fut_year = parseInt(act_year) + 2
            ant_year = parseInt(act_year) - 2

            // change table if its the concerned year.
            if ( dateyear == current_year || dateyear == null) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `ccrow+${result.id}`

                elementtbody = document.getElementById('bodycontest')

                row.innerHTML = `<th scope="row" id="cccol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="cccol2+${result.id}" data-value="${result.discipline}">${result.discipline}</td>
                <td id="cccol3+${result.id}" data-value="${result.division}">${result.division}</td>   
                <td id="cccol4+${result.id}" data-value="${result.rider}">${result.rider}</td>   
                <td id="cccol5+${result.id}" data-value="${result.place}">${result.place}</td> 
                <td id="cccol6+${result.id}" data-value="${result.result}">${result.result}</td>  
                <td id="cccol7+${result.id}">
                  <button class="btn btn-light" id="ccedit+${result.id}" title="Modifier" onclick=editcontest(${result.id})>✍</button>
                  <button class="btn btn-light" id="ccdel+${result.id}" title="Supprimer" onclick=deletecontest(${result.id})>❌</button>
                </td> `

                elementtbody.prepend(row)
            }

            else if ( current_year == 1111  && dateyear > fut_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `ccrow+${result.id}`

                elementtbody = document.getElementById('bodycontest')

                row.innerHTML = `<th scope="row" id="cccol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="cccol2+${result.id}" data-value="${result.discipline}">${result.discipline}</td>
                <td id="cccol3+${result.id}" data-value="${result.division}">${result.division}</td>   
                <td id="cccol4+${result.id}" data-value="${result.rider}">${result.rider}</td>   
                <td id="cccol5+${result.id}" data-value="${result.place}">${result.place}</td> 
                <td id="cccol6+${result.id}" data-value="${result.result}">${result.result}</td>  
                <td id="cccol7+${result.id}">
                  <button class="btn btn-light" id="ccedit+${result.id}" title="Modifier" onclick=editcontest(${result.id})>✍</button>
                  <button class="btn btn-light" id="ccdel+${result.id}" title="Supprimer" onclick=deletecontest(${result.id})>❌</button>
                </td> `

                elementtbody.prepend(row)

            }

            else if ( current_year == 1001 && dateyear < ant_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `ccrow+${result.id}`

                elementtbody = document.getElementById('bodycontest')

                row.innerHTML = `<th scope="row" id="cccol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="cccol2+${result.id}" data-value="${result.discipline}">${result.discipline}</td>
                <td id="cccol3+${result.id}" data-value="${result.division}">${result.division}</td>   
                <td id="cccol4+${result.id}" data-value="${result.rider}">${result.rider}</td>   
                <td id="cccol5+${result.id}" data-value="${result.place}">${result.place}</td> 
                <td id="cccol6+${result.id}" data-value="${result.result}">${result.result}</td>  
                <td id="cccol7+${result.id}">
                  <button class="btn btn-light" id="ccedit+${result.id}" title="Modifier" onclick=editcontest(${result.id})>✍</button>
                  <button class="btn btn-light" id="ccdel+${result.id}" title="Supprimer" onclick=deletecontest(${result.id})>❌</button>
                </td> `

                elementtbody.prepend(row)
            }

            // reset form and warnings and change views
            document.getElementById('newcc').reset();  
            document.getElementById('crwarningcc').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"

            document.getElementById('concours').style.display = 'block';
            document.getElementById('concoursedit').style.display = 'none';
            document.getElementById('concoursnew').style.display = 'none';

            document.getElementById("concours").focus({preventScroll:false})
        })
        .catch(error => console.log(error));
    }
}


function deletecontest(id) {
    //id : contest id

    //delete the form with a function
    fetch(`/contest/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);
        
        // hide nicely with an animation and remove at the end of it:
        element = document.getElementById(`ccrow+${id}`);
        element.style.animationPlayState = 'running';
        setTimeout(function (){
           element.remove()    
         }, 1000);
    })
    .catch(error => console.log(error));   
}
 

function editcontest(id) {
    //id contest id
    // change views
    document.getElementById('concours').style.display = 'none';
    document.getElementById('concoursedit').style.display = 'block';
    document.getElementById('concoursnew').style.display = 'none';

    // select element
    element = document.getElementById('concoursedit')

    // get actual values
    var actualdate = document.getElementById(`cccol1+${id}`).getAttribute("data-value"); 
    var actualdiscipline = document.getElementById(`cccol2+${id}`).getAttribute("data-value"); 
    var actualdivision = document.getElementById(`cccol3+${id}`).getAttribute("data-value"); 
    var actualrider = document.getElementById(`cccol4+${id}`).getAttribute("data-value"); 
    var actualplace = document.getElementById(`cccol5+${id}`).getAttribute("data-value"); 
    var actualresult = document.getElementById(`cccol6+${id}`).getAttribute("data-value"); 

    if ( !isNaN(Date.parse(actualdate)) ) {
        actualdate = new Date(actualdate).toISOString().substring(0, 10)
    }

    // prefill form
    element.querySelector('#cc_l').value = actualplace;
    element.querySelector('#cc_d').value = actualdate;
    element.querySelector('#cc_dp').value = actualdiscipline;
    element.querySelector('#cc_ep').value = actualdivision;
    element.querySelector('#cc_r').value = actualrider;
    element.querySelector('#cc_rst').value = actualresult;

    // event listener :
    element.querySelector('#edtcc').onsubmit = function(e) {
        e.preventDefault();

        // get new values
        const newplace = element.querySelector('#cc_l').value;
        const newdate = element.querySelector('#cc_d').value;
        const newdisci = element.querySelector('#cc_dp').value;
        const newdivi = element.querySelector('#cc_ep').value;
        const newrider = element.querySelector('#cc_r').value;
        const newresult = element.querySelector('#cc_rst').value;

        // warnings 
        if (newdate.length < 1 ) {
            element.querySelector('#edtwarningcc').innerHTML = "La date de rendez-vous n'est pas indiquée."
            document.getElementById("edtwarningcc").focus({preventScroll:false})    
        }

        else if (newplace.length < 1) {
            element.querySelector('#edtwarningcc').innerHTML = "Le lieu n'est pas indiqué. A défaut, remplissez 'Non spécifié'." 
            document.getElementById("edtwarningcc").focus({preventScroll:false})
        }

        else if (newplace.length > 80) {
            element.querySelector('#edtwarningcc').innerHTML = "La case du lieu ne peut contenir que 80 charactères." 
            document.getElementById("edtwarningcc").focus({preventScroll:false})
        }

        else if (newdisci.length > 10) {
            element.querySelector('#edtwarningcc').innerHTML = "La case de la discipline ne peut contenir que 10 charactères." 
            document.getElementById("edtwarningcc").focus({preventScroll:false})
        }

        else if (newdivi.length > 20) {
            element.querySelector('#edtwarningcc').innerHTML = "La case de la division ne peut contenir que 20 charactères." 
            document.getElementById("edtwarningcc").focus({preventScroll:false})
        }

        else if (newrider.length > 40) {
            element.querySelector('#edtwarningcc').innerHTML = "La case du cavalier ne peut contenir que 40 charactères." 
            document.getElementById("edtwarningcc").focus({preventScroll:false})
        }

        else if (newresult.length > 15) {
            element.querySelector('#edtwarningcc').innerHTML = "La case des résultats ne peut contenir que 15 charactères." 
            document.getElementById("edtwarningcc").focus({preventScroll:false})
        }

        else {

            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/editcontest/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    place : newplace,
                    date : newdate,
                    rider : newrider,
                    division : newdivi,
                    discipline : newdisci,
                    result : newresult
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => {
                if (response.ok) {
                    return response.json();
                  } 
                else {
                    document.getElementById('edtwarningcc').innerHTML = "Une erreur s'est produite. Vérifiez les informations que vous avez saisies."
                    document.getElementById("edtwarningcc").focus({preventScroll:false})
                    throw new Error('Something went wrong');               
                  }
            })
            .then(result => {

                // format date
                var myedtdate = new Date(`${result.date}`);
                var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myedtdate.getMonth()];
                var formateddate = myedtdate.getDate() + ' ' + mymonth + ' ' + myedtdate.getFullYear() 
                
                // year of the entry
                dateyear = myedtdate.getFullYear()

                // year showed 
                elemtmp = document.getElementById('concours');
                current_year = elemtmp.querySelector('#ccshowselectyear').getAttribute('data-value');

                //get actual date
                get_year = document.getElementById('yeartoday')
                act_year = get_year.getAttribute('data-value')

                // avant/après cases years limits
                fut_year = parseInt(act_year) + 2
                ant_year = parseInt(act_year) - 2

                // change table if its the concerned year (and also if the date can't be found somehow.)
                if ( current_year != 1111 && current_year != 1001 && dateyear == current_year || dateyear == null) {
                    // change div to actualize 
                    document.getElementById(`cccol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`cccol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`cccol2+${id}`).innerHTML = `${result.discipline}`;
                    document.getElementById(`cccol2+${id}`).setAttribute('data-value', `${result.discipline}`);
                    document.getElementById(`cccol3+${id}`).innerHTML = `${result.division}`;
                    document.getElementById(`cccol3+${id}`).setAttribute('data-value', `${result.division}`);
                    document.getElementById(`cccol4+${id}`).innerHTML = `${result.rider}`;
                    document.getElementById(`cccol4+${id}`).setAttribute('data-value', `${result.rider}`);
                    document.getElementById(`cccol5+${id}`).innerHTML = `${result.place}`;
                    document.getElementById(`cccol5+${id}`).setAttribute('data-value', `${result.place}`);
                    document.getElementById(`cccol6+${id}`).innerHTML = `${result.result}`;
                    document.getElementById(`cccol6+${id}`).setAttribute('data-value', `${result.result}`);
                }

                // change table if year is in the categorie "after" and if its date is past 2 years from now.
                else if ( current_year == 1111  && dateyear > fut_year) {
                    // change div to actualize 
                    document.getElementById(`cccol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`cccol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`cccol2+${id}`).innerHTML = `${result.discipline}`;
                    document.getElementById(`cccol2+${id}`).setAttribute('data-value', `${result.discipline}`);
                    document.getElementById(`cccol3+${id}`).innerHTML = `${result.division}`;
                    document.getElementById(`cccol3+${id}`).setAttribute('data-value', `${result.division}`);
                    document.getElementById(`cccol4+${id}`).innerHTML = `${result.rider}`;
                    document.getElementById(`cccol4+${id}`).setAttribute('data-value', `${result.rider}`);
                    document.getElementById(`cccol5+${id}`).innerHTML = `${result.place}`;
                    document.getElementById(`cccol5+${id}`).setAttribute('data-value', `${result.place}`);
                    document.getElementById(`cccol6+${id}`).innerHTML = `${result.result}`;
                    document.getElementById(`cccol6+${id}`).setAttribute('data-value', `${result.result}`);                    
                }

                // change table if year is in the categorie "avant" and if its date is before 2 years from now.
                else if ( current_year == 1001 && dateyear < ant_year) {
                    document.getElementById(`cccol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`cccol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`cccol2+${id}`).innerHTML = `${result.discipline}`;
                    document.getElementById(`cccol2+${id}`).setAttribute('data-value', `${result.discipline}`);
                    document.getElementById(`cccol3+${id}`).innerHTML = `${result.division}`;
                    document.getElementById(`cccol3+${id}`).setAttribute('data-value', `${result.division}`);
                    document.getElementById(`cccol4+${id}`).innerHTML = `${result.rider}`;
                    document.getElementById(`cccol4+${id}`).setAttribute('data-value', `${result.rider}`);
                    document.getElementById(`cccol5+${id}`).innerHTML = `${result.place}`;
                    document.getElementById(`cccol5+${id}`).setAttribute('data-value', `${result.place}`);
                    document.getElementById(`cccol6+${id}`).innerHTML = `${result.result}`;
                    document.getElementById(`cccol6+${id}`).setAttribute('data-value', `${result.result}`);
                }

                // if we change years in edit, don't show it if it changes categs showed.
                else {
                    //delete view of the row.
                    rowtodel = document.getElementById(`ccrow+${id}`);
                    rowtodel.remove()
                }

                // reset form and warnings
                document.getElementById('edtcc').reset();
                document.getElementById('edtwarningcc').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"

                // change views
                document.getElementById('concours').style.display = 'block';
                document.getElementById('concoursedit').style.display = 'none';
                document.getElementById('concoursnew').style.display = 'none';

                document.getElementById("concours").focus({preventScroll:false})
                
            })
            .catch(error => console.log(error));
        }
    }
}


function contestyearview(year) {

    // get user.id and select body of the dates table.
    var id = document.getElementById(`infos`).getAttribute("data-value"); 
    bodyelement = document.getElementById('bodycontest');

    // erase previous rows.
    bodyelement.innerHTML = ''

    // get context
    var context = "contest"

    //charge the year entries with fetch
    fetch(`/yearview/${id}/${year}/${context}`)
    .then(response => response.json())
    .then(results => { 
        console.log("Success")

        // change year button   
       buttonyear = document.getElementById('ccshowselectyear');
       buttonyear.setAttribute('data-value', `${year}`);
       buttonyear.innerHTML = `${year}`;

       if (year == 1001) {
           buttonyear.innerHTML = "Avant" 
       }

       else if (year == 1111) {
           buttonyear.innerHTML = "Après"     
       }

       for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `ccrow+${results[i].id}`

            // format date
            var mydate = new Date(`${results[i].date}`);
            var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + mymonth + ' ' + mydate.getFullYear() 

            row.innerHTML = `<th scope="row" id="cccol1+${results[i].id}" data-value="${results[i].date}">${formateddate}</th>
            <td id="cccol2+${results[i].id}" data-value="${results[i].discipline}">${results[i].discipline}</td>
            <td id="cccol3+${results[i].id}" data-value="${results[i].division}">${results[i].division}</td>   
            <td id="cccol4+${results[i].id}" data-value="${results[i].rider}">${results[i].rider}</td>   
            <td id="cccol5+${results[i].id}" data-value="${results[i].place}">${results[i].place}</td> 
            <td id="cccol6+${results[i].id}" data-value="${results[i].result}">${results[i].result}</td>  
            <td id="cccol7+${results[i].id}">
              <button class="btn btn-light" id="ccedit+${results[i].id}" title="Modifier" onclick=editcontest(${results[i].id})>✍</button>
              <button class="btn btn-light" id="ccdel+${results[i].id}" title="Supprimer" onclick=deletecontest(${results[i].id})>❌</button>
            </td>`

            bodyelement.append(row);
        }
    })
    .catch(error => console.log(error));
}


function addincident(id) {
    // id : horse id

    // change views
    document.getElementById('incidents').style.display = 'none';
    document.getElementById('incidentsedit').style.display = 'none';  
    document.getElementById('newincident').style.display = 'block'; 

    // select element
    elementform = document.getElementById('newincident')

    // submit event
    // submit event
    elementform.querySelector('#newinc').onsubmit = function(e) {
        e.preventDefault();

        form = elementform.querySelector('#newinc')

        //get form values
        formdata = new FormData(form)  
        
        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/incident/${id}`, {
            method: 'POST',
            body:formdata,
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => {
            if (response.ok) {
                return response.json();
              } 
            else {
                document.getElementById('crwarninginc').innerHTML = "Une erreur s'est produite. Veuillez vérifier les informations que vous avez saisies, ou réessayez plus tard."
                document.getElementById("crwarninginc").focus({preventScroll:false})
                throw new Error('Something went wrong');   
              }
        })
        .then(result => {

            console.log(result)
            // format date
            var mydate = new Date(`${result.date}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

            dateyear = mydate.getFullYear();
            elemtmp = document.getElementById('incidents');
            current_year = elemtmp.querySelector('#incshowselectyear').getAttribute('data-value');

            //get actual date
            get_year = document.getElementById('yeartoday')
            act_year = get_year.getAttribute('data-value')

            // avant case years limit
            ant_year = parseInt(act_year) - 4

            // change table if its the concerned year.
            if ( dateyear == current_year || dateyear == null) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.id = `incrow+${result.id}`
                row.className = 'anime'                

                elementtbody = document.getElementById('bodyinc')

                row.innerHTML = `<th scope="row" id="inccol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="inccol2+${result.id}" data-value="${result.reason}">${result.reason}</td>
                <td id="inccol3+${result.id}" data-value="${result.diagnostic}">${result.diagnostic}</td>   
                <td id="inccol4+${result.id}"> 
                  <button class="btn btn-light" id="invview+${result.id}" title="Voir en détail" data-bs-toggle="modal" data-bs-target="#IncModal${result.id}">📖</button>
                  <button class="btn btn-light" id="incedit+${result.id}" title="Modifier" onclick=editincident(${result.id})>✍</button>
                  <button class="btn btn-light" id="incdel+${result.id}" title="Supprimer" onclick=deleteincident(${result.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)
            }

            else if ( current_year == 1000 && dateyear < ant_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `incrow+${result.id}`

                elementtbody = document.getElementById('bodyinc')

                row.innerHTML = `<th scope="row" id="inccol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="inccol2+${result.id}" data-value="${result.reason}">${result.reason}</td>
                <td id="inccol3+${result.id}" data-value="${result.diagnostic}">${result.diagnostic}</td>   
                <td id="inccol4+${result.id}"> 
                  <button class="btn btn-light" id="invview+${result.id}" title="Voir en détail" data-bs-toggle="modal" data-bs-target="#IncModal${result.id}">📖</button>
                  <button class="btn btn-light" id="incedit+${result.id}" title="Modifier" onclick=editincident(${result.id})>✍</button>
                  <button class="btn btn-light" id="incdel+${result.id}" title="Supprimer" onclick=deleteincident(${result.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)
            }

            // create modal
            const mod = document.createElement('div')
            mod.className = "modal fade"
            mod.id = `IncModal${result.id}`
            mod.setAttribute('data-bs-backdrop', 'static');
            mod.setAttribute('data-bs-keyboard', 'false');           
            mod.setAttribute('tabindex', '-1');
            mod.setAttribute('aria-labelledby', `LabelInc${result.id}`); 
            mod.setAttribute('aria-hidden', 'true'); 

            mod.innerHTML = `<div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="LabelInc${result.id}">Rapport d'incident du ${formateddate}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div> Motif initial : <p id="IncMreason+${result.id}">${result.reason}</p></div>
                <br>
                <div> Vétérinaire et/ou autres intervenants : <p id="IncMvet+${result.id}" data-value="${result.vet}"> ${result.vet} </p></div>
                <br>
                <div> Diagnostic : <p id="IncMdiag+${result.id}"> ${result.diagnostic} </p></div>
                <br>
                <div> Prescription : <p id="IncMpre+${result.id}" data-value="${result.prescription}"> ${result.prescription} </p></div>
                <br>
                <div> Notes : <p id="IncMn+${result.id}" data-value="${result.notes}"> ${result.notes} </p></div>
                <br>
    
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick=editincident(${result.id})>Editer</button>
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fermer</button> 
            </div>
            </div>
            </div>`

            elementglobal = document.getElementById('incidents')
            elementglobal.append(mod)

            // reset form and warnings an d change views
            document.getElementById('newinc').reset();  
            document.getElementById('crwarninginc').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"

            document.getElementById('incidents').style.display = 'block';
            document.getElementById('incidentsedit').style.display = 'none';  
            document.getElementById('newincident').style.display = 'none'; 

            document.getElementById("incidents").focus({preventScroll:false})
        })
        .catch(error => console.log(error));
    }
}


function deleteincident(id) {
    // id : incident id

    //delete the form with a function
    fetch(`/incident/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);
        // remove modal
        elementmodal = document.getElementById(`IncModal${id}`);
        elementmodal.remove()

        // hide nicely with an animation and remove at the end of it:
        element = document.getElementById(`incrow+${id}`);
        element.style.animationPlayState = 'running';
        setTimeout(function (){
           element.remove()    
         }, 1000);
    })
    .catch(error => console.log(error)); 
}


function editincident(id) {
    // id! incident id
    // change views
    document.getElementById('incidents').style.display = 'none';
    document.getElementById('incidentsedit').style.display = 'block';  
    document.getElementById('newincident').style.display = 'none'; 

    // select element
    element = document.getElementById('incidentsedit')

    //take actual values : 
    var actualdate = document.getElementById(`inccol1+${id}`).getAttribute("data-value"); 
    var actualreason = document.getElementById(`inccol2+${id}`).getAttribute("data-value"); 
    var actualdiag = document.getElementById(`inccol3+${id}`).getAttribute("data-value"); 
    var actualnotes = document.getElementById(`IncMn+${id}`).getAttribute("data-value");
    var actualpresc = document.getElementById(`IncMpre+${id}`).getAttribute("data-value");
    var actualvet = document.getElementById(`IncMvet+${id}`).getAttribute("data-value");

    if ( !isNaN(Date.parse(actualdate)) ) {
        actualdate = new Date(actualdate).toISOString().substring(0, 10)
    }

    // prefill form
    element.querySelector('#inc_d').value = actualdate;
    element.querySelector('#inc_mo').value = actualreason;
    element.querySelector('#inc_v').value = actualvet;
    element.querySelector('#inc_diag').value = actualdiag;
    element.querySelector('#inc_pre').value = actualpresc;
    element.querySelector('#inc_n').value = actualnotes;

    // event listener 
    element.querySelector('#edtinc').onsubmit = function(e) {
        e.preventDefault();
        
        // get new values
        const newdate = element.querySelector('#inc_d').value;
        const newreason = element.querySelector('#inc_mo').value;
        const newvet = element.querySelector('#inc_v').value;
        const newdiag = element.querySelector('#inc_diag').value;
        const newpresc = element.querySelector('#inc_pre').value;
        const newnotes = element.querySelector('#inc_n').value;

        // warnings
        if (newdate.length < 1 ) {
            element.querySelector('#edtwarninginc').innerHTML = "La date n'est pas indiquée." 
            document.getElementById("edtwarninginc").focus({preventScroll:false})   
        }

        else if (newreason.length < 1) {
            element.querySelector('#edtwarninginc').innerHTML = "Le motif de l'incident n'est pas indiqué. A défaut, remplissez 'Non spécifié'."
            document.getElementById("edtwarninginc").focus({preventScroll:false})
        }

        else if (newreason.length > 50) {
            element.querySelector('#edtwarninginc').innerHTML = "La case du motif ne peut contenir que 50 charactères."
            document.getElementById("edtwarninginc").focus({preventScroll:false})
        }

        else if (newvet.length < 1) {
            element.querySelector('#edtwarninginc').innerHTML = "Le vétérinaire n'est pas indiqué. A défaut, remplissez 'Non spécifié'."
            document.getElementById("edtwarninginc").focus({preventScroll:false})
        }

        else if (newvet.length > 150) {
            element.querySelector('#edtwarninginc').innerHTML = "La case du vétérinaire ne peut contenir que 150 charactères."
            document.getElementById("edtwarninginc").focus({preventScroll:false})
        }

        else if (newdiag.length > 1000) {
            element.querySelector('#edtwarninginc').innerHTML = "La case du diagnostic ne peut contenir que 1000 charactères."
            document.getElementById("edtwarninginc").focus({preventScroll:false})
        }

        else if (newpresc.length > 2000) {
            element.querySelector('#edtwarninginc').innerHTML = "La case de la prescription ne peut contenir que 2000 charactères."
            document.getElementById("edtwarninginc").focus({preventScroll:false})
        }

        else if (newnotes.length > 3000) {
            element.querySelector('#edtwarninginc').innerHTML = "La case des notes ne peut contenir que 3000 charactères."
            document.getElementById("edtwarninginc").focus({preventScroll:false})
        }

        else {

            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/editincident/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    diagnostic : newdiag,
                    date : newdate,
                    notes : newnotes,
                    prescription : newpresc,
                    vet : newvet,
                    reason : newreason,
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => {
                if (response.ok) {
                    return response.json();
                  } 
                else {
                    document.getElementById('edtwarninginc').innerHTML = "Une erreur s'est produite. Vérifiez les informations que vous avez saisies."
                    document.getElementById("edtwarninginc").focus({preventScroll:false})
                    throw new Error('Something went wrong');               
                  }
            })
            .then(result => {

                // format date
                var myedtdate = new Date(`${result.date}`);
                var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myedtdate.getMonth()];
                var formateddate = myedtdate.getDate() + ' ' + mymonth + ' ' + myedtdate.getFullYear();
                
                // year of the entry
                dateyear = myedtdate.getFullYear()

                // year showed 
                elemtmp = document.getElementById('incidents');
                current_year = elemtmp.querySelector('#incshowselectyear').getAttribute('data-value');

                //get actual date
                get_year = document.getElementById('yeartoday')
                act_year = get_year.getAttribute('data-value')

                // avant case year limits
                ant_year = parseInt(act_year) - 4

                // edit modal :
                document.getElementById(`LabelInc${id}`).innerHTML = `Rapport d'incident du ${formateddate}`;
                document.getElementById(`IncMreason+${id}`).innerHTML = `${result.reason}`;
                document.getElementById(`IncMvet+${id}`).innerHTML = `${result.vet}`;
                document.getElementById(`IncMvet+${id}`).setAttribute('data-value', `${result.vet}`);
                document.getElementById(`IncMdiag+${id}`).innerHTML = `${result.diagnostic}`;
                document.getElementById(`IncMpre+${id}`).innerHTML = `${result.prescription}`;
                document.getElementById(`IncMpre+${id}`).setAttribute('data-value', `${result.prescription}`);
                document.getElementById(`IncMn+${id}`).innerHTML = `${result.notes}`;
                document.getElementById(`IncMn+${id}`).setAttribute('data-value', `${result.notes}`);

                // change table if its the concerned year (and also if the date can't be found somehow.)
                if ( dateyear == current_year || dateyear == null) {
                    // change div to actualize 
                    document.getElementById(`inccol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`inccol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`inccol2+${id}`).innerHTML = `${result.reason}`;
                    document.getElementById(`inccol2+${id}`).setAttribute('data-value', `${result.reason}`);
                    document.getElementById(`inccol3+${id}`).innerHTML = `${result.diagnostic}`;
                    document.getElementById(`inccol3+${id}`).setAttribute('data-value', `${result.diagnostic}`);
                }

                // change table if its the concerned avant categ
                else if ( current_year == 1000 && dateyear < ant_year) {     
                    // change div to actualize 
                    document.getElementById(`inccol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`inccol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`inccol2+${id}`).innerHTML = `${result.reason}`;
                    document.getElementById(`inccol2+${id}`).setAttribute('data-value', `${result.reason}`);
                    document.getElementById(`inccol3+${id}`).innerHTML = `${result.diagnostic}`;
                    document.getElementById(`inccol3+${id}`).setAttribute('data-value', `${result.diagnostic}`);
                }

                // if we change years in edit, don't show it if it changes categs showed.
                else {
                    //delete view of the row.
                    rowtodel = document.getElementById(`incrow+${id}`);
                    rowtodel.remove()
                }

                // reset form and warnings
                document.getElementById('edtinc').reset();
                document.getElementById('edtwarninginc').innerHTML = "<p style='color:black'>Les champs marqués d'un * doivent être renseignés.</p>"

                // change views
                document.getElementById('incidents').style.display = 'block';
                document.getElementById('incidentsedit').style.display = 'none';  
                document.getElementById('newincident').style.display = 'none';

                document.getElementById("incidents").focus({preventScroll:false})
            })
            .catch(error => console.log(error));
        }
    }
}


function incyearview(year) {
    // get user.id and select body of the dates table.
    var id = document.getElementById(`infos`).getAttribute("data-value"); 
    bodyelement = document.getElementById('bodyinc');

    // erase previous rows.
    bodyelement.innerHTML = ''

    // get context
    var context = "incident"

    //charge the year entries with fetch
    fetch(`/yearview/${id}/${year}/${context}`)
    .then(response => response.json())
    .then(results => { 
        console.log("Success")

        // change year button   
        buttonyear = document.getElementById('incshowselectyear');
        buttonyear.setAttribute('data-value', `${year}`);
        buttonyear.innerHTML = `${year}`;

        if (year == 1000) {
            buttonyear.innerHTML = "Avant" 
        }

        for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `incrow+${results[i].id}`

            // format date
            var mydate = new Date(`${results[i].date}`);
            var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + mymonth + ' ' + mydate.getFullYear() 

            row.innerHTML = `<th scope="row" id="inccol1+${results[i].id}" data-value="${results[i].date}">${formateddate}</th>
            <td id="inccol2+${results[i].id}" data-value="${results[i].reason}">${results[i].reason}</td>
            <td id="inccol3+${results[i].id}" data-value="${results[i].diagnostic}">${results[i].diagnostic}</td>   
            <td id="inccol4+${results[i].id}"> 
              <button class="btn btn-light" id="invview+${results[i].id}" title="Voir en détail" data-bs-toggle="modal" data-bs-target="#IncModal${results[i].id}">📖</button>
              <button class="btn btn-light" id="incedit+${results[i].id}" title="Modifier" onclick=editincident(${results[i].id})>✍</button>
              <button class="btn btn-light" id="incdel+${results[i].id}" title="Supprimer" onclick=deleteincident(${results[i].id})>❌</button>          
            </td>`

            bodyelement.append(row);

            // create modal
            const mod = document.createElement('div')
            mod.className = "modal fade"
            mod.id = `IncModal${results[i].id}`
            mod.setAttribute('data-bs-backdrop', 'static');
            mod.setAttribute('data-bs-keyboard', 'false');           
            mod.setAttribute('tabindex', '-1');
            mod.setAttribute('aria-labelledby', `LabelInc${results[i].id}`); 
            mod.setAttribute('aria-hidden', 'true'); 

            mod.innerHTML = `<div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="LabelInc${results[i].id}">Rapport d'incident du ${formateddate}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div> Motif initial : <p id="IncMreason+${results[i].id}">${results[i].reason}</p></div>
                <br>
                <div> Vétérinaire et/ou autres intervenants : <p id="IncMvet+${results[i].id}" data-value="${results[i].vet}"> ${results[i].vet} </p></div>
                <br>
                <div> Diagnostic : <p id="IncMdiag+${results[i].id}"> ${results[i].diagnostic} </p></div>
                <br>
                <div> Prescription : <p id="IncMpre+${results[i].id}" data-value="${results[i].prescription}"> ${results[i].prescription} </p></div>
                <br>
                <div> Notes : <p id="IncMn+${results[i].id}" data-value="${results[i].notes}"> ${results[i].notes} </p></div>
                <br>
    
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick=editincident(${results[i].id})>Editer</button>
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fermer</button> 
            </div>
            </div>
            </div>`

            elementglobal = document.getElementById('incidents')
            elementglobal.append(mod)
        }
    })
    .catch(error => console.log(error));
}

// MARES

function addbredm(id) {
    //id : horse id

    // change views
    document.getElementById('breeds').style.display = 'none';
    document.getElementById('breedsedit').style.display = 'none';
    document.getElementById('breedsnew').style.display = 'block'; 
    document.getElementById('gestations').style.display = 'none';
    document.getElementById('gestationsedit').style.display = 'none';
    document.getElementById('gestationsnew').style.display = 'none';
    document.getElementById('heats').style.display = 'none';
    document.getElementById('heatsedit').style.display = 'none';
    document.getElementById('heatsnew').style.display = 'none';

    // select element
    elementform = document.getElementById('breedsnew')

    // submit event
    elementform.querySelector('#newbd').onsubmit = function(e) {
        e.preventDefault();

        form = elementform.querySelector('#newbd')

        //get form values
        formdata = new FormData(form)  
        
        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/bred/${id}`, {
            method: 'POST',
            body:formdata,
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => {
            if (response.ok) {
                return response.json();
              } 
            else {
                document.getElementById('crwarningbd').innerHTML = "Une erreur s'est produite. Veuillez vérifier les informations que vous avez saisies."
                document.getElementById("crwarningbd").focus({preventScroll:false})  
                throw new Error('Something went wrong');   
              }
        })
        .then(result => {

            // format date
            var mydate = new Date(`${result.date}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

            dateyear = mydate.getFullYear();
            elemtmp = document.getElementById('breeds');
            current_year = elemtmp.querySelector('#bdshowselectyear').getAttribute('data-value');

            //get actual date
            get_year = document.getElementById('yeartoday')
            act_year = get_year.getAttribute('data-value')

            // avant/après cases years limits
            fut_year = parseInt(act_year) + 2
            ant_year = parseInt(act_year) - 2

             // change table if its the concerned year.
             if ( dateyear == current_year || dateyear == null) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `bdrow+${result.id}`

                elementtbody = document.getElementById('bodybred')

                row.innerHTML = `<th scope="row" id="bdcol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="bdcol2+${result.id}" data-value="${result.stallion}">${result.stallion}</td>
                <td id="bdcol3+${result.id}" data-value="${result.notes}">${result.notes}</td>   
                <td id="bdcol4+${result.id}">  
                  <button class="btn btn-light" id="bdedit+${result.id}" title="Modifier" onclick=editbredm(${result.id})>✍</button>
                  <button class="btn btn-light" id="bddel+${result.id}" title="Supprimer" onclick=deletebredm(${result.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)
            }

            else if ( current_year == 1111  && dateyear > fut_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `bdrow+${result.id}`

                elementtbody = document.getElementById('bodybred')

                row.innerHTML = `<th scope="row" id="bdcol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="bdcol2+${result.id}" data-value="${result.stallion}">${result.stallion}</td>
                <td id="bdcol3+${result.id}" data-value="${result.notes}">${result.notes}</td>   
                <td id="bdcol4+${result.id}">  
                  <button class="btn btn-light" id="bdedit+${result.id}" title="Modifier" onclick=editbredm(${result.id})>✍</button>
                  <button class="btn btn-light" id="bddel+${result.id}" title="Supprimer" onclick=deletebredm(${result.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)
            }

            else if ( current_year == 1001 && dateyear < ant_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `bdrow+${result.id}`

                elementtbody = document.getElementById('bodybred')

                row.innerHTML = `<th scope="row" id="bdcol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="bdcol2+${result.id}" data-value="${result.stallion}">${result.stallion}</td>
                <td id="bdcol3+${result.id}" data-value="${result.notes}">${result.notes}</td>   
                <td id="bdcol4+${result.id}">  
                  <button class="btn btn-light" id="bdedit+${result.id}" title="Modifier" onclick=editbredm(${result.id})>✍</button>
                  <button class="btn btn-light" id="bddel+${result.id}" title="Supprimer" onclick=deletebredm(${result.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)
            }

            // reset form and warnings and change views
            document.getElementById('newbd').reset();  
            document.getElementById('crwarningbd').innerHTML = ' '

            document.getElementById('breeds').style.display = 'block';
            document.getElementById('breedsedit').style.display = 'none';
            document.getElementById('breedsnew').style.display = 'none'; 
            document.getElementById('gestations').style.display = 'block';
            document.getElementById('gestationsedit').style.display = 'none';
            document.getElementById('gestationsnew').style.display = 'none';
            document.getElementById('heats').style.display = 'block';
            document.getElementById('heatsedit').style.display = 'none';
            document.getElementById('heatsnew').style.display = 'none';

            document.getElementById("breeds").focus({preventScroll:false})

        })

    }
}


function deletebredm(id) {
    //id : bredid

    //delete the form with a function
    fetch(`/bred/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);
        
        // hide nicely with an animation and remove at the end of it:
        element = document.getElementById(`bdrow+${id}`);
        element.style.animationPlayState = 'running';
        setTimeout(function (){
           element.remove()    
         }, 1000);
    })
    .catch(error => console.log(error));  

}


function editbredm(id) {
    // id : bredid

    // change views
    document.getElementById('breeds').style.display = 'none';
    document.getElementById('breedsedit').style.display = 'block';
    document.getElementById('breedsnew').style.display = 'none'; 
    document.getElementById('gestations').style.display = 'none';
    document.getElementById('gestationsedit').style.display = 'none';
    document.getElementById('gestationsnew').style.display = 'none';
    document.getElementById('heats').style.display = 'none';
    document.getElementById('heatsedit').style.display = 'none';
    document.getElementById('heatsnew').style.display = 'none';

    // select element
    element = document.getElementById('breedsedit')

    // get actual values
    var actualdate = document.getElementById(`bdcol1+${id}`).getAttribute("data-value"); 
    var actualstallion = document.getElementById(`bdcol2+${id}`).getAttribute("data-value"); 
    var actualnotes = document.getElementById(`bdcol3+${id}`).getAttribute("data-value");

    // format date to html format
    if ( !isNaN(Date.parse(actualdate)) ) {
        actualdate = new Date(actualdate).toISOString().substring(0, 10)
    }

    // prefill form
    element.querySelector('#bd_s').value = actualstallion;
    element.querySelector('#bd_d').value = actualdate;
    element.querySelector('#bd_n').value = actualnotes;

    // event listener :
    element.querySelector('#edtbd').onsubmit = function(e) {
        e.preventDefault();

        // get new values
        const newd = element.querySelector('#bd_d').value;
        const newstallion = element.querySelector('#bd_s').value;
        const newn = element.querySelector('#bd_n').value;

        // warnings 
        if (newd.length < 1 ) {
            element.querySelector('#edtwarningbd').innerHTML = "La date de rendez-vous n'est pas indiquée."    
            document.getElementById("edtwarningbd").focus({preventScroll:false})
        }

        else if (newstallion.length < 1) {
            element.querySelector('#edtwarningbd').innerHTML = "L'étalon n'est pas indiqué. A défaut, remplissez 'Non spécifié'." 
            document.getElementById("edtwarningbd").focus({preventScroll:false})
        }

        else if (newstallion.length > 200) {
            element.querySelector('#edtwarningbd').innerHTML = "La case de l'étalon' ne peut contenir que 200 charactères." 
            document.getElementById("edtwarningbd").focus({preventScroll:false})
        }

        else if (newn.length > 1000) {
            element.querySelector('#edtwarningbd').innerHTML = "La case des notes ne peut contenir que 1000 charactères." 
            document.getElementById("edtwarningbd").focus({preventScroll:false})
        }

        else {

            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/editbred/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    stallion : newstallion,
                    date : newd,
                    notes : newn
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => {
                if (response.ok) {
                    return response.json();
                  } 
                else {
                    document.getElementById('edtwarningbd').innerHTML = "Une erreur s'est produite. Vérifiez les informations que vous avez saisies."
                    document.getElementById("edtwarningbd").focus({preventScroll:false})
                    throw new Error('Something went wrong');               
                  }
            })
            .then(result => {

                // format date
                var myedtdate = new Date(`${result.date}`);
                var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myedtdate.getMonth()];
                var formateddate = myedtdate.getDate() + ' ' + mymonth + ' ' + myedtdate.getFullYear() 
                
                // year of the entry
                dateyear = myedtdate.getFullYear()

                // year showed 
                elemtmp = document.getElementById('breeds');
                current_year = elemtmp.querySelector('#bdshowselectyear').getAttribute('data-value');

                //get actual date
                get_year = document.getElementById('yeartoday')
                act_year = get_year.getAttribute('data-value')

                // avant/après cases years limits
                fut_year = parseInt(act_year) + 2
                ant_year = parseInt(act_year) - 2

                // change table if its the concerned year (and also if the date can't be found somehow.)
                if ( current_year != 1111 && current_year != 1001 && dateyear == current_year || dateyear == null) {
                    // change div to actualize 
                    document.getElementById(`bdcol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`bdcol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`bdcol2+${id}`).innerHTML = `${result.stallion}`;
                    document.getElementById(`bdcol2+${id}`).setAttribute('data-value', `${result.stallion}`);
                    document.getElementById(`bdcol3+${id}`).innerHTML = `${result.notes}`;
                    document.getElementById(`bdcol3+${id}`).setAttribute('data-value', `${result.notes}`);     
                }

                // change table if year is in the categorie "after" and if its date is past 2 years from now.
                else if ( current_year == 1111  && dateyear > fut_year) {
                    // change div to actualize 
                    // change div to actualize 
                    document.getElementById(`bdcol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`bdcol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`bdcol2+${id}`).innerHTML = `${result.stallion}`;
                    document.getElementById(`bdcol2+${id}`).setAttribute('data-value', `${result.stallion}`);
                    document.getElementById(`bdcol3+${id}`).innerHTML = `${result.notes}`;
                    document.getElementById(`bdcol3+${id}`).setAttribute('data-value', `${result.notes}`);                
                }

                // change table if year is in the categorie "avant" and if its date is before 2 years from now.
                else if ( current_year == 1001 && dateyear < ant_year) {
                    // change div to actualize 
                    document.getElementById(`bdcol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`bdcol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`bdcol2+${id}`).innerHTML = `${result.stallion}`;
                    document.getElementById(`bdcol2+${id}`).setAttribute('data-value', `${result.stallion}`);
                    document.getElementById(`bdcol3+${id}`).innerHTML = `${result.notes}`;
                    document.getElementById(`bdcol3+${id}`).setAttribute('data-value', `${result.notes}`); 
                }

                // if we change years in edit, don't show it if it changes categs showed.
                else {
                    //delete view of the row.
                    rowtodel = document.getElementById(`bdrow+${id}`);
                    rowtodel.remove()
                }

                // reset form and warnings
                document.getElementById('edtbd').reset();
                document.getElementById('edtwarningbd').innerHTML = ' '

                // change views
                document.getElementById('breeds').style.display = 'block';
                document.getElementById('breedsedit').style.display = 'none';
                document.getElementById('breedsnew').style.display = 'none'; 
                document.getElementById('gestations').style.display = 'block';
                document.getElementById('gestationsedit').style.display = 'none';
                document.getElementById('gestationsnew').style.display = 'none';
                document.getElementById('heats').style.display = 'block';
                document.getElementById('heatsedit').style.display = 'none';
                document.getElementById('heatsnew').style.display = 'none';

                document.getElementById("breeds").focus({preventScroll:false})

            })
            .catch(error => console.log(error));
        }
    }
}


function bdyearview(year) {

    // get user.id and select body of the dates table.
    var id = document.getElementById(`infos`).getAttribute("data-value"); 
    bodyelement = document.getElementById('bodybred');

    // erase previous rows.
    bodyelement.innerHTML = ''

    // get context
    var context = "bred"

    //charge the year entries with fetch
    fetch(`/yearview/${id}/${year}/${context}`)
    .then(response => response.json())
    .then(results => {
        console.log("Success")

        // change year button   
       buttonyear = document.getElementById('bdshowselectyear');
       buttonyear.setAttribute('data-value', `${year}`);
       buttonyear.innerHTML = `${year}`;

       if (year == 1001) {
           buttonyear.innerHTML = "Avant" 
       }

       else if (year == 1111) {
           buttonyear.innerHTML = "Après"     
       }

       for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `bdrow+${results[i].id}`

            // format date
            var mydate = new Date(`${results[i].date}`);
            var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + mymonth + ' ' + mydate.getFullYear() 

            row.innerHTML = `<th scope="row" id="bdcol1+${results[i].id}" data-value="${results[i].date}">${formateddate}</th>
            <td id="bdcol2+${results[i].id}" data-value="${results[i].stallion}">${results[i].stallion}</td>
            <td id="bdcol3+${results[i].id}" data-value="${results[i].notes}">${results[i].notes}</td>   
            <td id="bdcol4+${results[i].id}">  
              <button class="btn btn-light" id="bdedit+${results[i].id}" title="Modifier" onclick=editbredm(${results[i].id})>✍</button>
              <button class="btn btn-light" id="bddel+${results[i].id}" title="Supprimer" onclick=deletebredm(${results[i].id})>❌</button>          
            </td>`

            bodyelement.append(row);
        }
    })
    .catch(error => console.log(error));
}


function addheat(id) {
    // id : horse id

    // change views
    document.getElementById('breeds').style.display = 'none';
    document.getElementById('breedsedit').style.display = 'none';
    document.getElementById('breedsnew').style.display = 'none'; 
    document.getElementById('gestations').style.display = 'none';
    document.getElementById('gestationsedit').style.display = 'none';
    document.getElementById('gestationsnew').style.display = 'none';
    document.getElementById('heats').style.display = 'none';
    document.getElementById('heatsedit').style.display = 'none';
    document.getElementById('heatsnew').style.display = 'block';

    // select form
    elementform = document.getElementById('heatsnew')

    // submit event
    elementform.querySelector('#newht').onsubmit = function(ev) {
        ev.preventDefault();

        form = elementform.querySelector('#newht')

        //get form values
        formdata = new FormData(form)  
        
        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/heat/${id}`, {
            method: 'POST',
            body:formdata,
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => {
            if (response.ok) {
                return response.json();
              } 
            else {
                document.getElementById('crwarninght').innerHTML = "Une erreur s'est produite. Vérifiez les informations que vous avez saisies. La date de fin des chaleurs doit être ultérieure à celle du début."
                document.getElementById("crwarninght").focus({preventScroll:false})
                throw new Error('Something went wrong');               
              }
        })
        .then(result => {

            // format date
            var mydate = new Date(`${result.datestart}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
             var formateddate1 = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();
            
            if (result.dateend != null ) 
            {
                var mydate2 = new Date(`${result.dateend}`);
                var month2 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate2.getMonth()];
                var formateddate2 = mydate2.getDate() + ' ' + month2 + ' ' + mydate2.getFullYear();
            }

            dateyear = mydate.getFullYear();
            elemtmp = document.getElementById('heats');
            current_year = elemtmp.querySelector('#htshowselectyear').getAttribute('data-value');

            //get actual date
            get_year = document.getElementById('yeartoday')
            act_year = get_year.getAttribute('data-value')
            fut_year = parseInt(act_year) + 2 

            // change div
            // change table if its the concerned year.
            if ( dateyear == current_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `htrow+${result.id}`
                
                // body of the main table
                elementtable = document.getElementById('bodyheat')
                
                if (result.dateend != null) {
                    // create new row
                    row.innerHTML = `<th scope="row" id="htcol1+${result.id}" data-value="${result.datestart}">${formateddate1}</th>
                    <td id="htcol2+${result.id}" data-value="${result.dateend}">${formateddate2}</td>
                    <td id="htcol3+${result.id}">  
                    <button class="btn btn-light" id="htedit+${result.id}" title="Modifier" onclick=editheat(${result.id})>✍</button>
                    <button class="btn btn-light" id="htdel+${result.id}" title="Supprimer" onclick=deleteheat(${result.id})>❌</button>          
                    </td>`
                }

                // diff views changing if the next date is null or not
                else if (result.dateend == null) {
                    row.innerHTML = `<th scope="row" id="htcol1+${result.id}" data-value="${result.datestart}">${formateddate1}</th>
                <td id="htcol2+${result.id}" data-value="${result.dateend}"></td>
                <td id="htcol3+${result.id}">  
                  <button class="btn btn-light" id="htedit+${result.id}" title="Modifier" onclick=editheat(${result.id})>✍</button>
                  <button class="btn btn-light" id="htdel+${result.id}" title="Supprimer" onclick=deleteheat(${result.id})>❌</button>          
                </td>`
                }
                
                // add row to table, first rank
                elementtable.prepend(row)
            }

            // change table if year is in the categorie "after" and if its date is past 2 years from now.
            else if ( current_year == 1111  && dateyear > fut_year) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `htrow+${result.id}`
                
                // body of the main table
                elementtable = document.getElementById('bodyheat')
                
                if (result.dateend != null) {
                    // create new row
                    row.innerHTML = `<th scope="row" id="htcol1+${result.id}" data-value="${result.datestart}">${formateddate1}</th>
                    <td id="htcol2+${result.id}" data-value="${result.dateend}">${formateddate2}</td>
                    <td id="htcol3+${result.id}">  
                    <button class="btn btn-light" id="htedit+${result.id}" title="Modifier" onclick=editheat(${result.id})>✍</button>
                    <button class="btn btn-light" id="htdel+${result.id}" title="Supprimer" onclick=deleteheat(${result.id})>❌</button>          
                    </td>`
                }

                // diff views changing if the next date is null or not
                else if (result.dateend == null) {
                    row.innerHTML = `<th scope="row" id="htcol1+${result.id}" data-value="${result.datestart}">${formateddate1}</th>
                <td id="htcol2+${result.id}" data-value="${result.dateend}"></td>
                <td id="htcol3+${result.id}">  
                  <button class="btn btn-light" id="htedit+${result.id}" title="Modifier" onclick=editheat(${result.id})>✍</button>
                  <button class="btn btn-light" id="htdel+${result.id}" title="Supprimer" onclick=deleteheat(${result.id})>❌</button>          
                </td>`
                }
                
                // add row to table, first rank
                elementtable.prepend(row)
            }

            // reset form and warnings
            document.getElementById('newht').reset();
            document.getElementById('crwarninght').innerHTML = ' '

            // change views
            document.getElementById('breeds').style.display = 'block';
            document.getElementById('breedsedit').style.display = 'none';
            document.getElementById('breedsnew').style.display = 'none'; 
            document.getElementById('gestations').style.display = 'block';
            document.getElementById('gestationsedit').style.display = 'none';
            document.getElementById('gestationsnew').style.display = 'none';
            document.getElementById('heats').style.display = 'block';
            document.getElementById('heatsedit').style.display = 'none';
            document.getElementById('heatsnew').style.display = 'none';

            document.getElementById("heats").focus({preventScroll:false})
        })
        .catch(error => console.log(error));
    }
}


function deleteheat(id) {
    // id : heat id

    //delete the form with a function
    fetch(`/heat/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);
        
        // hide nicely with an animation and remove at the end of it:
        element = document.getElementById(`htrow+${id}`);
        element.style.animationPlayState = 'running';
        setTimeout(function (){
           element.remove()    
         }, 1000);
    })
    .catch(error => console.log(error)); 

}


function editheat(id) {
    // id : heat id

    // change views
    document.getElementById('breeds').style.display = 'none';
    document.getElementById('breedsedit').style.display = 'none';
    document.getElementById('breedsnew').style.display = 'none'; 
    document.getElementById('gestations').style.display = 'none';
    document.getElementById('gestationsedit').style.display = 'none';
    document.getElementById('gestationsnew').style.display = 'none';
    document.getElementById('heats').style.display = 'none';
    document.getElementById('heatsedit').style.display = 'block';
    document.getElementById('heatsnew').style.display = 'none';
 
    // select form
    element = document.getElementById('heatsedit')

    //take actual values : 
    var actualdatestart = document.getElementById(`htcol1+${id}`).getAttribute("data-value"); 
    var actualdateend = document.getElementById(`htcol2+${id}`).getAttribute("data-value");

    // check for validity and format to html format
    if ( !isNaN(Date.parse(actualdatestart)) ) {
        actualdatestart = new Date(actualdatestart).toISOString().substring(0, 10)
    }
  
    if ( !isNaN(Date.parse(actualdateend)) ) {
        actualdateend = new Date(actualdateend).toISOString().substring(0, 10)
    }

    // prefill form
    element.querySelector('#ht_db').value = actualdatestart;
    element.querySelector('#ht_df').value = actualdateend;

    // event listener here: 
    element.querySelector('#edtht').onsubmit = function(e) {
        e.preventDefault();

        const newdatestart = element.querySelector('#ht_db').value;
        const newdateend = element.querySelector('#ht_df').value;

        var d1d = new Date(newdatestart)
        var d2d = new Date(newdateend)

        if (newdatestart.length < 1) {
            element.querySelector('#edtwarninght').innerHTML = "La date du début des chaleurs n'est pas indiquée."  
            document.getElementById("edtwarninght").focus({preventScroll:false})  
        }

        else if (d2d != null && d1d >= d2d) {
            element.querySelector('#edtwarninght').innerHTML = "Le rappel doit être ultérieur à la date de réalisation du vaccin."  
            document.getElementById("edtwarninght").focus({preventScroll:false})          
        }

        else {
            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch 
            fetch(`/editheat/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    datestart : newdatestart,
                    dateend : newdateend
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => {
                if (response.ok) {
                    return response.json();
                  } 
                else {
                    document.getElementById('edtwarninght').innerHTML = "Une erreur s'est produite. Vérifiez les informations que vous avez saisies."
                    document.getElementById("edtwarninght").focus({preventScroll:false})
                    throw new Error('Something went wrong');               
                  }
            })
            .then(result => {

                // format date
            var mydate = new Date(`${result.datestart}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate1 = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();
            
            var mydate2 = new Date(`${result.dateend}`);
            var month2 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
             "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate2.getMonth()];
            var formateddate2 = mydate2.getDate() + ' ' + month2 + ' ' + mydate2.getFullYear();
                
           

            dateyear = mydate.getFullYear();
            elemtmp = document.getElementById('heats');
            current_year = elemtmp.querySelector('#htshowselectyear').getAttribute('data-value');

            //get actual date
            get_year = document.getElementById('yeartoday')
            act_year = get_year.getAttribute('data-value')
            fut_year = parseInt(act_year) + 2 

            if (dateyear == current_year || dateyear == null) {

                // change div to actualize 
                document.getElementById(`htcol1+${id}`).innerHTML = `${formateddate1}`
                document.getElementById(`htcol1+${id}`).setAttribute('data-value', `${result.datestart}`);
                document.getElementById(`htcol2+${id}`).innerHTML = `${formateddate2}`
                document.getElementById(`htcol2+${id}`).setAttribute('data-value', `${result.dateend}`);

                if (result.dateend == null) {
                    document.getElementById(`htcol2+${id}`).innerHTML = ' '
                }
            }

            // case where the edited year is still the same and it's "avant" categ
            else if (current_year == 1111  && dateyear > fut_year) {
                // change div to actualize 
                document.getElementById(`htcol1+${id}`).innerHTML = `${formateddate1}`
                document.getElementById(`htcol1+${id}`).setAttribute('data-value', `${result.datestart}`);
                document.getElementById(`htcol2+${id}`).innerHTML = `${formateddate2}`
                document.getElementById(`htcol2+${id}`).setAttribute('data-value', `${result.dateend}`);

                if (result.dateend == null) {
                    document.getElementById(`htcol2+${id}`).innerHTML = ' '
                }
            }

            // case where the edited year doesnt match the previous one and is not 'avant'
            else {
                //delete view of the row.
                rowtodel = document.getElementById(`htrow+${id}`);
                rowtodel.remove()
            }

            // reset form and warnings
            document.getElementById('edtht').reset();
            document.getElementById('edtwarninght').innerHTML = ' '

            // change views
            document.getElementById('breeds').style.display = 'block';
            document.getElementById('breedsedit').style.display = 'none';
            document.getElementById('breedsnew').style.display = 'none'; 
            document.getElementById('gestations').style.display = 'block';
            document.getElementById('gestationsedit').style.display = 'none';
            document.getElementById('gestationsnew').style.display = 'none';
            document.getElementById('heats').style.display = 'block';
            document.getElementById('heatsedit').style.display = 'none';
            document.getElementById('heatsnew').style.display = 'none';

            document.getElementById("heats").focus({preventScroll:false})

            })
            .catch(error => console.log(error));
        }
    }
}


function htyearview(year) {

     // get user.id and select body of the dates table.
     var id = document.getElementById(`infos`).getAttribute("data-value"); 
     bodyelement = document.getElementById('bodyheat');
 
     // erase previous rows.
     bodyelement.innerHTML = ''
 
     // get context
     var context = "heats"
 
     //charge the year entries with fetch
     fetch(`/yearview/${id}/${year}/${context}`)
     .then(response => response.json())
     .then(results => {
        console.log("Success")

        // change year button   
        buttonyear = document.getElementById('htshowselectyear');
        buttonyear.setAttribute('data-value', `${year}`);
        buttonyear.innerHTML = `${year}`;

        if (year == 1111) {
            buttonyear.innerHTML = "Après" 
        }

        for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `htrow+${results[i].id}`

            // format date
            var mydate = new Date(`${results[i].datestart}`);
            var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
             "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate1 = mydate.getDate() + ' ' + mymonth + ' ' + mydate.getFullYear() 
            
            if (results[i].dateend == null) {
                //create row
                row.innerHTML = `<th scope="row" id="htcol1+${results[i].id}" data-value="${results[i].datestart}">${formateddate1}</th>
                <td id="htcol2+${results[i].id}" data-value="${results[i].dateend}"></td>
                <td id="htcol3+${results[i].id}">  
                <button class="btn btn-light" id="htedit+${results[i].id}" title="Modifier" onclick=editheat(${results[i].id})>✍</button>
                <button class="btn btn-light" id="htdel+${results[i].id}" title="Supprimer" onclick=deleteheat(${results[i].id})>❌</button>          
                </td>`  
            }

            else {

                var mydate2 = new Date(`${results[i].dateend}`);
                var month2 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate2.getMonth()];
                var formateddate2 = mydate2.getDate() + ' ' + month2 + ' ' + mydate2.getFullYear();

                // create row
                row.innerHTML = `<th scope="row" id="htcol1+${results[i].id}" data-value="${results[i].datestart}">${formateddate1}</th>
                    <td id="htcol2+${results[i].id}" data-value="${results[i].dateend}">${formateddate2}</td>
                    <td id="htcol3+${results[i].id}">  
                    <button class="btn btn-light" id="htedit+${results[i].id}" title="Modifier" onclick=editheat(${results[i].id})>✍</button>
                    <button class="btn btn-light" id="htdel+${results[i].id}" title="Supprimer" onclick=deleteheat(${results[i].id})>❌</button>          
                    </td>`
            }
        
            bodyelement.append(row);
        }
     })
     .catch(error => console.log(error));
}


function addgestation(id) {
    // id : horse id
    // change views
    document.getElementById('breeds').style.display = 'none';
    document.getElementById('breedsedit').style.display = 'none';
    document.getElementById('breedsnew').style.display = 'none'; 
    document.getElementById('gestations').style.display = 'none';
    document.getElementById('gestationsedit').style.display = 'none';
    document.getElementById('gestationsnew').style.display = 'block';
    document.getElementById('heats').style.display = 'none';
    document.getElementById('heatsedit').style.display = 'none';
    document.getElementById('heatsnew').style.display = 'none';

    // select element
    elementform = document.getElementById('gestationsnew')

    // submit event
    elementform.querySelector('#newgt').onsubmit = function(e) {
        e.preventDefault();

        form = elementform.querySelector('#newgt')

        //get form values
        formdata = new FormData(form)  
        
        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/gestation/${id}`, {
            method: 'POST',
            body:formdata,
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => {
            if (response.ok) {
                return response.json();
              } 
            else {
                document.getElementById('crwarninggt').innerHTML = "Une erreur s'est produite. Veuillez vérifier les informations que vous avez saisies, ou réessayez plus tard."
                document.getElementById("crwarninggt").focus({preventScroll:false})  
                throw new Error('Something went wrong');   
              }
        })
        .then(result => {

            // format dates
            var mydate = new Date(`${result.datestart}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddatestart = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

            var mydateend = new Date(`${result.dateend}`);
            var month2 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydateend.getMonth()];
            var formateddateend = mydateend.getDate() + ' ' + month2 + ' ' + mydateend.getFullYear();

            if (result.dateend == null) {
                formateddateend = ' '
            }

            var myrealend = new Date(`${result.realend}`);
            var month3 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myrealend.getMonth()];
            var formatedrealend = myrealend.getDate() + ' ' + month3 + ' ' + myrealend.getFullYear();

            if (result.realend == null) {
                formatedrealend = ' '
            }

            var myecho1 = new Date(`${result.echo1}`);
            var month4 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myecho1.getMonth()];
            var formatedecho1 = myecho1.getDate() + ' ' + month4 + ' ' + myecho1.getFullYear();

            if (result.echo1 == null ) {
                formatedecho1 = ' '
            }

            var myecho2 = new Date(`${result.echo2}`);
            var month5 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myecho2.getMonth()];
            var formatedecho2 = myecho2.getDate() + ' ' + month5 + ' ' + myecho2.getFullYear();

            if (result.echo2 == null ) {
                formatedecho2 = ' '
            }

            var myecho3 = new Date(`${result.echo3}`);
            var month6 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myecho3.getMonth()];
            var formatedecho3 = myecho3.getDate() + ' ' + month6 + ' ' + myecho3.getFullYear();

            if (result.echo3 == null) {
                formatedecho3 = ' '
            }

            dateyear = mydate.getFullYear();
            elemtmp = document.getElementById('gestations');
            current_year = elemtmp.querySelector('#gestshowselectyear').getAttribute('data-value');

            //get actual date
            get_year = document.getElementById('yeartoday')
            act_year = get_year.getAttribute('data-value')

            // avant case years limit
            ant_year = parseInt(act_year) - 4

            // change table if its the concerned year.
            if ( dateyear == current_year || dateyear == null) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.id = `gtrow+${result.id}`
                row.className = 'anime'                

                elementtbody = document.getElementById('bodygest')

                row.innerHTML = `<th scope="row" id="gtcol1+${result.id}" data-value="${result.datestart}">${formateddatestart}</th>
                <td id="gtcol2+${result.id}" data-value="${result.dateend}">${formateddateend}</td>
                <td id="gtcol3+${result.id}" data-value="${result.realend}">${formatedrealend}</td>   
                <td id="gtcol4+${result.id}">
                  <button class="btn btn-light" id="gestview+${result.id}" title="Voir en détail" data-bs-toggle="modal" data-bs-target="#GestModal${result.id}">📖</button>
                  <button class="btn btn-light" id="gtedit+${result.id}" title="Modifier" onclick=editgestation(${result.id})>✍</button>
                  <button class="btn btn-light" id="gtdel+${result.id}" title="Supprimer" onclick=deletegestation(${result.id})>❌</button>
                </td>`

                elementtbody.prepend(row)
            }

            else if ( current_year == 1000 && dateyear < ant_year) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.id = `gtrow+${result.id}`
                row.className = 'anime'                

                elementtbody = document.getElementById('bodygest')

                row.innerHTML = `<th scope="row" id="gtcol1+${result.id}" data-value="${result.datestart}">${formateddatestart}</th>
                <td id="gtcol2+${result.id}" data-value="${result.dateend}">${formateddateend}</td>
                <td id="gtcol3+${result.id}" data-value="${result.realend}">${formatedrealend}</td>   
                <td id="gtcol4+${result.id}">
                  <button class="btn btn-light" id="gestview+${result.id}" title="Voir en détail" data-bs-toggle="modal" data-bs-target="#GestModal${result.id}">📖</button>
                  <button class="btn btn-light" id="gtedit+${result.id}" title="Modifier" onclick=editgestation(${result.id})>✍</button>
                  <button class="btn btn-light" id="gtdel+${result.id}" title="Supprimer" onclick=deletegestation(${result.id})>❌</button>
                </td>`

                elementtbody.prepend(row)

            }

            // create modal
            const mod = document.createElement('div')
            mod.className = "modal fade"
            mod.id = `GestModal${result.id}`
            mod.setAttribute('data-bs-backdrop', 'static');
            mod.setAttribute('data-bs-keyboard', 'false');           
            mod.setAttribute('tabindex', '-1');
            mod.setAttribute('aria-labelledby', `LabelGest${result.id}`); 
            mod.setAttribute('aria-hidden', 'true');

                mod.innerHTML = `<div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="LabelGest${result.id}">Rapport de gestation débutée le ${formateddatestart}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <div> Date de fin prévisionnelle : <p id="GestMdateend+${result.id}" data-value="${result.dateend}"> ${formateddateend} </p></div>
                <br>
                <div> Date de fin : <p id="Gestrealend+${result.id}" data-value="${result.realend}"> ${formatedrealend} </p></div>
                <br>
                    <div> Vétérinaire et/ou autres intervenants : <p id="GestMvet+${result.id}" data-value="${result.vet}"> ${result.vet}</p></div>
                    <br>
                    <div> Echographie 1 : <p id="GestMecho1+${result.id}" data-value="${result.echo1}"> ${formatedecho1} </p></div>
                    <br>
                    <div> Echographie 2 : <p id="GestMecho2+${result.id}" data-value="${result.echo2}"> ${formatedecho2} </p></div>
                    <br>
                    <div> Echographie 3 : <p id="GestMecho3+${result.id}" data-value="${result.echo3}"> ${formatedecho3} </p></div>
                    <br>
                    <div> Notes : <p id="GestMnotes+${result.id}" data-value="${result.notes}"> ${result.notes} </p></div>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick=editgestation(${result.id})>Editer</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fermer</button> 
                </div>
                </div>
            </div>`

            elementglobal = document.getElementById('gestations')
            elementglobal.append(mod)

            // reset form and warnings and change views
            document.getElementById('newgt').reset();  
            document.getElementById('crwarninggt').innerHTML = ' '

            document.getElementById('breeds').style.display = 'block';
            document.getElementById('breedsedit').style.display = 'none';
            document.getElementById('breedsnew').style.display = 'none'; 
            document.getElementById('gestations').style.display = 'block';
            document.getElementById('gestationsedit').style.display = 'none';
            document.getElementById('gestationsnew').style.display = 'none';
            document.getElementById('heats').style.display = 'block';
            document.getElementById('heatsedit').style.display = 'none';
            document.getElementById('heatsnew').style.display = 'none';

            document.getElementById("gestations").focus({preventScroll:false})
        })
        .catch(error => console.log(error));
    }
}


function deletegestation(id) {
    // id : gestation id

    //delete the form with a function
    fetch(`/gestation/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);
        // remove modal
        elementmodal = document.getElementById(`GestModal${id}`);
        elementmodal.remove()

        // hide nicely with an animation and remove at the end of it:
        element = document.getElementById(`gtrow+${id}`);
        element.style.animationPlayState = 'running';
        setTimeout(function (){
           element.remove()    
         }, 1000);
    })
    .catch(error => console.log(error)); 

}


function editgestation(id) {
    // id : gestation id

    // change views
    document.getElementById('breeds').style.display = 'none';
    document.getElementById('breedsedit').style.display = 'none';
    document.getElementById('breedsnew').style.display = 'none'; 
    document.getElementById('gestations').style.display = 'none';
    document.getElementById('gestationsedit').style.display = 'block';
    document.getElementById('gestationsnew').style.display = 'none';
    document.getElementById('heats').style.display = 'none';
    document.getElementById('heatsedit').style.display = 'none';
    document.getElementById('heatsnew').style.display = 'none';

    // select element
    element = document.getElementById('gestationsedit')

    //take actual values :
    var actualstartdate = document.getElementById(`gtcol1+${id}`).getAttribute("data-value"); 
    var actualdateend = document.getElementById(`gtcol2+${id}`).getAttribute("data-value"); 
    var actualrealend = document.getElementById(`gtcol3+${id}`).getAttribute("data-value"); 
    var actualnotes = document.getElementById(`GestMnotes+${id}`).getAttribute("data-value");
    var actualvet = document.getElementById(`GestMvet+${id}`).getAttribute("data-value");
    var actualecho1 = document.getElementById(`GestMecho1+${id}`).getAttribute("data-value");
    var actualecho2 = document.getElementById(`GestMecho2+${id}`).getAttribute("data-value");
    var actualecho3 = document.getElementById(`GestMecho3+${id}`).getAttribute("data-value");

    if ( !isNaN(Date.parse(actualstartdate)) ) {
        actualstartdate = new Date(actualstartdate).toISOString().substring(0, 10)
    }

    if ( !isNaN(Date.parse(actualdateend)) ) {
        actualdateend = new Date(actualdateend).toISOString().substring(0, 10)
    }

    if ( !isNaN(Date.parse(actualrealend)) ) {
        actualrealend = new Date(actualrealend).toISOString().substring(0, 10)
    }

    if ( !isNaN(Date.parse(actualecho1)) ) {
        actualecho1 = new Date(actualecho1).toISOString().substring(0, 10)
    }

    if ( !isNaN(Date.parse(actualecho2)) ) {
        actualecho2 = new Date(actualecho2).toISOString().substring(0, 10)
    }

    if ( !isNaN(Date.parse(actualecho3)) ) {
        actualecho3 = new Date(actualecho3).toISOString().substring(0, 10)
    }

    // prefill form
    element.querySelector('#gt_ds').value = actualstartdate;
    element.querySelector('#gt_de').value = actualdateend;
    element.querySelector('#gt_re').value = actualrealend;
    element.querySelector('#gt_v').value = actualvet;
    element.querySelector('#gt_e1').value = actualecho1;
    element.querySelector('#gt_e2').value = actualecho2;
    element.querySelector('#gt_e3').value = actualecho3;
    element.querySelector('#gt_n').value = actualnotes;

    // event listener 
    element.querySelector('#edtgest').onsubmit = function(e) {
        e.preventDefault();

        // get new values
        const newdatestart = element.querySelector('#gt_ds').value;
        const newdateend = element.querySelector('#gt_de').value;
        const newrealend = element.querySelector('#gt_re').value;
        const newvet = element.querySelector('#gt_v').value;
        const newecho1 = element.querySelector('#gt_e1').value;
        const newecho2 = element.querySelector('#gt_e2').value;
        const newecho3 = element.querySelector('#gt_e3').value;
        const newnotes = element.querySelector('#gt_n').value;

        var ds = new Date(newdatestart)
        var de = new Date(newdateend)
        var re = new Date(newrealend)
        var e1 = new Date(newecho1)
        var e2 = new Date(newecho2)
        var e3 = new Date(newecho3)


        // warnings
        if (newdatestart.length < 1 ) {
            element.querySelector('#edtwarninggt').innerHTML = "La date de début de gestation n'est pas indiquée."  
            document.getElementById("edtwarninggt").focus({preventScroll:false})  
        }

        else if (newvet.length < 1) {
            element.querySelector('#edtwarninggt').innerHTML = "Le vétérinaire (ou autre intervenant) suivant la gestation n'est pas indiqué. A défaut, remplissez 'Non spécifié'."
            document.getElementById("edtwarninggt").focus({preventScroll:false})
        }

        else if (newvet.length > 200) {
            element.querySelector('#edtwarninggt').innerHTML = "La case du vétérinaire ne peut contenir que 200 charactères."
            document.getElementById("edtwarninggt").focus({preventScroll:false})
        }

        else if (newnotes.length > 4000) {
            element.querySelector('#edtwarninggt').innerHTML = "La case des notes ne peut contenir que 4000 charactères."
            document.getElementById("edtwarninggt").focus({preventScroll:false})
        }

        else if (de != null && ds >= de) {
            element.querySelector('#edtwarninggt').innerHTML = "La date prévisionnelle de fin de gestation ne peut être antérieure à la date du début de gestation."
            document.getElementById("edtwarninggt").focus({preventScroll:false})
        }

        else if (re != null && ds >= re) {
            element.querySelector('#edtwarninggt').innerHTML = "La date de fin de gestation ne peut être antérieure à la date du début de gestation."
            document.getElementById("edtwarninggt").focus({preventScroll:false})
        }

        else if (e1 != null && ds >= e1) {
            element.querySelector('#edtwarninggt').innerHTML = "La date de la 1ère échographie ne peut être antérieure à la date du début de gestation."
            document.getElementById("edtwarninggt").focus({preventScroll:false})
        }

        else if (e2 != null && ds >= e2) {
            element.querySelector('#edtwarninggt').innerHTML = "La date de la seconde échographie ne peut être antérieure à la date du début de gestation."
            document.getElementById("edtwarninggt").focus({preventScroll:false})
        }

        else if (e3 != null && ds >= e3) {
            element.querySelector('#edtwarninggt').innerHTML = "La date de la troisième échographie ne peut être antérieure à la date du début de gestation."
            document.getElementById("edtwarninggt").focus({preventScroll:false})
        }

        else if (e1 != null && e2 != null && e1 >= e2) {
            element.querySelector('#edtwarninggt').innerHTML = "La date de la seconde échographie ne peut être antérieure à la date de la première échographie."
            document.getElementById("edtwarninggt").focus({preventScroll:false})
        }

        else if (e1 != null && e3 != null && e1 >= e3) {
            element.querySelector('#edtwarninggt').innerHTML = "La date de la troisième échographie ne peut être antérieure à la date de la première échographie."
            document.getElementById("edtwarninggt").focus({preventScroll:false})
        }

        else if (e3 != null && e2 != null && e2 >= e3) {
            element.querySelector('#edtwarninggt').innerHTML = "La date de la troisième échographie ne peut être antérieure à la date de la seconde échographie."
            document.getElementById("edtwarninggt").focus({preventScroll:false})
        }

        else {

            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/editgestation/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    datestart : newdatestart,
                    dateend : newdateend,
                    notes : newnotes,
                    realend : newrealend,
                    vet : newvet,
                    echo1 : newecho1,
                    echo2 : newecho2,
                    echo3 : newecho3,
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => {
                if (response.ok) {
                    return response.json();
                  } 
                else {
                    document.getElementById('edtwarninggt').innerHTML = "Une erreur s'est produite. Vérifiez les informations que vous avez saisies. Veuillez vérifier que les dates que vous avez saisies sont entre 2000 et 2030, que les dates des échographies et de terme sont supérieures à la date de début de gestation, et que les échographies sont saisies dans l'ordre chronologique."
                    document.getElementById("edtwarninggt").focus({preventScroll:false})
                    throw new Error('Something went wrong');               
                  }
            })
            .then(result => {
                // format dates
                var mydate = new Date(`${result.datestart}`);
                var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
                var formateddatestart = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

                
                var mydateend = new Date(`${result.dateend}`);
                var month2 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydateend.getMonth()];
                var formateddateend = mydateend.getDate() + ' ' + month2 + ' ' + mydateend.getFullYear();

                if (result.dateend == null) {
                    formateddateend = ' '
                }

                var myrealend = new Date(`${result.realend}`);
                var month3 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myrealend.getMonth()];
                var formatedrealend = myrealend.getDate() + ' ' + month3 + ' ' + myrealend.getFullYear();

                if (result.realend == null) {
                    formatedrealend = ' '
                }

                var myecho1 = new Date(`${result.echo1}`);
                var month4 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myecho1.getMonth()];
                var formatedecho1 = myecho1.getDate() + ' ' + month4 + ' ' + myecho1.getFullYear();

                if (result.echo1 == null ) {
                    formatedecho1 = ' '
                }

                var myecho2 = new Date(`${result.echo2}`);
                var month5 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myecho2.getMonth()];
                var formatedecho2 = myecho2.getDate() + ' ' + month5 + ' ' + myecho2.getFullYear();

                if (result.echo2 == null ) {
                    formatedecho2 = ' '
                }

                var myecho3 = new Date(`${result.echo3}`);
                var month6 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myecho3.getMonth()];
                var formatedecho3 = myecho3.getDate() + ' ' + month6 + ' ' + myecho3.getFullYear();

                if (result.echo3 == null) {
                    formatedecho3 = ' '
                }

                dateyear = mydate.getFullYear();
                elemtmp = document.getElementById('gestations');
                current_year = elemtmp.querySelector('#gestshowselectyear').getAttribute('data-value');

                //get actual date
                get_year = document.getElementById('yeartoday')
                act_year = get_year.getAttribute('data-value')

                // avant case years limit
                ant_year = parseInt(act_year) - 4

                // edit modal :
                document.getElementById(`LabelGest${id}`).innerHTML = `Rapport de gestation débutée le ${formateddatestart}`;
                document.getElementById(`GestMdateend+${id}`).innerHTML = `${formateddateend}`;
                document.getElementById(`GestMdateend+${id}`).setAttribute('data-value', `${result.dateend}`);
                document.getElementById(`Gestrealend+${id}`).innerHTML = `${formatedrealend}`;
                document.getElementById(`Gestrealend+${id}`).setAttribute('data-value', `${result.realend}`);
                document.getElementById(`GestMvet+${id}`).innerHTML = `${result.vet}`;
                document.getElementById(`GestMvet+${id}`).setAttribute('data-value', `${result.vet}`);
                document.getElementById(`GestMecho1+${id}`).innerHTML = `${formatedecho1}`;
                document.getElementById(`GestMecho1+${id}`).setAttribute('data-value', `${result.echo1}`);
                document.getElementById(`GestMecho2+${id}`).innerHTML = `${formatedecho2}`;
                document.getElementById(`GestMecho2+${id}`).setAttribute('data-value', `${result.echo2}`);
                document.getElementById(`GestMecho3+${id}`).innerHTML = `${formatedecho3}`;
                document.getElementById(`GestMecho3+${id}`).setAttribute('data-value', `${result.echo3}`);
                document.getElementById(`GestMnotes+${id}`).innerHTML = `${result.notes}`;
                document.getElementById(`GestMnotes+${id}`).setAttribute('data-value', `${result.notes}`);

                if ( dateyear == current_year || dateyear == null) {
                    // change div to actualize 
                    document.getElementById(`gtcol1+${id}`).innerHTML = `${formateddatestart}`;
                    document.getElementById(`gtcol1+${id}`).setAttribute('data-value', `${result.datestart}`);
                    document.getElementById(`gtcol2+${id}`).innerHTML = `${formateddateend}`;
                    document.getElementById(`gtcol2+${id}`).setAttribute('data-value', `${result.dateend}`);
                    document.getElementById(`gtcol3+${id}`).innerHTML = `${formatedrealend}`;
                    document.getElementById(`gtcol3+${id}`).setAttribute('data-value', `${result.realend}`);
                }

                // change table if its the concerned avant categ
                else if ( current_year == 1000 && dateyear < ant_year) {     
                    // change div to actualize 
                    document.getElementById(`gtcol1+${id}`).innerHTML = `${formateddatestart}`;
                    document.getElementById(`gtcol1+${id}`).setAttribute('data-value', `${result.datestart}`);
                    document.getElementById(`gtcol2+${id}`).innerHTML = `${formateddateend}`;
                    document.getElementById(`gtcol2+${id}`).setAttribute('data-value', `${result.dateend}`);
                    document.getElementById(`gtcol3+${id}`).innerHTML = `${formatedrealend}`;
                    document.getElementById(`gtcol3+${id}`).setAttribute('data-value', `${result.realend}`);
                }

                // if we change years in edit, don't show it if it changes categs showed.
                else {
                    //delete view of the row.
                    rowtodel = document.getElementById(`gtrow+${id}`);
                    rowtodel.remove()
                }

                // reset form and warnings
                document.getElementById('edtgest').reset();
                document.getElementById('edtwarninggt').innerHTML = ' '

                // change views
                document.getElementById('breeds').style.display = 'block';
                document.getElementById('breedsedit').style.display = 'none';
                document.getElementById('breedsnew').style.display = 'none'; 
                document.getElementById('gestations').style.display = 'block';
                document.getElementById('gestationsedit').style.display = 'none';
                document.getElementById('gestationsnew').style.display = 'none';
                document.getElementById('heats').style.display = 'block';
                document.getElementById('heatsedit').style.display = 'none';
                document.getElementById('heatsnew').style.display = 'none';

                document.getElementById("gestations").focus({preventScroll:false})

            })
            .catch(error => console.log(error)); 
        }
    }
}


function gestyearview(year) {
    // get user.id and select body of the dates table.
    var id = document.getElementById(`infos`).getAttribute("data-value"); 
    bodyelement = document.getElementById('bodygest');

    // erase previous rows.
    bodyelement.innerHTML = ''

    // get context
    var context = "gestation"

    //charge the year entries with fetch
    fetch(`/yearview/${id}/${year}/${context}`)
    .then(response => response.json())
    .then(results => {

        // change year button   
        buttonyear = document.getElementById('gestshowselectyear');
        buttonyear.setAttribute('data-value', `${year}`);
        buttonyear.innerHTML = `${year}`;

        if (year == 1000) {
            buttonyear.innerHTML = "Avant" 
        }

        for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `gtrow+${results[i].id}`

            // format dates
            var mydate = new Date(`${results[i].datestart}`);
                var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
                var formateddatestart = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

                
                var mydateend = new Date(`${results[i].dateend}`);
                var month2 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydateend.getMonth()];
                var formateddateend = mydateend.getDate() + ' ' + month2 + ' ' + mydateend.getFullYear();

                if (results[i].dateend == null) {
                    formateddateend = ' '
                }

                var myrealend = new Date(`${results[i].realend}`);
                var month3 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myrealend.getMonth()];
                var formatedrealend = myrealend.getDate() + ' ' + month3 + ' ' + myrealend.getFullYear();

                if (results[i].realend == null) {
                    formatedrealend = ' '
                }

                var myecho1 = new Date(`${results[i].echo1}`);
                var month4 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myecho1.getMonth()];
                var formatedecho1 = myecho1.getDate() + ' ' + month4 + ' ' + myecho1.getFullYear();

                if (results[i].echo1 == null ) {
                    formatedecho1 = ' '
                }

                var myecho2 = new Date(`${results[i].echo2}`);
                var month5 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myecho2.getMonth()];
                var formatedecho2 = myecho2.getDate() + ' ' + month5 + ' ' + myecho2.getFullYear();

                if (results[i].echo2 == null ) {
                    formatedecho2 = ' '
                }

                var myecho3 = new Date(`${results[i].echo3}`);
                var month6 = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myecho3.getMonth()];
                var formatedecho3 = myecho3.getDate() + ' ' + month6 + ' ' + myecho3.getFullYear();

                if (results[i].echo3 == null) {
                    formatedecho3 = ' '
                }

                row.innerHTML = `<th scope="row" id="gtcol1+${results[i].id}" data-value="${results[i].datestart}">${formateddatestart}</th>
                <td id="gtcol2+${results[i].id}" data-value="${results[i].dateend}">${formateddateend}</td>
                <td id="gtcol3+${results[i].id}" data-value="${results[i].realend}">${formatedrealend}</td>   
                <td id="gtcol4+${results[i].id}">
                  <button class="btn btn-light" id="gestview+${results[i].id}" title="Voir en détail" data-bs-toggle="modal" data-bs-target="#GestModal${results[i].id}">📖</button>
                  <button class="btn btn-light" id="gtedit+${results[i].id}" title="Modifier" onclick=editgestation(${results[i].id})>✍</button>
                  <button class="btn btn-light" id="gtdel+${results[i].id}" title="Supprimer" onclick=deletegestation(${results[i].id})>❌</button>
                </td>`

                bodyelement.append(row);

                 // create modal
                const mod = document.createElement('div')
                mod.className = "modal fade"
                mod.id = `GestModal${results[i].id}`
                mod.setAttribute('data-bs-backdrop', 'static');
                mod.setAttribute('data-bs-keyboard', 'false');           
                mod.setAttribute('tabindex', '-1');
                mod.setAttribute('aria-labelledby', `LabelGest${results[i].id}`); 
                mod.setAttribute('aria-hidden', 'true'); 

                mod.innerHTML = `<div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="LabelGest${results[i].id}">Rapport de gestation débutée le ${formateddatestart}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div> Date de fin prévisionnelle : <p id="GestMdateend+${results[i].id}" data-value="${results[i].dateend}"> ${formateddateend} </p></div>
                  <br>
                  <div> Date de fin : <p id="Gestrealend+${results[i].id}" data-value="${results[i].realend}"> ${formatedrealend} </p></div>
                  <br>
                    <div> Vétérinaire et/ou autres intervenants : <p id="GestMvet+${results[i].id}" data-value="${results[i].vet}"> ${results[i].vet}</p></div>
                    <br>
                    <div> Echographie 1 : <p id="GestMecho1+${results[i].id}" data-value="${results[i].echo1}"> ${formatedecho1} </p></div>
                    <br>
                    <div> Echographie 2 : <p id="GestMecho2+${results[i].id}" data-value="${results[i].echo2}"> ${formatedecho2} </p></div>
                    <br>
                    <div> Echographie 3 : <p id="GestMecho3+${results[i].id}" data-value="${results[i].echo3}"> ${formatedecho3} </p></div>
                    <br>
                    <div> Notes : <p id="GestMnotes+${results[i].id}" data-value="${results[i].notes}"> ${results[i].notes} </p></div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick=editgestation(${results[i].id})>Editer</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fermer</button> 
                </div>
                </div>
            </div>`

            elementglobal = document.getElementById('gestations')
            elementglobal.append(mod)
        }
    })
    .catch(error => console.log(error));
}

// MALES

function addbreed(id) {
    // id : horseid

    // change views
    document.getElementById('breed').style.display = 'none';
    document.getElementById('breededit').style.display = 'none';
    document.getElementById('breednew').style.display = 'block';

    // select element
    elementform = document.getElementById('breednew')

    // submit event
    elementform.querySelector('#newbr').onsubmit = function(e) {
        e.preventDefault();

        form = elementform.querySelector('#newbr')

        //get form values
        formdata = new FormData(form)  
        
        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/breeding/${id}`, {
            method: 'POST',
            body:formdata,
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => {
            if (response.ok) {
                return response.json();
              } 
            else {
                document.getElementById('crwarningbr').innerHTML = "Une erreur s'est produite. Veuillez vérifier les informations que vous avez saisies."
                document.getElementById("crwarningbr").focus({preventScroll:false})
                throw new Error('Something went wrong');   
              }
        })
        .then(result => {

            // format date
            var mydate = new Date(`${result.date}`);
            var month = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();

            dateyear = mydate.getFullYear();
            elemtmp = document.getElementById('breed');
            current_year = elemtmp.querySelector('#brshowselectyear').getAttribute('data-value');

            //get actual date
            get_year = document.getElementById('yeartoday')
            act_year = get_year.getAttribute('data-value')

            // avant/après cases years limits
            fut_year = parseInt(act_year) + 2
            ant_year = parseInt(act_year) - 2

            // change table if its the concerned year.
            if ( dateyear == current_year || dateyear == null) {

                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `brrow+${result.id}`

                elementtbody = document.getElementById('bodybreed')

                row.innerHTML = `<th scope="row" id="brcol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="brcol2+${result.id}" data-value="${result.mare}">${result.mare}</td>
                <td id="brcol3+${result.id}" data-value="${result.notes}">${result.notes}</td>   
                <td id="brcol4+${result.id}">  
                  <button class="btn btn-light" id="bredit+${result.id}" title="Modifier" onclick=editbreed(${result.id})>✍</button>
                  <button class="btn btn-light" id="brdel+${result.id}" title="Supprimer" onclick=deletebreed(${result.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)
            }

            else if ( current_year == 1111  && dateyear > fut_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `brrow+${result.id}`

                elementtbody = document.getElementById('bodybreed')

                row.innerHTML = `<th scope="row" id="brcol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="brcol2+${result.id}" data-value="${result.mare}">${result.mare}</td>
                <td id="brcol3+${result.id}" data-value="${result.notes}">${result.notes}</td>   
                <td id="brcol4+${result.id}">  
                  <button class="btn btn-light" id="bredit+${result.id}" title="Modifier" onclick=editbreed(${result.id})>✍</button>
                  <button class="btn btn-light" id="brdel+${result.id}" title="Supprimer" onclick=deletebreed(${result.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)
            }

            else if ( current_year == 1001 && dateyear < ant_year) {
                //change innerhtml : create row, fill it, append it at the beggining of the table.
                const row = document.createElement('tr')
                row.className = 'anime'
                row.id = `brrow+${result.id}`

                elementtbody = document.getElementById('bodybreed')

                row.innerHTML = `<th scope="row" id="brcol1+${result.id}" data-value="${result.date}">${formateddate}</th>
                <td id="brcol2+${result.id}" data-value="${result.mare}">${result.mare}</td>
                <td id="brcol3+${result.id}" data-value="${result.notes}">${result.notes}</td>   
                <td id="brcol4+${result.id}">  
                  <button class="btn btn-light" id="bredit+${result.id}" title="Modifier" onclick=editbreed(${result.id})>✍</button>
                  <button class="btn btn-light" id="brdel+${result.id}" title="Supprimer" onclick=deletebreed(${result.id})>❌</button>          
                </td> `

                elementtbody.prepend(row)
            }

            // reset form and warnings and change views
            document.getElementById('newbr').reset();  
            document.getElementById('crwarningbr').innerHTML = ' '

            document.getElementById('breed').style.display = 'block';
            document.getElementById('breededit').style.display = 'none';
            document.getElementById('breednew').style.display = 'none';

            document.getElementById("breed").focus({preventScroll:false})
        })
        .catch(error => console.log(error));
    }
}


function editbreed(id) {
    // id : breed id

    // change views
    document.getElementById('breed').style.display = 'none';
    document.getElementById('breededit').style.display = 'block';
    document.getElementById('breednew').style.display = 'none';

    // select element
    element = document.getElementById('breededit')

    // get actual values
    var actualdate = document.getElementById(`brcol1+${id}`).getAttribute("data-value"); 
    var actualmare = document.getElementById(`brcol2+${id}`).getAttribute("data-value"); 
    var actualnotes = document.getElementById(`brcol3+${id}`).getAttribute("data-value");

    // format date to html format
    if ( !isNaN(Date.parse(actualdate)) ) {
        actualdate = new Date(actualdate).toISOString().substring(0, 10)
    }

    // prefill form
    element.querySelector('#br_m').value = actualmare;
    element.querySelector('#br_d').value = actualdate;
    element.querySelector('#br_n').value = actualnotes;

    // event listener :
    element.querySelector('#edtbr').onsubmit = function(e) {
        e.preventDefault();

        // get new values
        const newmare = element.querySelector('#br_m').value;
        const newd = element.querySelector('#br_d').value;
        const newn = element.querySelector('#br_n').value;

        // warnings 
        if (newd.length < 1 ) {
            element.querySelector('#edtwarningbr').innerHTML = "La date de rendez-vous n'est pas indiquée."  
            document.getElementById("edtwarningbr").focus({preventScroll:false})  
        }

        else if (newmare.length < 1) {
            element.querySelector('#edtwarningbr').innerHTML = "La jument n'est pas indiquée. A défaut, remplissez 'Non spécifié'." 
            document.getElementById("edtwarningbr").focus({preventScroll:false})  
        }

        else if (newmare.length > 200) {
            element.querySelector('#edtwarningbr').innerHTML = "La case de la jument ne peut contenir que 200 charactères." 
            document.getElementById("edtwarningbr").focus({preventScroll:false})  
        }

        else if (newn.length > 1000) {
            element.querySelector('#edtwarningbr').innerHTML = "La case des notes ne peut contenir que 1000 charactères." 
            document.getElementById("edtwarningbr").focus({preventScroll:false})  
        }

        else {

            //csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/editbreeding/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    mare : newmare,
                    date : newd,
                    notes : newn
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => {
                if (response.ok) {
                    return response.json();
                  } 
                else {
                    document.getElementById('edtwarningbr').innerHTML = "Une erreur s'est produite. Vérifiez les informations que vous avez saisies."
                    document.getElementById("edtwarningbr").focus({preventScroll:false})
                    throw new Error('Something went wrong');               
                  }
            })
            .then(result => {

                // format date
                var myedtdate = new Date(`${result.date}`);
                var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"][myedtdate.getMonth()];
                var formateddate = myedtdate.getDate() + ' ' + mymonth + ' ' + myedtdate.getFullYear() 
                
                // year of the entry
                dateyear = myedtdate.getFullYear()

                // year showed 
                elemtmp = document.getElementById('breed');
                current_year = elemtmp.querySelector('#brshowselectyear').getAttribute('data-value');

                //get actual date
                get_year = document.getElementById('yeartoday')
                act_year = get_year.getAttribute('data-value')

                // avant/après cases years limits
                fut_year = parseInt(act_year) + 2
                ant_year = parseInt(act_year) - 2

                // change table if its the concerned year (and also if the date can't be found somehow.)
                if ( current_year != 1111 && current_year != 1001 && dateyear == current_year || dateyear == null) {
                    // change div to actualize 
                    document.getElementById(`brcol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`brcol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`brcol2+${id}`).innerHTML = `${result.mare}`;
                    document.getElementById(`brcol2+${id}`).setAttribute('data-value', `${result.mare}`);
                    document.getElementById(`brcol3+${id}`).innerHTML = `${result.notes}`;
                    document.getElementById(`brcol3+${id}`).setAttribute('data-value', `${result.notes}`);
                    
                }

                // change table if year is in the categorie "after" and if its date is past 2 years from now.
                else if ( current_year == 1111  && dateyear > fut_year) {
                    // change div to actualize 
                    document.getElementById(`brcol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`brcol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`brcol2+${id}`).innerHTML = `${result.mare}`;
                    document.getElementById(`brcol2+${id}`).setAttribute('data-value', `${result.mare}`);
                    document.getElementById(`brcol3+${id}`).innerHTML = `${result.notes}`;
                    document.getElementById(`brcol3+${id}`).setAttribute('data-value', `${result.notes}`);                
                }

                // change table if year is in the categorie "avant" and if its date is before 2 years from now.
                else if ( current_year == 1001 && dateyear < ant_year) {
                    // change div to actualize
                    document.getElementById(`brcol1+${id}`).innerHTML = `${formateddate}`;
                    document.getElementById(`brcol1+${id}`).setAttribute('data-value', `${result.date}`);
                    document.getElementById(`brcol2+${id}`).innerHTML = `${result.mare}`;
                    document.getElementById(`brcol2+${id}`).setAttribute('data-value', `${result.mare}`);
                    document.getElementById(`brcol3+${id}`).innerHTML = `${result.notes}`;
                    document.getElementById(`brcol3+${id}`).setAttribute('data-value', `${result.notes}`);    
                }

                // if we change years in edit, don't show it if it changes categs showed.
                else {
                    //delete view of the row.
                    rowtodel = document.getElementById(`brrow+${id}`);
                    rowtodel.remove()
                }

                // reset form and warnings
                document.getElementById('edtbr').reset();
                document.getElementById('edtwarningbr').innerHTML = ' '

                // change views
                document.getElementById('breed').style.display = 'block';
                document.getElementById('breededit').style.display = 'none';
                document.getElementById('breednew').style.display = 'none';

                document.getElementById("breed").focus({preventScroll:false})

            })
            .catch(error => console.log(error));
        }
    }
}


function deletebreed(id) {
    // id : breed id

    //delete the form with a function
    fetch(`/breeding/${id}`)
    .then(response => response.json())
    .then(message => {
        console.log(message);
        
        // hide nicely with an animation and remove at the end of it:
        element = document.getElementById(`brrow+${id}`);
        element.style.animationPlayState = 'running';
        setTimeout(function (){
           element.remove()    
         }, 1000);
    })
    .catch(error => console.log(error));  

}


function bryearview(year) {

    // get user.id and select body of the dates table.
    var id = document.getElementById(`infos`).getAttribute("data-value"); 
    bodyelement = document.getElementById('bodybreed');

    // erase previous rows.
    bodyelement.innerHTML = ''

    // get context
    var context = "breeding"

    //charge the year entries with fetch
    fetch(`/yearview/${id}/${year}/${context}`)
    .then(response => response.json())
    .then(results => {
        console.log("Success")

        // change year button   
       buttonyear = document.getElementById('brshowselectyear');
       buttonyear.setAttribute('data-value', `${year}`);
       buttonyear.innerHTML = `${year}`;

       if (year == 1001) {
           buttonyear.innerHTML = "Avant" 
       }

       else if (year == 1111) {
           buttonyear.innerHTML = "Après"     
       }

       for (let i = 0; i < results.length; i++) {

            const row = document.createElement('tr')
            row.className = 'anime'
            row.id = `brrow+${results[i].id}`

            // format date
            var mydate = new Date(`${results[i].date}`);
            var mymonth = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"][mydate.getMonth()];
            var formateddate = mydate.getDate() + ' ' + mymonth + ' ' + mydate.getFullYear() 

            row.innerHTML = `<th scope="row" id="brcol1+${results[i].id}" data-value="${results[i].date}">${formateddate}</th>
            <td id="brcol2+${results[i].id}" data-value="${results[i].mare}">${results[i].mare}</td>
            <td id="brcol3+${results[i].id}" data-value="${results[i].notes}">${results[i].notes}</td>   
            <td id="brcol4+${results[i].id}">  
              <button class="btn btn-light" id="bredit+${results[i].id}" title="Modifier" onclick=editbreed(${results[i].id})>✍</button>
              <button class="btn btn-light" id="brdel+${results[i].id}" title="Supprimer" onclick=deletebreed(${results[i].id})>❌</button>          
            </td>`

            bodyelement.append(row);
        }
    })
    .catch(error => console.log(error));
}

//export {bryearview, deletebreed, editbreed, addbreed, gestyearview, editgestation, deletegestation, addgestation, htyearview, editheat, deleteheat, addheat, bdyearview, editbredm, deletebredm, addbredm, incyearview, editincident, deleteincident, addincident, contestyearview, editcontest, deletecontest, addcontest, osteoyearview, editosteo, deleteosteo, addosteo, editpedigree, dentyearview, editdentistry, deletedentistry, newdentistry, dewyearview, editdew, deletedew, newdewormer, farryearview, editfarriery, deletefarriery, newfarriery, dateyearview, editdate, deletedate, newdates, vacyearview, editvax, deletevax, newvaccin, getCookie, editnotes, changeavatar, editinfos }
