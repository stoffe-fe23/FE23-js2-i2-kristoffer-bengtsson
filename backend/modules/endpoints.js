import { loadTasks, saveNewTask, assignTask, setTaskDone, deleteTask } from "./fakedb.js";
import { Router } from "express";
import {
    validateNewTask,
    validateCategory,
    validateAssignTask,
    validateDoneTask,
    validateDeleteTask,
    newTaskValidators,
    assignTaskValidators,
    doneTaskValidators,
    deleteTaskValidators
} from "./validation.js";

// Router for the /tasks path endpoints 
const tasksRouter = Router();

///////////////////////////////////////////////////////////////////////////////////
// Get a list of all tasks in a category
tasksRouter.get('/list/:category', (req, res) => {
    if (validateCategory(req.params.category, req, res)) {
        loadTasks().then((taskData) => {
            const foundTasks = taskData.filter((task) => task.category == req.params.category);
            res.json(foundTasks);
        });
    }
});


///////////////////////////////////////////////////////////////////////////////////
// Get a list of all tasks
tasksRouter.get('/list', (req, res) => {
    loadTasks().then((taskData) => {
        res.json(taskData);
    });
});


///////////////////////////////////////////////////////////////////////////////////
// Create a new task
tasksRouter.post("/add", newTaskValidators, (req, res) => {
    if (validateNewTask(req, res)) {
        const newTask = {
            taskid: crypto.randomUUID(),
            time: Date.now(),
            state: "todo",
            category: req.body.category ?? "none",
            message: req.body.message ?? "No text",
            assigned: null
        }

        saveNewTask(newTask).then(() => {
            res.json(newTask);
        }).catch((error) => {
            res.status(500);
            res.json({ error: `Error! Unable to save new task. (${error.message})` });
        });
    }
});


///////////////////////////////////////////////////////////////////////////////////
// Assign a task to someone
tasksRouter.patch("/assign", assignTaskValidators, (req, res) => {
    if (validateAssignTask(req, res)) {
        assignTask(req.body.taskid, req.body.assigned).then(() => {
            res.json(req.body);
        }).catch((error) => {
            res.status(500);
            res.json({ error: `Error! Unable to assign task. (${error.message})` });
        });
    }
});

///////////////////////////////////////////////////////////////////////////////////
// Mark a task as completed
tasksRouter.patch("/done", doneTaskValidators, (req, res) => {
    if (validateDoneTask(req, res)) {
        setTaskDone(req.body.taskid).then(() => {
            res.json(req.body);
        }).catch((error) => {
            res.status(500);
            res.json({ error: `Error! Unable to mark task as done. (${error.message})` });
        });
    }
});

///////////////////////////////////////////////////////////////////////////////////
// Remove a task from the board
tasksRouter.delete("/delete", deleteTaskValidators, (req, res) => {
    if (validateDeleteTask(req, res)) {
        deleteTask(req.body.taskid).then(() => {
            res.json(req.body);
        }).catch((error) => {
            res.status(500);
            res.json({ error: `Error! Unable to delete task. (${error.message})` });
        });
    }
});


export default tasksRouter;