function firstUpperCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}
function radioBtnOrderBy(variables, titreLabel, currentOrder) {
    let checked = ''
    if (currentOrder === variables) {
        checked = 'checked'
    }
    return `<div><input ${checked} type='radio' class='form-check-input' name="orderBy" value='${variables}' id='${variables}'><label for='${variables}'>${titreLabel}</label></div>`
}

module.exports = {
    firstUpperCase,
    radioBtnOrderBy
}