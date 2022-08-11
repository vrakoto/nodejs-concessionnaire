$(function() {
    const a = nl2br($('#description').text(), false)
    $('#description').html(a)
});

function supprimerVehicule(idVehicule, currentCard) {
    $.ajax({
        url: '/user/supprimerVehicule',
        method: 'POST',
        data: 'idVehicule=' + idVehicule,
        success: function (res) {
            $(currentCard).closest('.cardVehicule').remove()
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}