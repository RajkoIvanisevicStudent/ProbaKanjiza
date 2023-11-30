// Funkcija prima kontejner (default) liste proizvoda
export function collapseAll(container) {
    let accordionChevrons = container.querySelectorAll('img.AccChevron');
    for (const accChev of accordionChevrons) {
        collapseCategory(accChev);
    }
}

// Funkcija prima kontejner (default) liste proizvoda
export function expandAll(container) {
    let accordionChevrons = container.querySelectorAll('img.AccChevron');
    for (const accChev of accordionChevrons) {
        expandCategory(accChev);
    }
}

// Funkcija prima sliku chevron na koju se kliknulo...
export function expandCategory(chevron) {
    let elemToShow = chevron.parentElement.nextElementSibling; //...pristupa elementu koji treba prikazati...
    elemToShow.classList.remove('HiddenCategory') // ...prikazuje ga...
    chevron.classList.add('Expanded'); // ...ažurira indikator 
}

// Funkcija prima sliku chevron na koju se kliknulo...
export function collapseCategory(chevron) {
    let elemToHide = chevron.parentElement.nextElementSibling; //...pristupa elementu koji treba sakriti...
    elemToHide.classList.add('HiddenCategory') // ...sakriva ga...
    chevron.classList.remove('Expanded'); // ...ažurira indikator 
}

// Funkcija prima kontejner liste (default) proizvoda
export function selectAll(container) {
    let checkboxes = container.querySelectorAll('input[type="checkbox"]');
    for (const chkBox of checkboxes) {
        chkBox.indeterminate = false;
        chkBox.checked = true;
        chkBox.classList.remove('Indeterminate');
    }
}

// Funkcija prima kontejner liste (default) proizvoda
export function deselectAll(container) {
    let checkboxes = container.querySelectorAll('input[type="checkbox"]');
    for (const chkBox of checkboxes) {
        chkBox.indeterminate = false;
        chkBox.checked = false;
        chkBox.classList.remove('Indeterminate');
    }
}

// Funkcija prima kontejner liste (default) proizvoda
export function numberOfSelectedProducts(container) {
    return container.querySelectorAll('input[type="checkbox"]:checked.Leaf').length;
}

// Funkcija prima kontejner liste (default) proizvoda
export function selectionStateInfo(container) {
    let info = {};
    info.numberOfSelectedProducts = container.querySelectorAll('input[type="checkbox"]:checked.Leaf').length;
    info.totalCheckBoxes = container.querySelectorAll('input[type="checkbox"]').length;
    info.numberOfSelectedCheckBoxes = container.querySelectorAll('input[type="checkbox"]:checked').length;
    info.totalChevrons = container.querySelectorAll('img.AccChevron').length;
    info.expandedChevrons = container.querySelectorAll('img.AccChevron.Expanded').length;
    return info;
}

