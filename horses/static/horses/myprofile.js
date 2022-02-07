document.addEventListener('DOMContentLoaded', function() {


    // views
    
    document.getElementById('userprofile').style.display = 'block';
    document.getElementById('edituser').style.display = 'none';
    document.getElementById('editmdp').style.display = 'none';
    document.getElementById('backview').style.display = 'none';
    


    //document.querySelector('#editinfos').addEventListener('click', () => editinfos(event));
});

function editinfos(id) {

    // views
    document.getElementById('userprofile').style.display = 'none';
    document.getElementById('edituser').style.display = 'block';
    document.getElementById('editmdp').style.display = 'none';
    document.getElementById('backview').style.display = 'block';
   

    // select elements
    element1 = document.getElementById('edituser');
    element2 = document.getElementById('editmdp');
    

    // take actual values
    var actualjob = document.getElementById("jobvalue").getAttribute("data-value"); 
    var actualaddress = document.getElementById("addressvalue").getAttribute("data-value"); 
    var actualfname = document.getElementById("fnamevalue").getAttribute("data-value"); 
    var actuallname = document.getElementById("lnamevalue").getAttribute("data-value"); 


    // prefill the form 
    element1.querySelector('#user-lname').value = actuallname;
    element1.querySelector('#user-job').value = actualjob;
    element1.querySelector('#user-live').value = actualaddress;
    element1.querySelector('#user-fname').value = actualfname;

    // EVENT EDIT INFOS
    element1.querySelector('#infos').onsubmit = function(e) {
        e.preventDefault();
        
        // get new values
        const newlname = element1.querySelector('#user-lname').value;
        const newjob = element1.querySelector('#user-job').value;
        const newaddress = element1.querySelector('#user-live').value;
        const newfname = element1.querySelector('#user-fname').value;
        const newpicture = element1.querySelector('#user-pic').value;


        // csrf token
        let csrftoken = getCookie('csrftoken');

        // fetch call
        fetch(`/edituser/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                job: newjob,
                address: newaddress,
                fname: newfname,
                lname: newlname,  
                picture: newpicture              
            }),
            headers: { "X-CSRFToken": csrftoken },
        }) 
        .then(response => response.json())
        .then(editeduser => { 
            console.log(editeduser)

            // reload user page
            window.location.reload()
        })
        .catch(error => console.log(error));
    }

    
}


function editpassword(id) {
    // views
    document.getElementById('userprofile').style.display = 'none';
    document.getElementById('edituser').style.display = 'none';
    document.getElementById('editmdp').style.display = 'block';
    document.getElementById('backview').style.display = 'block';
    

    // select elements
    element2 = document.getElementById('editmdp');

    // EVENT EDIT PASSWORD
    element2.querySelector('#mdp').onsubmit = function(ev) {
        ev.preventDefault();

        // get new values
        const newmdp = element2.querySelector('#newmdp').value;
        const newconf = element2.querySelector('#confmdp').value;
        

        if (newmdp == newconf && newmdp.length > 5){
            //change password
            // csrf token
            let csrftoken = getCookie('csrftoken');

            // fetch call
            fetch(`/editpassword/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    password: newmdp,
                    confirmation: newconf,  
                }),
                headers: { "X-CSRFToken": csrftoken },
            }) 
            .then(response => response.json())
            .then(editeduser => { 
                // return to classic profile view
                goback()
            })
            .catch(error => console.log(error));
        }

        else if (newmdp != newconf ) {
            // change inner html to warning div to add a warning.
            element2.querySelector('#warning').innerHTML = "Le mot de passe et la confirmation doivent correspondre."
           
        }

        else if (newmdp.length <= 5 ) {
            // change inner html to warning div to add a warning.
            element2.querySelector('#warning').innerHTML = "Le mot de passe doit avoir au moins 6 caractères."
            
        }

        else {
            // change inner html to warning div to add a warning.
            element2.querySelector('#warning').innerHTML = "Le mot de passe est invalide."
        }
    }
}



function goback() {

    // change views
    document.getElementById('userprofile').style.display = 'block';
    document.getElementById('edituser').style.display = 'none';
    document.getElementById('editmdp').style.display = 'none';
    document.getElementById('backview').style.display = 'none';
    

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



