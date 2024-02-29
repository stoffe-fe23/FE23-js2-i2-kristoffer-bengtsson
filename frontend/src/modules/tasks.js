import * as Utilities from './utilities.js';
import RestApi from './RestApi.js';
import { showError } from './interface.js';



////////////////////////////////////////////////////////////////////////////////////////////////
// Remove a task from the board
export function deleteTask(taskFormData) {
    const api = new RestApi('http://localhost:3000/tasks/delete');

    api.deleteJson(taskFormData).then((taskData) => {
        showTasks();
    }).catch((error) => {
        showError(error.message);
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Move a task to the Done column
export function setTaskDone(taskFormData) {
    const api = new RestApi('http://localhost:3000/tasks/done');

    api.updateJson(taskFormData).then((taskData) => {
        showTasks();
    }).catch((error) => {
        showError(error.message);
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Set an assigned name and move task to the In Progress column
export function assignTask(taskFormData) {
    const api = new RestApi('http://localhost:3000/tasks/assign');

    api.updateJson(taskFormData).then((taskData) => {
        showTasks();
    }).catch((error) => {
        showError(error.message);
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Add a new task to the ToDo column
export function addNewTask(taskFormData) {
    const api = new RestApi('http://localhost:3000/tasks/add');

    api.postJson(taskFormData).then((taskData) => {
        showTasks();
    }).catch((error) => {
        showError(error.message);
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Display all tasks on the page
export function showTasks() {
    const api = new RestApi('http://localhost:3000/tasks/list');
    api.getJson().then((taskData) => {
        const todoBox = document.querySelector("#tasks-todo-box");
        const wipBox = document.querySelector("#tasks-wip-box");
        const doneBox = document.querySelector("#tasks-done-box");
        todoBox.innerHTML = "";
        wipBox.innerHTML = "";
        doneBox.innerHTML = "";

        for (const task of taskData) {
            const card = createTaskCard(task);
            switch (task.state) {
                case "todo": todoBox.appendChild(card); break;
                case "wip": wipBox.appendChild(card); break;
                case "done": doneBox.appendChild(card); break;
            }
        }
    }).catch((error) => {
        showError(error.message);
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Create a card/box to display a task, depending on task state
export function createTaskCard(task) {
    const card = Utilities.createHTMLElement('article', task.message, null, ['task-box', `color-${task.category}`], { taskid: task.taskid });
    switch (task.state) {
        case "todo":
            const assignForm = Utilities.createHTMLElement('form', '', card, 'task-assign-form');
            Utilities.createHTMLElement('input', '', assignForm, '', { placeholder: "Assign task to", type: "text", name: "assigned", "min-length": "2", "max-length": "20", required: "true" });
            Utilities.createHTMLElement('button', 'Assign', assignForm);
            assignForm.addEventListener("submit", onAssignTaskSubmit);
            break;
        case "wip":
            Utilities.createHTMLElement('div', task.assigned, card, 'assigned-to');
            const doneButtonWrapper = Utilities.createHTMLElement('div', '', card, 'task-button-wrapper');
            Utilities.createHTMLElement('button', 'Done »', doneButtonWrapper);
            break;
        case "done":
            Utilities.createHTMLElement('div', task.assigned, card, 'assigned-to');
            const deleteButtonWrapper = Utilities.createHTMLElement('div', '', card, 'task-delete-wrapper');
            Utilities.createHTMLElement('button', 'X', deleteButtonWrapper);
            break;
    }
    return card;
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Submit handler: Assign someone to a task
function onAssignTaskSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('taskid', event.submitter.closest("article").getAttribute("taskid"));
    assignTask(formData);
};
