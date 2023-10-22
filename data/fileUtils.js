// import fs, { readFileSync, writeFileSync } from "fs";
// import { join } from "path";
const fs = require("fs");
const { readFileSync, writeFileSync } = require("fs");
const { model } = require("mongoose");
const { join } = require("path");
// ✅ write to file SYNCHRONOUSLY
function syncWriteFile(filename, data) {
  /**
   * flags:
   *  - w = Open file for reading and writing. File is created if not exists
   *  - a+ = Open file for reading and appending. The file is created if not exists
   */
  const dir = "./src/data";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  writeFileSync(`${dir}/${filename}`, data, {
    flag: "w",
  });
}

function readJSONFile(filename) {
  const dir = "./data";
  var data = JSON.parse(fs.readFileSync(`${dir}/${filename}`, { encoding: "utf8", flag: "r" }));
  return data;
}
// syncWriteFile('./example.txt', 'One\nTwo\nThree\nFour');
module.exports = { readJSONFile, syncWriteFile };
