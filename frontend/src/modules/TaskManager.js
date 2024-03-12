/*
    Scrum Board - Inlämningsuppgift 2 - Javascript 2 - FE23
    By Kristoffer Bengtsson

    TaskManager.js
    Class with methods for showing, creating and modifying tasks. 
*/
import RestApi from './RestApi.js';
import { showError, createTaskCard, createTaskBox } from './interface.js';


export default class TaskManager {
    static validStates = ['todo', 'wip', 'done'];
    api;
    socketClient;
    #onAssignTask;


    constructor(apiUrl) {
        const url = new URL(apiUrl);

        this.api = new RestApi(apiUrl);

        this.socketClient = new WebSocket(`ws://${url.hostname}:${url.port}/updates`);
        this.socketClient.addEventListener("message", this.#onUpdateBroadcast.bind(this));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Remove a task
    deleteTask(taskId) {
        this.api.deleteJson(`delete/${taskId}`)
            //            .then(this.showTasks.bind(this))
            .catch(showError);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Move a task to the Done column
    setTaskDone(taskId) {
        this.api.updateJson(`done/${taskId}`)
            //            .then(this.showTasks.bind(this))
            .catch(showError);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Move task to In Progress column and assign a name
    // FormData must contain two keys: taskid, assigned
    assignTask(taskFormData) {
        this.api.updateJson('assign', taskFormData)
            //            .then(this.showTasks.bind(this))
            .catch(showError);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Add a new task to the ToDo column
    // FormData must contain two keys: message, category
    addNewTask(taskFormData) {
        this.api.postJson('add', taskFormData)
            //            .then(this.showTasks.bind(this))
            .catch(showError);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Builds display of all tasks on the page sorted in chronological order of creation. 
    showTasks() {
        this.api.getJson('list').then((taskData) => {
            const columns = {};
            TaskManager.validStates.forEach((state) => columns[state] = document.querySelector(`#tasks-${state}-box`));
            Object.values(columns).forEach((column) => { column.innerHTML = "" });

            if (taskData.length) {
                taskData.sort((a, b) => a.time - b.time);
                for (const task of taskData) {
                    // columns[task.state].appendChild(createTaskCard(task, this.#onAssignTask));
                    createTaskBox(task, columns[task.state], this.#onAssignTask);
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


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Update changes to tasks on the page broadcasted over the websocket.
    // Keeps the columns up-to-date and less disruptive to users trying to interact with tasks at
    // the same time. 
    #onUpdateBroadcast(event) {
        const updateData = JSON.parse(event.data);
        const currentCard = document.querySelector(`article[data-taskid="${updateData.data.taskid}"]`);

        if (currentCard) {
            currentCard.remove();
        }

        // Rebuild the task card to ensure it has the proper state controls
        if (updateData.type != "deleted") {
            createTaskBox(updateData.data, document.querySelector(`#tasks-${updateData.data.state}-box`), this.#onAssignTask);
            // document.querySelector(`#tasks-${updateData.data.state}-box`).prepend(createTaskCard(updateData.data, this.#onAssignTask));
            this.#sortTasks();
        }
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Insertion sorts the order or the existing tasks in all the state columns, to ensure
    // modified tasks appear in the correct place in the flow. 
    #sortTasks() {
        TaskManager.validStates.forEach((state) => {
            const column = document.querySelector(`#tasks-${state}-box`);

            for (let i = 1; i < column.children.length; i++) {
                let current = column.children[i];
                let j = i - 1;

                while ((j >= 0) && (column.children[j].dataset.time > current.dataset.time)) {
                    column.children[j + 1].after(column.children[j]);
                    j--;
                }
                column.children[j + 1].after(current);
            }
        });
    }
}

