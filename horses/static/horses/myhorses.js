document.addEventListener('DOMContentLoaded', function() {

    // views
    document.getElementById('userhorses').style.display = 'block';
    document.getElementById('newhorse').style.display = 'none';
    document.getElementById('backview').style.display = 'none';
    
});


function addhorse() {

    // views
    document.getElementById('userhorses').style.display = 'none';
    document.getElementById('newhorse').style.display = 'block';
    document.getElementById('backview').style.display = 'block';

}



function goback() {

    // change views
    document.getElementById('userhorses').style.display = 'block';
    document.getElementById('newhorse').style.display = 'none';
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