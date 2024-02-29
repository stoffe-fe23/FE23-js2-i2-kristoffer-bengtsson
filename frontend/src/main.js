import { showTasks, addNewTask, setTaskDone, deleteTask } from './modules/tasks.js';


showTasks();


///////////////////////////////////////////////////////////////////////////////
// Event handler: Done button on In Progress tasks
document.querySelector("#tasks-wip-box").addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set('taskid', event.submitter.closest("article").getAttribute("taskid"));
    setTaskDone(formData);
});


///////////////////////////////////////////////////////////////////////////////
// Event handler: Delete button on Done tasks
document.querySelector("#tasks-done-box").addEventListener("submit", (event) => {
    event.preventDefault();

    if (confirm("Are you sure you wish to delete this task?")) {
        const formData = new FormData();
        formData.set('taskid', event.submitter.closest("article").getAttribute("taskid"));
        deleteTask(formData);
    }
});


///////////////////////////////////////////////////////////////////////////////
// Event handler: add a new task
document.querySelector("#new-task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget, event.submitter);
    addNewTask(formData);
});

