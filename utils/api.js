const axios = require("axios");

const addDomain = async ({ domain, projectId }) => {
  console.log(domain);
  try {
    const res = await axios.post(
      `${process.env.API_ENDPOINT}projects/${projectId}/domains?teamId=${process.env.teamId}`,
      {
        name: domain,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log(error.response.data);
    return { name: domain, status: false };
  }
};

const verifyDomain = async ({ domain, projectId }) => {
  try {
    const res = await axios(`${process.env.API_ENDPOINT}projects/${projectId}/domains/${domain}/verify?teamId=${process.env.teamId}`, {
      headers: {
        Authorization: `Bearer ${process.env.token}`,
      },
      method: "post",
    });

    return res.data;
  } catch (error) {
    return null;
  }
};

const findProject = async ({ projectIdOrName }) => {
  try {
    const res = await axios.get(`${process.env.API_ENDPOINT}projects/${projectIdOrName}?teamId=${process.env.teamId}`, {
      headers: {
        Authorization: `Bearer ${process.env.token}`,
      },
    });

    return res.data;
  } catch (error) {
    return null;
  }
};

module.exports = { addDomain, verifyDomain, findProject };
