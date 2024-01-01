const { parentPort } = require("worker_threads");
const { INTERNAL_API_KEY, RECOMMENDATION_BASE_URL } = require("../constants/config.constant");
const GlobalConfig = require("../models/global-config.model");
const fetch = require("node-fetch");
async function run() {
  const response = await fetch(`${RECOMMENDATION_BASE_URL}/update-similarity-df`, {
    method: "get",
    headers: { "Content-Type": "application/json", "x-internal-api-key": INTERNAL_API_KEY },
  });
  let data = await response.json();

  console.log("worker thread: update rcm model is running");

  parentPort.postMessage(data);
}

run();
