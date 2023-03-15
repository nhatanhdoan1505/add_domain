const express = require("express");
require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");
const { processArrayInChunks, eventEmitter, isValidDomain, emitResult } = require("./utils/common");
const { addDomain, findProject } = require("./utils/api");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const chunkSize = 2;

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("addDomain", async ({ domain, projectId }) => {
    let counter = 0;
    const maxCounter = Math.ceil(domain.length / chunkSize);

    domain = domain.filter((domain) => isValidDomain(domain));

    if (domain.length === 0) return socket.emit("done", { successDomains: [], failedDomains: [] });

    processArrayInChunks(projectId, domain, chunkSize, addDomain)(emitResult);
    eventEmitter.on("addProcess", ({ process, successDomains, failedDomains }) => {
      counter++;
      if (counter > maxCounter) return;
      socket.emit("process", { process, successDomains, failedDomains });
      if (process === 100) return socket.emit("done", { successDomains, failedDomains });
    });
  });
});

app.use(express.json({ extended: false }));
app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/domain/:projectId", async (req, res) => {
  const project = await findProject({ projectIdOrName: req.params.projectId });
  if (!project) return res.send("Project not found");
  return res.render("index", { name: project.targets.production.name });
});

app.use("*", (req, res) => {
  return res.send("404 Not Found");
});

server.listen(80, () => {
  console.log("Server started on port 3000");
});
