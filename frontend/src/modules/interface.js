import * as Utilities from './utilities.js';

export function showError(message) {
    const errorBox = document.querySelector("#errors");
    errorBox.innerHTML = "";

    Utilities.createHTMLElement('h2', 'Error', errorBox);
    Utilities.createHTMLElement('div', message, errorBox, 'error-box-message', null, true);

    Utilities.createHTMLElement('button', 'OK', errorBox, 'error-close-button').addEventListener("click", (event) => {
        event.currentTarget.closest('dialog').close();
    });

    errorBox.showModal();
}