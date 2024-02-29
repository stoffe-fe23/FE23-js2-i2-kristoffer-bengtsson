import { body, validationResult } from "express-validator";
import { taskExists } from './fakedb.js';


const validCategories = ['frontend', 'backend', 'ux'];


////////////////////////////////////////////////////////////////////////////////////////////////
// Stop if any validation errors are found and send them to the client. 
function handleValidationErrors(req, res, next) {
    const errorList = validationResult(req);
    if (errorList.errors.length > 0) {
        console.log("Validation errors found: " + errorList.errors.length, errorList.errors);
        res.status(400);
        res.json({ error: 'Validation error', data: errorList.errors });
    }
    else {
        next();
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE TASK VALIDATION
const deleteTaskValidators = [
    body("taskid")
        .exists().withMessage('The taskid of the task to delete must be set.').bail()
        .isUUID('all').withMessage('Invalid taskid of task to delete specified.').bail()
        .custom(validateDeleteTaskExists).bail(),
];


async function validateDeleteTaskExists(value) {
    return new Promise((resolve, reject) => {
        taskExists(value, 'done').then((isExisting) => {
            if (isExisting) {
                resolve();
            }
            else {
                reject("The specified taskid does not exist, or does not have the state 'done'!");
            }
        }).catch((error) => {
            reject(error.message);
        })
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////
// DONE TASK VALIDATION
const doneTaskValidators = [
    body("taskid")
        .exists().withMessage('The taskid of the task to complete must be set.').bail()
        .isUUID('all').withMessage('Invalid taskid specified.').bail()
        .custom(validateDoneTaskExists).bail(),
];


async function validateDoneTaskExists(value) {
    return new Promise((resolve, reject) => {
        taskExists(value, 'wip').then((isExisting) => {
            if (isExisting) {
                resolve();
            }
            else {
                reject("The specified taskid to complete does not exist, or does not have the state 'wip'!");
            }
        }).catch((error) => {
            reject(error.message);
        })
    });
}



////////////////////////////////////////////////////////////////////////////////////////////////
// ASSIGN TASK VALIDATION
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
        taskExists(value, 'todo').then((isExisting) => {
            if (isExisting) {
                resolve();
            }
            else {
                reject("The specified taskid does not exist, or does not have the state 'todo'!");
            }
        }).catch((error) => {
            reject(error.message);
        })
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////
// NEW TASK VALIDATION
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


////////////////////////////////////////////////////////////////////////////////////////////////
// Validation of category parameter
function validateCategory(category, req, res) {
    if (validCategories.includes(category)) {
        return true;
    }
    if (res) {
        res.status(400);
        res.json({
            error: 'Validation error', data: [
                {
                    type: "searchparam",
                    value: category,
                    msg: `Invalid value, category must be one of: ${validCategories.join(", ")}`,
                    path: "category",
                    location: "params"
                }
            ]
        });
    }
    return false;
}

export {
    handleValidationErrors,
    validateCategory,
    newTaskValidators,
    assignTaskValidators,
    doneTaskValidators,
    deleteTaskValidators,
    validCategories
};