$(document).ready(function() {
    $('#formVehicule').on('submit', function (e) {
        e.preventDefault()
        const forms = $('#formVehicule')
        const formMessage = $('#formVehiculeMessage')
        const firstFieldToFocus = $('#image') 
        const vehiculeRecentCreer = $('#vehiculeRecentCreer')
        
        $.ajax({
            url: '/user/vehicule',
            method: 'POST',
            data: forms.serialize(),
            success: function (res) {
                const type = res.type

                formMessage.empty() // évite la duplication des messages
                firstFieldToFocus.focus() // pointe le focus sur le premier champ
                formMessage.removeClass('d-none')
                formMessage.append(`<h3 class='text-center mb-0'>${res.message}</h3>`)

                if (type === 'success') {
                    const {_id, image, marque, modele, annee, km, prix} = res.vehicule

                    forms.trigger('reset');
                    formMessage.addClass('alert-success').removeClass('alert-danger'); // retire le précédent message de success

                    // retire la bordure rouge des champs invalide
                    $('input').removeClass('is-invalid')
                    $('textarea').removeClass('is-invalid')

                    // affiche les véhicules créé à l'instant
                    vehiculeRecentCreer.addClass('d-flex').removeClass('d-none');
                    vehiculeRecentCreer.append(`
                    <div class="cardVehicule flex-wrap card mx-3 mt-4">
                        <img src="${image}" class="card-img-top">
                        <div class="card-body text-center">
                            <h5 class="card-title" id="modele_marque">${marque} ${modele}</h5>
                            <hr>
                            <p class="card-text mt-0 mb-0" id="annee">Année: ${annee}</p>
                            <p class="card-text mt-0 mb-0" id="km">Kilométrage total: ${km} km</p>
                            <p class="card-text mt-0" id="km">Prix TTC: ${prix} €</p>
                            <a href="/vehicule/${_id}" class="btn btn-primary"><i class="fa-solid fa-up-right-from-square"></i></a>
                            <button class="btn btn-danger" onclick="supprimerVehicule(${vehicule._id})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>`)
                } else {
                    const raisons = res.raison
                    formMessage.addClass('alert-danger').removeClass('alert-success');
                    formMessage.append('<hr>')
                    formMessage.append('<ul>')

                    for (const [champ, valeur] of Object.entries(raisons)) {
                        $('#formVehiculeMessage ul').append(`<li>${champ}: ${valeur}</li>`)
                    }

                    for (const champ in raisons) {
                        $('#' + champ).addClass('is-invalid')
                    }
                }
            },
            error: function (err) {
                formMessage.append('Erreur interne 500')
            }
        })
    })
})

function supprimerVehicule(idVehicule, e) {
    $.ajax({
        url: '/user/supprimerVehicule',
        method: 'POST',
        data: 'idVehicule=' + idVehicule,
        success: function (res) {
            const {type, message} = res

            if (type === 'success') {
                console.log(message);
            } else {
                console.log(message);
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
}