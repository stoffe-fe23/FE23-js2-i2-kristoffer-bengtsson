/*
    Scrum Board - Inlämningsuppgift 2 - Javascript 2 - FE23
    By Kristoffer Bengtsson

    tasksdb.js
    Module containing functions for retrieving and saving tasks in the tasks.json file.
*/
import fs from 'fs/promises';

const TASKS_FILE = './backend/tasks.json';


///////////////////////////////////////////////////////////////////////////////////
// Load all tasks from the file and return as an array of objects
export async function loadTasks() {
    const taskData = await fs.readFile(TASKS_FILE);
    return JSON.parse(taskData);
}


///////////////////////////////////////////////////////////////////////////////////
// Write the provided array of task objects to the file in JSON format
export async function saveTasks(taskData) {
    return await fs.writeFile(TASKS_FILE, JSON.stringify(taskData, null, 4));
}


///////////////////////////////////////////////////////////////////////////////////
// Add a new task and save to the file. 
export async function saveNewTask(newTask) {
    if (newTask) {
        const taskData = await loadTasks();
        if ((!taskData) || !Array.isArray(taskData)) {
            taskData = [];
        }
        taskData.push(newTask);
        await saveTasks(taskData);
    }
}


///////////////////////////////////////////////////////////////////////////////////
// Assign a name to a task, and save task data to the file. 
export async function assignTask(taskId, assignedTo) {
    if (taskId && assignedTo) {
        const taskData = await loadTasks();
        if (taskData) {
            const foundTask = taskData.find((task) => task.taskid == taskId);
            if (foundTask) {
                foundTask.assigned = assignedTo;
                foundTask.state = 'wip';
                await saveTasks(taskData);
            }
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////
// Mark the specified task as Done, and save task data to the file. 
export async function setTaskDone(taskId) {
    if (taskId) {
        const taskData = await loadTasks();
        if (taskData) {
            const foundTask = taskData.find((task) => task.taskid == taskId);
            if (foundTask) {
                foundTask.state = 'done';
                await saveTasks(taskData);
            }
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////
// Remove a task and save the tasks data to the file. 
export async function deleteTask(taskId) {
    if (taskId) {
        const taskData = await loadTasks();
        if (taskData) {
            const taskIndex = taskData.findIndex((task) => task.taskid == taskId);
            if (taskIndex !== -1) {
                taskData.splice(taskIndex, 1);
                await saveTasks(taskData);
            }
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////
// Check if a task with the specified ID and state exists in the file. 
// Returns "not found" if the taskid does not exist, "wrong state" if it does
// exist but the state does not match, or "ok" if there is a match. 
export async function taskExistsWithState(taskId, requiredState = null) {
    const taskData = await loadTasks();
    if (!taskData || !Array.isArray(taskData)) {
        return "not found";
    }
    for (const task of taskData) {
        if ((task.taskid == taskId) && (!requiredState || (requiredState == task.state))) {
            return "ok";
        }
        else if ((task.taskid == taskId) && (requiredState && (requiredState != task.state))) {
            return "wrong state";
        }
    }
    return "not found";
}