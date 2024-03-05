/*
    Scrum Board - Inlämningsuppgift 2 - Javascript 2 - FE23
    By Kristoffer Bengtsson

    validation.js
    Module with validation chain arrays and functions for validation of request data. 
*/
import { body, param, validationResult } from "express-validator";
import { taskExistsWithState } from './tasksdb.js';
import { logErrorToFile } from './serverlog.js';


const validCategories = ['frontend', 'backend', 'ux'];


////////////////////////////////////////////////////////////////////////////////////////////////
// Check for validation errors. Stop if any are found and send back error response to client. 
function handleValidationErrors(req, res, next) {
    const errorList = validationResult(req);
    if (errorList.errors.length > 0) {
        logErrorToFile(req, `Request data validation errors (${errorList.errors.length})`);
        res.status(400);
        res.json({ error: 'Validation error', data: errorList.errors });
    }
    else {
        next();
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Delete task - validation
const deleteTaskValidators = [
    param("taskid")
        .exists().withMessage('The taskid of the task to delete must be set.').bail()
        .isUUID('all').withMessage('Invalid taskid of task to delete specified.').bail()
        .custom(validateDeleteTaskExists).bail(),
];


async function validateDeleteTaskExists(value) {
    return new Promise((resolve, reject) => {
        taskExistsWithState(value, 'done').then((taskExistState) => {
            switch (taskExistState) {
                case "ok": resolve(); break;
                case "not found": reject("The specified taskid does not exist."); break;
                case "wrong state": reject("The task specified to delete does not have the 'done' state!"); break;
            }
        }).catch((error) => {
            reject(error.message);
        })
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Mark task as Done - validation
const doneTaskValidators = [
    param("taskid")
        .exists().withMessage('The taskid of the task to complete must be set.').bail()
        .isUUID('all').withMessage('Invalid taskid specified.').bail()
        .custom(validateDoneTaskExists).bail(),
];


async function validateDoneTaskExists(value) {
    return new Promise((resolve, reject) => {
        taskExistsWithState(value, 'wip').then((taskExistState) => {
            switch (taskExistState) {
                case "ok": resolve(); break;
                case "not found": reject("The specified taskid does not exist."); break;
                case "wrong state": reject("The task to mark as done does not have the 'wip' state!"); break;
            }
        }).catch((error) => {
            reject(error.message);
        })
    });
}



////////////////////////////////////////////////////////////////////////////////////////////////
// Assign task - validation
const assignTaskValidators = [
    body("taskid")
        .exists().withMessage('The taskid of the task to assign must be set.').bail()
        .isUUID('all').withMessage('Invalid taskid specified.').bail()
        .custom(validateAssignTaskExists).bail(),
    body("assigned")
        .exists().withMessage('No name to assign the task to has been set.').bail()
        .trim().notEmpty().withMessage('A name must be specified to assign the task to.').bail()
        .isString().withMessage('The name to assign the task to must be a string.').bail()
        .isLength({ min: 2, max: 20 }).withMessage('The name to assign the task to must be between 2-20 characters long.').bail()
];

async function validateAssignTaskExists(value) {
    return new Promise((resolve, reject) => {
        taskExistsWithState(value, 'todo').then((taskExistState) => {
            switch (taskExistState) {
                case "ok": resolve(); break;
                case "not found": reject("The specified taskid does not exist."); break;
                case "wrong state": reject("The task to mark as in progress does not have the 'todo' state!"); break;
            }
        }).catch((error) => {
            reject(error.message);
        })
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Add new task - validation
const newTaskValidators = [
    body("category")
        .exists().withMessage('A task must have category set.').bail()
        .notEmpty().withMessage('A task must have category set.').bail()
        .isString().withMessage('A task must have a valid category').bail()
        .isIn(validCategories).withMessage('The category of a task must be one of: ' + validCategories.join(", ")).bail(),
    body("message")
        .exists().withMessage('A task must have a message text.').bail()
        .trim().notEmpty().withMessage('A task must have a message text.').bail()
        .isString().withMessage('A task must have a message containing text.').bail()
        .isLength({ min: 2, max: 1000 }).withMessage('A task must have a message text between 2-1000 characters in length.').bail()
];



export {
    handleValidationErrors,
    newTaskValidators,
    assignTaskValidators,
    doneTaskValidators,
    deleteTaskValidators,
    validCategories
};