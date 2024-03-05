/*
    Scrum Board - Inlämningsuppgift 2 - Javascript 2 - FE23
    By Kristoffer Bengtsson

    TaskManager.js
    Class with methods for showing, creating and modifying tasks. 
*/
import RestApi from './RestApi.js';
import { showError, createTaskCard } from './interface.js';


export default class TaskManager {
    api;
    #onAssignTask;

    constructor(apiUrl) {
        this.api = new RestApi(apiUrl);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Remove a task
    deleteTask(taskId) {
        this.api.deleteJson(`delete/${taskId}`)
            .then(this.showTasks.bind(this))
            .catch(showError);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Move a task to the Done column
    setTaskDone(taskId) {
        this.api.updateJson(`done/${taskId}`)
            .then(this.showTasks.bind(this))
            .catch(showError);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Move task to In Progress column and assign a name
    // FormData must contain two keys: taskid, assigned
    assignTask(taskFormData) {
        this.api.updateJson('assign', taskFormData)
            .then(this.showTasks.bind(this))
            .catch(showError);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Add a new task to the ToDo column
    // FormData must contain two keys: message, category
    addNewTask(taskFormData) {
        this.api.postJson('add', taskFormData)
            .then(this.showTasks.bind(this))
            .catch(showError);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Display all tasks on the page, sorted by newest first.
    showTasks() {
        this.api.getJson('list').then((taskData) => {
            const columns = {
                todo: document.querySelector("#tasks-todo-box"),
                wip: document.querySelector("#tasks-wip-box"),
                done: document.querySelector("#tasks-done-box")
            }

            Object.values(columns).forEach((column) => { column.innerHTML = "" });

            if (taskData.length) {
                taskData.sort((a, b) => b.time - a.time);
                for (const task of taskData) {
                    columns[task.state].appendChild(createTaskCard(task, this.#onAssignTask));
                }
            }
        }).catch(showError);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Set event handler function to be used by the "Assign Task" form of a task. 
    setOnAssignTaskEvent(onAssignTaskHandler) {
        if (typeof onAssignTaskHandler == "function") {
            this.#onAssignTask = onAssignTaskHandler;
        }
    }
}

