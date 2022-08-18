function togglePopUp() {
    if(document.getElementById("popup").style.visibility === 'hidden')
        document.getElementById("popup").style.visibility = 'visible'
    else {
        document.getElementById("popup").style.visibility = 'hidden'
    }
}

function toggleForm(id) {
    if(document.getElementById(id).style.display === 'block') {
        document.getElementById(id).style.display = 'none';
    } else {
        document.getElementById(id).style.display = 'block';
    }
}

function closeForm(id) {
    document.getElementById(id).style.display = 'none';
}

function toggleNavbar(elem) {
    let arr = ['nav-modelView', 'nav-inventory', 'nav-models']
    arr.forEach((o => {
        if(elem === o) {
            let selected = document.getElementById(o)
            selected.className = 'active'
            selected = document.getElementById(o.substring(4))
            selected.style.visibility = 'visible'
            selected.style.height = 'auto'

        } else {
            let deselected = document.getElementById(o)
            deselected.className = ''
            deselected = document.getElementById(o.substring(4))
            deselected.style.visibility = 'hidden'
            deselected.style.height = '0px'

        }
    }))
}

