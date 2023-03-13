const EventEmitter = require("events");

const eventEmitter = new EventEmitter();

function isValidDomain(domain) {
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
  return domainRegex.test(domain);
}

function emitResult(result, successDomains, failedDomains, processNumber) {
  result = result.map((r) => ({ name: r.error ? r.error.domain : r.name, status: r.error ? false : r.verified }));
  eventEmitter.emit("addProcess", {
    process: processNumber,
    successDomains: [...successDomains, ...result.filter((r) => r.status).map((r) => r.name)],
    failedDomains: [...failedDomains, ...result.filter((r) => !r.status).map((r) => r.name)],
  });
}

function processArrayInChunks(projectId, array, chunkSize, addCallback) {
  const successDomains = [];
  const failedDomains = [];
  return async (callbackHandler) => {
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      const addPromise = chunk.map((domain) => addCallback({ domain, projectId }));
      let result = await Promise.all(addPromise);
      let processNumber = Math.floor(((i + chunkSize) / array.length) * 100);
      if (processNumber > 100) processNumber = 100;
      callbackHandler(result, successDomains, failedDomains, processNumber);
    }
  };
}

module.exports = { eventEmitter, processArrayInChunks, isValidDomain, emitResult };
