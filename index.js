const express = require("express");
require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");
const { processArrayInChunks, eventEmitter, isValidDomain, emitResult } = require("./utils/common");
const { addDomain } = require("./utils/api");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("addDomain", async ({ domain, projectId }) => {
    domain = domain.filter((domain) => isValidDomain(domain));

    if (domain.length === 0) return socket.emit("done", { successDomains: [], failedDomains: [] });

    processArrayInChunks(projectId, domain, 2, addDomain)(emitResult);
    eventEmitter.on("addProcess", ({ process, successDomains, failedDomains }) => {
      socket.emit("process", { process, successDomains, failedDomains });
      if (process === 100) return socket.emit("done", { successDomains, failedDomains });
    });
  });
});

app.use(express.json({ extended: false }));
app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/:projectId", (req, res) => {
  return res.render("index");
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
