const { parentPort, workerData } = require("worker_threads");
const { INTERNAL_API_KEY, RECOMMENDATION_BASE_URL } = require("../constants/config.constant");
const PersonalConfig = require("../models/personal-config.model");
const fetch = require("node-fetch");

async function run() {
  const response = await fetch(`${RECOMMENDATION_BASE_URL}/get-recommended-items`, {
    method: "post",
    body: JSON.stringify(workerData.ratedRestaurants),
    headers: { "Content-Type": "application/json", "x-internal-api-key": INTERNAL_API_KEY },
  });
  let data = await response.json();
  console.log(workerData.ratedRestaurants);
  
  console.log("worker thread: train rcm model is running");

  parentPort.postMessage(data);
}

run();
