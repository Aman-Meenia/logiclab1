"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var helper_1 = require("./helper");
var helperFullCode_1 = require("./helperFullCode");
// Check if folder path is provided as argument
if (process.argv.length < 3) {
    console.log("Folder path is missing.");
    process.exit(1);
}
// Get folder path from command line argument
var folderPath = process.argv[2];
// console.log("Folder path: " + folderPath);
// Validate if folder exists
if (!fs.existsSync(folderPath)) {
    console.error("Folder \"".concat(folderPath, "\" does not exist."));
    process.exit(1);
}
// Read structure.md file from the provided folder
var structureFilePath = path.join(folderPath, "structure.md");
if (!fs.existsSync(structureFilePath)) {
    console.error("File \"structure.md\" not found in \"".concat(folderPath, "\"."));
    process.exit(1);
}
var input = fs.readFileSync(structureFilePath, "utf-8");
// console.log("Input: " + input);
// Create a directory for boilerplate files if it doesn't exist
var boilerplateDir = path.join(folderPath, "boilerplate");
if (!fs.existsSync(boilerplateDir)) {
    fs.mkdirSync(boilerplateDir);
}
// Parse the input and generate code files
var parser = new helper_1.ProblemDefinitionParser();
parser.parse(input);
try {
    var cppCode = parser.generateCpp();
    fs.writeFileSync(path.join(boilerplateDir, "boilerplate-cpp.cpp"), cppCode);
    console.log("C++ code file generated successfully.");
}
catch (error) {
    console.error("Failed to generate C++ code:", error);
}
try {
    var jsCode = parser.generateJs();
    fs.writeFileSync(path.join(boilerplateDir, "boilerplate-js.js"), jsCode);
    console.log("JavaScript code file generated successfully.");
}
catch (error) {
    console.error("Failed to generate JavaScript code:", error);
}
try {
    var tsCode = parser.generateTs();
    fs.writeFileSync(path.join(boilerplateDir, "boilerplate-ts.ts"), tsCode);
    console.log("TypeScript code file generated successfully.");
}
catch (error) {
    console.error("Failed to generate TypeScript code:", error);
}
// FULL BOILERPLATE GENERATION
// Create a directory for boilerplate files if it doesn't exist
var boilerplateFullDir = path.join(folderPath, "boilerplateFullDir");
if (!fs.existsSync(boilerplateFullDir)) {
    fs.mkdirSync(boilerplateFullDir);
}
var FullCode = new helperFullCode_1.FullBoilerCodeGenerator();
FullCode.parse(input);
try {
    var cppFullCode = FullCode.generateCppFull();
    fs.writeFileSync(path.join(boilerplateFullDir, "boilerplate-full-cpp.cpp"), cppFullCode);
    console.log("Full C++ code file generated successfully.");
}
catch (error) {
    console.error("Failed to generate Full C++ code:", error);
}
console.log('Code files generated successfully in the "boilerplate" directory.');
