/*
    Scrum Board - Inlämningsuppgift 2 - Javascript 2 - FE23
    By Kristoffer Bengtsson

    interface.js
    Module with functions for building user interface elements. 
*/
import * as Utilities from './utilities.js';


////////////////////////////////////////////////////////////////////////////////////////////////
// Show error messages in a popup dialog box
export function showError({ message }) {
    const errorBox = document.querySelector("#errors");
    errorBox.innerHTML = "";

    const errorWrapper = Utilities.createHTMLElement('div', '', errorBox, 'error-message');
    Utilities.createHTMLElement('h2', 'Error', errorWrapper);
    Utilities.createHTMLElement('div', message, errorWrapper, 'error-box-message', null, true);
    Utilities.createHTMLElement('button', 'OK', errorWrapper, 'error-close-button').addEventListener("click", (event) => {
        event.currentTarget.closest('dialog').close();
    });

    console.error(message);
    errorBox.showModal();
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Create a card/box to display a task (with controls depending on its state)
export function createTaskCard(task, onAssignTaskSubmit) {
    const card = Utilities.createHTMLElement('article', task.message, null, ['task-box', `color-${task.category}`], { taskid: task.taskid });
    switch (task.state) {
        case "todo": // Assign task form
            const assignForm = Utilities.createHTMLElement('form', '', card, 'task-assign-form');
            Utilities.createHTMLElement('input', '', assignForm, '', { placeholder: "Assign task to", type: "text", name: "assigned", "minlength": "2", "maxlength": "20", required: "true" });
            Utilities.createHTMLElement('button', 'Assign', assignForm);
            if (onAssignTaskSubmit) {
                assignForm.addEventListener("submit", onAssignTaskSubmit);
            }
            break;
        case "wip": // Done button and display assigned name
            Utilities.createHTMLElement('div', task.assigned, card, 'assigned-to');
            const doneButtonWrapper = Utilities.createHTMLElement('div', '', card, 'task-button-wrapper');
            Utilities.createHTMLElement('button', 'Done »', doneButtonWrapper);
            break;
        case "done": // Delete button and display assigned name
            Utilities.createHTMLElement('div', task.assigned, card, 'assigned-to');
            const deleteButtonWrapper = Utilities.createHTMLElement('div', '', card, 'task-delete-wrapper');
            Utilities.createHTMLElement('button', 'X', deleteButtonWrapper);
            break;
    }
    return card;
}
