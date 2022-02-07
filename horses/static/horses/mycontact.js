document.addEventListener('DOMContentLoaded', function() {

    // views
    document.getElementById('mycontact').style.display = 'block';
    document.getElementById('editmycontact').style.display = 'none';
    
});


function editview() {
    // views
    document.getElementById('mycontact').style.display = 'none';
    document.getElementById('editmycontact').style.display = 'block';

}

function goback() {
    document.getElementById('mycontact').style.display = 'block';
    document.getElementById('editmycontact').style.display = 'none';

}

