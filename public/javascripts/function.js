$(function() {
    const a = nl2br($('#description').text(), false)
    $('#description').html(a)
});

function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function toggleSearchVehic (e) {
    const currentBtn = $(e)
    const formSearch = $('form')
    $('form').toggleClass('toggleSearch')
    $('.searchBar a').toggleClass('removeTypeSearch')
    $('#recherche').focus()

    if (formSearch.hasClass('toggleSearch')) {
        currentBtn.find('i').replaceWith('<i class="fa-solid fa-xmark"></i>')
    } else {
        currentBtn.find('i').replaceWith('<i class="fa-solid fa-magnifying-glass"></i>')
    }
}