/*
    serverlog.js

    Module with functions for logging requests and errors to the server.log file. 
*/
import fs from 'fs';

const logWriter = fs.createWriteStream('./backend/server.log', { flags: 'a' });

///////////////////////////////////////////////////////////////////////////////
// Middleware function logging incoming client requests to the server.log file
export async function logRequestToFile(req, res, next) {
    await logToFile(req.method, req.path);
    next();
}


///////////////////////////////////////////////////////////////////////////////
// Log error message to the logfile.
export async function logErrorToFile(req, error) {
    await logToFile(req.method, req.path, error);
}


///////////////////////////////////////////////////////////////////////////////
// Write a time-stamped line to the server.log file.
async function logToFile(method, path, message = '') {
    const requestTime = timestampToDateTime(Date.now());
    logWriter.write(`${requestTime}\t${method.padEnd(8, " ")}\t${path}\t${message}\n`);
}


///////////////////////////////////////////////////////////////////////////////
// Get date in readable format from a timestamp. (YYYY-MM-DD HH:II:SS)
function timestampToDateTime(timestamp, locale = 'sv-SE') {
    const dateObj = new Date(timestamp);
    const formatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    };

    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}
