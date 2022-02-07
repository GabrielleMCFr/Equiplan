document.addEventListener('DOMContentLoaded', function() {

    // views
    document.getElementById('mycontacts').style.display = 'block';
    document.getElementById('addcontacts').style.display = 'none';
    document.getElementById('searchingforcontacts').style.display = 'none';
    document.getElementById('searchbyjob').style.display = 'none';
    

    // wait for search event   
    document.querySelector('#searchcontact').addEventListener('submit', () => search(event));
    
});


function addview() {
    // views
    document.getElementById('mycontacts').style.display = 'none';
    document.getElementById('addcontacts').style.display = 'block';
    document.getElementById('searchingforcontacts').style.display = 'none';
    document.getElementById('searchbyjob').style.display = 'none';

}

function goback() {
    document.getElementById('mycontacts').style.display = 'block';
    document.getElementById('addcontacts').style.display = 'none';
    document.getElementById('searchingforcontacts').style.display = 'none';
    document.getElementById('searchbyjob').style.display = 'none';
}

function search(event) {

    event.preventDefault();

    element = document.getElementById('searchlist')
    elementglobal = document.getElementById('mycontacts')
    msg = document.getElementById('errormsg')

    //erase previous searches
    element.innerHTML = ' '
    msg.innerHTML = ' '

    // change views
    document.getElementById('mycontacts').style.display = 'none';
    document.getElementById('addcontacts').style.display = 'none';
    document.getElementById('searchingforcontacts').style.display = 'block';
    document.getElementById('searchbyjob').style.display = 'none';

    var id = document.getElementById("mycontacts").getAttribute("data-value");
    var context = "contact"
    const tosearch = elementglobal.querySelector('#research').value;

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
        document.getElementById("searchcontact").reset();
        if (results.length > 0) {
            // change div infos and view.
            for (let i = 0; i < results.length; i++) {

                const li = document.createElement('li')
                li.className = "list-group-item"
                li.id = `li+${results[i].id}`
                li.style.margin = '20px 0 0 0'
                var url = document.getElementById(`li+${results[i].id}`).getAttribute("data-url");
                li.innerHTML = `<a class="btn btn-light" href="${url}" style="background-color:white"><h6>${results[i].name} : ${results[i].nb} (${results[i].job})</h6></a>` 
                element.append(li);
            }  
        }

        else {
            msg.innerHTML = "La recherche n'a donné aucun résultat."
        }

                              
    })
    .catch(error => console.log(error));
}


function jobview(nb) {

    element1 = document.getElementById('jobtitle')
    element2 = document.getElementById('searchjoblist')

    //erase previous searches
    
    element2.innerHTML = ' '

    // change views
    document.getElementById('mycontacts').style.display = 'none';
    document.getElementById('addcontacts').style.display = 'none';
    document.getElementById('searchingforcontacts').style.display = 'none';
    document.getElementById('searchbyjob').style.display = 'block';

    var id = document.getElementById("mycontacts").getAttribute("data-value");
    var context = "job"
    const tosearch = nb;

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

        if (results.length > 0) {
            element1.innerHTML = `${results[0].job} <button class="editbutton rounded-pill" id="backsearch" onclick=goback()>Retour</button>`

            // change div infos and view.
            for (let i = 0; i < results.length; i++) {

                const li = document.createElement('li')
                li.className = "list-group-item"
                li.id = `li+${results[i].id}`
                li.style.margin = '20px 0 0 0'
                var url = document.getElementById(`li+${results[i].id}`).getAttribute("data-url");
                li.innerHTML = `<a class="btn btn-light" href="${url}" style="background-color:white"><h6>${results[i].name} : ${results[i].nb} (${results[i].job})</h6></a>` 
                element2.append(li);
            }
        }

        else {
            element1.innerHTML = "Aucun résultat n'est disponible <button class='editbutton rounded-pill' id='backsearch' onclick=goback()>Retour</button>"

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