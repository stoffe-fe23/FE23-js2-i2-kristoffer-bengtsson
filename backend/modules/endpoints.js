/*
    endpoints.js

    Module with router request handlers for the /tasks API endpoint.
*/
import { loadTasks, saveNewTask, assignTask, setTaskDone, deleteTask } from "./tasksdb.js";
import { Router } from "express";
import { logErrorToFile } from './serverlog.js';
import {
    handleValidationErrors,
    newTaskValidators,
    assignTaskValidators,
    doneTaskValidators,
    deleteTaskValidators,
    validCategories
} from "./validation.js";



// Router for the /tasks path endpoints 
const tasksRouter = Router();


///////////////////////////////////////////////////////////////////////////////////
// Get a list of all tasks
tasksRouter.get('/list', (req, res) => {
    loadTasks().then((taskData) => {
        res.json(taskData);
    });
});


///////////////////////////////////////////////////////////////////////////////////
// Create a new task
tasksRouter.post("/add", newTaskValidators, handleValidationErrors, (req, res) => {
    const newTask = {
        taskid: crypto.randomUUID(),
        time: Date.now(),
        state: "todo",
        category: req.body.category ?? validCategories[0],
        message: req.body.message ?? "(no task text)",
        assigned: null
    }

    saveNewTask(newTask).then(() => {
        res.json(newTask);
    }).catch((error) => {
        logErrorToFile(req, `Unable to save new task. (${error.message})`);
        res.status(500);
        res.json({ error: `Error! Unable to save new task. (${error.message})` });
    });
});


///////////////////////////////////////////////////////////////////////////////////
// Assign a task to someone
tasksRouter.patch("/assign", assignTaskValidators, handleValidationErrors, (req, res) => {
    assignTask(req.body.taskid, req.body.assigned).then(() => {
        res.json(req.body);
    }).catch((error) => {
        logErrorToFile(req, `Unable to assign task. (${error.message})`)
        res.status(500);
        res.json({ error: `Error! Unable to assign task. (${error.message})` });
    });
});


///////////////////////////////////////////////////////////////////////////////////
// Mark a task as completed
tasksRouter.patch("/done/:taskid", doneTaskValidators, handleValidationErrors, (req, res) => {
    setTaskDone(req.params.taskid).then(() => {
        res.json({ taskid: req.params.taskid, state: "done" });
    }).catch((error) => {
        logErrorToFile(req, `Unable to mark task as done. (${error.message})`)
        res.status(500);
        res.json({ error: `Error! Unable to mark task as done. (${error.message})` });
    });
});


///////////////////////////////////////////////////////////////////////////////////
// Remove a task from the board
tasksRouter.delete("/delete/:taskid", deleteTaskValidators, handleValidationErrors, (req, res) => {
    deleteTask(req.params.taskid).then(() => {
        res.json({ taskid: req.params.taskid, state: "deleted" });
    }).catch((error) => {
        logErrorToFile(req, `Unable to delete task. (${error.message})`)
        res.status(500);
        res.json({ error: `Error! Unable to delete task. (${error.message})` });
    });
});


export default tasksRouter;