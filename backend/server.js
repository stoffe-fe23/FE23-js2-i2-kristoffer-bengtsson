/*
    Scrum Board - Inlämningsuppgift 2 - Javascript 2 - FE23
    By Kristoffer Bengtsson

    server.js
    Main Express/Node.js server script.
*/
import express from "express";
import cors from "cors";
import tasksRouter from "./modules/endpoints.js";
import { logRequestToFile, logErrorToFile } from './modules/serverlog.js';



const app = express();

app.use(express.json());
app.use(cors());

// Log requests to the serverlog.txt file
app.use(logRequestToFile);

// Serve the frontend client files in the docs folder at the root path: http://localhost:3000/
app.use(express.static('./frontend/docs'));

// Serve the API endpoints at the base path:  http://localhost:3000/tasks
app.use('/tasks', tasksRouter);

// General error handler
app.use((err, req, res, next) => {
    console.log("ERROR", err);
    logErrorToFile(req, err);
    res.status(500);
    res.json({ error: err.message });
})

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Running node server. View page at: http://localhost:3000/");
});


