/*
    main.js

    Main script of the frontend page. Handlers for user input. 
*/
import { showTasks, addNewTask, setTaskDone, deleteTask } from './modules/tasks.js';

// Display all tasks when the page loads. 
showTasks();


///////////////////////////////////////////////////////////////////////////////
// Event handler: Done button on In Progress tasks
document.querySelector("#tasks-wip-box").addEventListener("submit", (event) => {
    event.preventDefault();

    const taskId = event.submitter.closest("article").getAttribute("taskid");
    if (taskId) {
        setTaskDone(taskId);
    }
    else {
        console.error("Error marking task as done: Task ID not found!");
    }
});


///////////////////////////////////////////////////////////////////////////////
// Event handler: Delete button on Done tasks
document.querySelector("#tasks-done-box").addEventListener("submit", (event) => {
    event.preventDefault();

    const taskId = event.submitter.closest("article").getAttribute("taskid");
    if (taskId) {
        if (confirm("Are you sure you wish to delete this task?")) {
            deleteTask(taskId);
        }
    }
    else {
        console.error("Error deleting task: Task ID not found!");
    }
});


///////////////////////////////////////////////////////////////////////////////
// Event handler: add a new task
document.querySelector("#new-task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget, event.submitter);
    addNewTask(formData);
    event.currentTarget.reset();
});

