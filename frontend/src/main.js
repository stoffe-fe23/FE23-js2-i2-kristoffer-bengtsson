/*
    Scrum Board - Inlämningsuppgift 2 - Javascript 2 - FE23
    By Kristoffer Bengtsson

    main.js
    Main script of the frontend page. Event handlers for user input. 
*/
import TaskManager from './modules/TaskManager.js';

let dragDoneCounter = 0;
const taskManager = new TaskManager('http://localhost:3000/tasks');


////////////////////////////////////////////////////////////////////////////////////////////////
// Event handler: Assign someone to a task
taskManager.setOnAssignTaskEvent((event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('taskid', event.submitter.closest("article").dataset.taskid);
    taskManager.assignTask(formData);
});


///////////////////////////////////////////////////////////////////////////////
// Event handler: add a new task
document.querySelector("#new-task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget, event.submitter);
    taskManager.addNewTask(formData);
    event.currentTarget.reset();
});


///////////////////////////////////////////////////////////////////////////////
// Event handler: Done button on In Progress tasks
document.querySelector("#tasks-wip-box").addEventListener("submit", (event) => {
    event.preventDefault();
    const taskId = event.submitter.closest("article").dataset.taskid;
    if (taskId) {
        taskManager.setTaskDone(taskId);
    }
    else {
        console.error("Error marking task as done: Task ID not found!");
    }
});


///////////////////////////////////////////////////////////////////////////////
// Event handler: Delete button on Done tasks
document.querySelector("#tasks-done-box").addEventListener("submit", (event) => {
    event.preventDefault();
    const taskId = event.submitter.closest("article").dataset.taskid;
    if (taskId) {
        if (confirm("Are you sure you wish to delete this task?")) {
            taskManager.deleteTask(taskId);
        }
    }
    else {
        console.error("Error deleting task: Task ID not found!");
    }
});


///////////////////////////////////////////////////////////////////////////////
// Event handlers: Drag and drop a task from In Progress to Done column.

document.querySelector("#tasks-wip-box").addEventListener("dragstart", onDragDropTask);
document.querySelector("#tasks-wip-box").addEventListener("dragend", onDragDropTask);
document.querySelector("#tasks-done").addEventListener("dragover", onDragDropTask);
document.querySelector("#tasks-done").addEventListener("dragenter", onDragDropTask);
document.querySelector("#tasks-done").addEventListener("dragleave", onDragDropTask);
document.querySelector("#tasks-done").addEventListener("drop", onDragDropTask);

function onDragDropTask(event) {
    switch (event.type) {
        case "dragstart":
            if (event.target.matches('article')) {
                event.target.classList.add("dragged");
                event.dataTransfer.setData("text", event.target.getAttribute("data-taskid"));
                dragDoneCounter = 0;
            }
            break;
        case "dragend":
            if (event.target.matches('article')) {
                event.target.classList.remove("dragged");
            }
            break;
        case "dragover":
            // Needed or the drop event will not trigger
            event.preventDefault();
            break;
        case "dragenter":
            showDragIndicator(event.currentTarget, ++dragDoneCounter);
            break;
        case "dragleave":
            showDragIndicator(event.currentTarget, --dragDoneCounter);
            break;
        case "drop":
            const taskId = event.dataTransfer.getData("text");
            if (taskId) {
                taskManager.setTaskDone(taskId);
            }
            showDragIndicator(event.currentTarget, --dragDoneCounter);
            break;
    }
}

function showDragIndicator(elem, counter) {
    if (counter && !elem.classList.contains("dragover")) {
        elem.classList.add("dragover");
    }
    else if (!counter && elem.classList.contains("dragover")) {
        elem.classList.remove("dragover");
    }
}



// Display all tasks when the page loads. 
taskManager.showTasks();
