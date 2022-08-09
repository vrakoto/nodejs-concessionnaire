$(function() {
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