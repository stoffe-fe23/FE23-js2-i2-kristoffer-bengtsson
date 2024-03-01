/*
    tasks.js

    Module with functions for showing, creating and modifying tasks. 
*/
import * as Utilities from './utilities.js';
import RestApi from './RestApi.js';
import { showError, createTaskCard } from './interface.js';


const api = new RestApi('http://localhost:3000/tasks');
// const api = new RestApi('http://192.168.1.3:3000/tasks');


////////////////////////////////////////////////////////////////////////////////////////////////
// Remove a task from the board
export function deleteTask(taskId) {
    api.deleteJson(null, `delete/${taskId}`).then(() => {
        showTasks();
    }).catch((error) => {
        showError(error.message);
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Move a task to the Done column
export function setTaskDone(taskId) {
    api.updateJson(null, `done/${taskId}`).then(() => {
        showTasks();
    }).catch((error) => {
        showError(error.message);
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Set an assigned name and move task to the In Progress column
export function assignTask(taskFormData) {
    api.updateJson(taskFormData, 'assign').then(() => {
        showTasks();
    }).catch((error) => {
        showError(error.message);
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Add a new task to the ToDo column
export function addNewTask(taskFormData) {
    api.postJson(taskFormData, 'add').then(() => {
        showTasks();
    }).catch((error) => {
        showError(error.message);
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Display all tasks on the page
export function showTasks() {
    api.getJson('list').then((taskData) => {
        const columns = {
            todo: document.querySelector("#tasks-todo-box"),
            wip: document.querySelector("#tasks-wip-box"),
            done: document.querySelector("#tasks-done-box")
        }

        Object.values(columns).forEach((column) => { column.innerHTML = "" });

        if (taskData.length) {
            taskData.sort((a, b) => b.time - a.time);

            for (const task of taskData) {
                const card = createTaskCard(task, onAssignTaskSubmit);
                columns[task.state].appendChild(card);
            }
        }
    }).catch((error) => {
        showError(error.message);
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Submit handler: Assign someone to a task
function onAssignTaskSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('taskid', event.submitter.closest("article").getAttribute("taskid"));
    assignTask(formData);
    event.currentTarget.reset();
};