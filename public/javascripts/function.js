$(function() {
    const a = nl2br($('#description').text(), false)
    $('#description').html(a)
});

function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function toggleFilterVehic (e) {
    const currentBtn = $(e)
    const filterSearch = $('#filterSearch')
    filterSearch.toggleClass('toggleFilter')
    $('#filterSearch').children().first().focus()

    if (filterSearch.hasClass('toggleFilter')) {
        currentBtn.find('i').replaceWith('<i class="fa-solid fa-xmark"></i>')
    } else {
        currentBtn.find('i').replaceWith('<i class="fa-solid fa-filter"></i>')
    }
}

function resetForm() {
    $(':input').not(':button, :submit, :reset, :hidden').removeAttr('checked').removeAttr('selected').not(':checkbox, :radio, select').val('');
}