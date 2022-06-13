$(document).ready(function() {
    $('#formVehicule').on('submit', function (e) {
        e.preventDefault()
        const forms = $('#formVehicule').serialize()
        const formMessage = $('#formVehiculeMessage')
        const vehiculeRecentCreer = $('#vehiculeRecentCreer')
        
        $.ajax({
            url: '/user/vehicule',
            method: 'POST',
            data: forms,
            success: function (res) {
                const type = res.type

                formMessage.empty()
                formMessage.removeClass('d-none')
                formMessage.append(`<h3 class='text-center mb-0'>${res.message}</h3>`)

                if (type === 'success') {
                    const {_id, marque, modele, annee, km, prix} = res.vehicule

                    $('input').removeClass('is-invalid')
                    formMessage.addClass('alert-success').removeClass('alert-danger');

                    vehiculeRecentCreer.addClass('d-flex').removeClass('d-none');
                    vehiculeRecentCreer.removeClass('d-none')
                    vehiculeRecentCreer.append(`
                    <div class="cardVehicule flex-wrap card mx-3 mt-4">
                        <img src="https://picsum.photos/200" class="card-img-top">
                        <div class="card-body text-center">
                            <h5 class="card-title" id="modele_marque">${marque} ${modele}</h5>
                            <hr>
                            <p class="card-text mt-0 mb-0" id="annee">Année: ${annee}</p>
                            <p class="card-text mt-0 mb-0" id="km">Kilométrage total: ${km} km</p>
                            <p class="card-text mt-0" id="km">Prix TTC: ${prix} €</p>
                            <a href="/vehicule/${_id}" class="btn btn-primary">Consulter le véhicule</a>
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