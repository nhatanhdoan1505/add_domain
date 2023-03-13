const addDomain = async ({ domain, projectId }) => {
  const res = await fetch(`${process.env.API_ENDPOINT}projects/${projectId}/domains?teamId=${process.env.teamId}`, {
    body: JSON.stringify({
      name: domain,
    }),
    headers: {
      Authorization: `Bearer ${process.env.token}`,
      "Content-Type": "application/json",
    },
    method: "post",
  });

  return res.json();
};

const verifyDomain = async ({ domain, projectId }) => {
  const res = await fetch(`${process.env.API_ENDPOINT}projects/${projectId}/domains/${domain}/verify?teamId=${process.env.teamId}`, {
    headers: {
      Authorization: `Bearer ${process.env.token}`,
    },
    method: "post",
  });

  return res.json();
};

module.exports = { addDomain, verifyDomain };
