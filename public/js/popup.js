function togglePopUp(id) {
    if(document.getElementById(id).style.visibility === 'visible')
        document.getElementById(id).style.visibility = 'hidden'
    else {
        document.getElementById(id).style.visibility = 'visible'
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

function setDeleteListener() {
    const cancelDelete = document.querySelectorAll('.listen-delete')
    cancelDelete.forEach(elem => {
        let id = elem.querySelector('.id-elem').id
        let safeDelete = elem.querySelector('.safe-delete')
        let cancelDelete = elem.querySelector('.cancel-delete')
        safeDelete.addEventListener('click', () => {
            toggleDelete(id)
        })
        cancelDelete.addEventListener('click', () => {
            toggleDelete(id)
        })
    })
}

function centeringDeletePopups() {
    const popup = document.querySelectorAll('.popup-center')
    popup.forEach(elem => {
        elem.style.left = '-95%'
    })
}

function toggleDelete(elem) {
    if(document.getElementById(elem).style.visibility === 'visible') {
        document.getElementById(elem).style.visibility = 'hidden'
    } else {
        document.getElementById(elem).style.visibility = 'visible'
    }
}
