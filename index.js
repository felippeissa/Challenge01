const express = require("express");

const server = express();

server.use(express.json());

/**
 * A `projects` variable can be` const` because an array
 * can receive editions or exclusions, even if it is a constant.
 */
const projects = [];

/**
 * Middleware that checks if the project exists
 */

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

/**
 * Middleware that logs the number of requests
 */
function logRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

/**
 * Returns all projects
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/**
 * Request body: id, title
 * Register a new project
 */
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

/**
 * Route params: id
 * Request body: title
 * Change the title of the project with the id present in the route parameters.
 */
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

/**
 * Route params: id
 * Deletes the project associated with the id present in the route parameters.
 */
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

/**
 * Route params: id;
 * Adds a new task to the chosen project via id;
 */
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
