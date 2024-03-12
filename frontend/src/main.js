/*
    Scrum Board - Inlämningsuppgift 2 - Javascript 2 - FE23
    By Kristoffer Bengtsson

    main.js
    Main script of the frontend page. Event handlers for user input. 
*/
import TaskManager from './modules/TaskManager.js';


const taskManager = new TaskManager('http://localhost:3000/tasks');
// const taskManager = new TaskManager('http://192.168.1.3:3000/tasks');


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
            }
            break;
        case "dragend":
            if (event.target.matches('article')) {
                event.target.classList.remove("dragged");
            }
            break;
        case "dragover":
            event.preventDefault(); // Needed or the drop event will not trigger
            break;
        case "dragenter":
            event.currentTarget.classList.add("dragover");
            break;
        case "dragleave":
            if (event.currentTarget == event.target) {
                event.currentTarget.classList.remove("dragover");
            }
            break;
        case "drop":
            const taskId = event.dataTransfer.getData("text");
            if (taskId) {
                taskManager.setTaskDone(taskId);
            }
            event.currentTarget.classList.remove("dragover");
            break;
    }
}



// Display all tasks when the page loads. 
taskManager.showTasks();
