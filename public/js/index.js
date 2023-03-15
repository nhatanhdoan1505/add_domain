$(document).ready(function () {
  const socket = io();

  const progressBar = document.getElementById("progressBar");
  const successList = document.getElementById("successList");
  const failedList = document.getElementById("failList");
  const path = window.location.pathname;
  const projectId = path.substring(1).split("/")[1];

  function editDom({ process, successDomains, failedDomains }) {
    progressBar.style.width = `${process}%`;
    progressBar.innerHTML = `${process}%`;
    successList.innerHTML += successDomains.map((domain) => `<li>${domain.trim()}</li>`).join("");
    failedList.innerHTML += failedDomains.map((domain) => `<li>${domain.trim()}</li>`).join("");
  }

  // Register "process" event listener outside of the "addDomainsButton" click handler
  socket.on("process", ({ process, successDomains, failedDomains }) => {
    editDom({ process, successDomains, failedDomains });
  });

  $("#addDomainsButton").click(function () {
    const domain = $("#domainList").val();
    let domains = domain.split("\n");
    domains = domains.filter((domain) => domain !== "");

    if (!domains.length) return alert("Please enter some domains");

    $("#spinner").addClass("spinner-border");
    $("#addDomainsButton").prop("disabled", true);

    socket.emit("addDomain", { domain: domains, projectId });

    // Remove "done" event listener added in previous "addDomainsButton" click
    socket.off("done");

    socket.on("done", () => {
      $("#spinner").removeClass("spinner-border");
      $("#addDomainsButton").prop("disabled", false);
      editDom({ process: 100, successDomains: [], failedDomains: [] });
    });
  });
});
