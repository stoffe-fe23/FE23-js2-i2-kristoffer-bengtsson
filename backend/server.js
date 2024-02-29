import express from "express";
import cors from "cors";
import tasksRouter from "./modules/endpoints.js";

const app = express();

// Allow JSON data in the request body
app.use(express.json());

// Bypass Cross-Origin Resource Sharing restrictions
app.use(cors());

// Serve the frontend client files in the docs folder at the root path: http://localhost:3000/
app.use(express.static('./frontend/docs'));

// Serve the API endpoints at the base path:  http://localhost:3000/tasks
app.use('/tasks', tasksRouter);

// General error handler
app.use((err, req, res, next) => {
    console.log("ERROR", err);
    res.status(500);
    res.json({ error: err.message });
})

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Running node server on: http://localhost:3000/");
});


