import fs from 'fs/promises';

export async function loadTasks() {
    const taskData = await fs.readFile('./backend/tasks.json');
    return JSON.parse(taskData);
}


export async function saveTasks(taskData) {
    return await fs.writeFile('./backend/tasks.json', JSON.stringify(taskData, null, 4));
}


export async function saveNewTask(newTask) {
    if (newTask) {
        const taskData = await loadTasks();
        if (taskData) {
            taskData.push(newTask);
            await saveTasks(taskData);
        }
    }
}

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

export async function taskExists(taskId, requiredState = null) {
    const taskData = await loadTasks();
    if (!taskData || !Array.isArray(taskData)) {
        return false;
    }
    for (const task of taskData) {
        if ((task.taskid == taskId) && (!requiredState || (requiredState == task.state))) {
            return true;
        }
    }
    return false;
}