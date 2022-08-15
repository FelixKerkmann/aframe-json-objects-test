function rename(id, old) {
    let popup = document.getElementById("popup");
    popup.innerHTML =
        '<div class="popup-content">' +
        '<form action="/showroom/' + id + '" class="form-container" method="post" enctype="application/json">\n' +
        '        <label>Rename Showroom</label>\n' +
        '        <input type="text" id="sname" name="sname" value="' + old + '" required>\n' +
        '        <br>\n' +
        '        <button type="submit" class="btn">Submit</button>\n' +
        '    </form> \n' +
        '       <button onclick="togglePopUp()"> Cancel </button> \n' +
        '</div>'
}

function togglePopUp() {
    if(document.getElementById("popup").style.visibility === 'hidden')
        document.getElementById("popup").style.visibility = 'visible'
    else {
        document.getElementById("popup").style.visibility = 'hidden'
    }
}