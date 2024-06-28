"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullBoilerCodeGenerator = void 0;
var c__FUllCodeHelper_1 = require("./c++FUllCodeHelper");
var FullBoilerCodeGenerator = /** @class */ (function () {
    function FullBoilerCodeGenerator() {
        this.problemName = "";
        this.functionName = "";
        this.inputFields = [];
        this.outputFields = [];
    }
    FullBoilerCodeGenerator.prototype.parse = function (input) {
        var _this = this;
        var lines = input.split("\n").map(function (line) { return line.trim(); });
        // console.log(lines);
        var currentSection = null;
        lines.forEach(function (line) {
            if (line.startsWith("Problem Name:")) {
                _this.problemName = _this.extractQuotedValue(line);
            }
            else if (line.startsWith("Function Name:")) {
                console.log("Function Name working :");
                _this.functionName = _this.extractQuotedValue(line);
            }
            else if (line.startsWith("Input Structure:")) {
                currentSection = "input";
            }
            else if (line.startsWith("Output Structure:")) {
                currentSection = "output";
            }
            else if (line.startsWith("Input Field:")) {
                if (currentSection === "input") {
                    var field = _this.extractInputField(line);
                    if (field)
                        _this.inputFields.push(field);
                }
            }
            else if (line.startsWith("Output Field:")) {
                if (currentSection === "output") {
                    var field = _this.extractOutputField(line);
                    if (field)
                        _this.outputFields.push(field);
                }
            }
        });
        console.log(this.inputFields);
        console.log(this.outputFields);
        console.log(this.problemName);
        console.log("Function name is " + this.functionName);
    };
    FullBoilerCodeGenerator.prototype.extractQuotedValue = function (line) {
        var match = line.match(/: "(.*)"$/);
        return match ? match[1] : "";
    };
    // TO GET THEINPUT FIELDS
    FullBoilerCodeGenerator.prototype.extractInputField = function (line) {
        line = line.replace("Input Field:", "");
        var parts = line.trim().split(/\s+/);
        if (parts.length < 2) {
            // If there are not enough parts, the line might be malformed
            return null;
        }
        // The type is the first part
        var type = parts.slice(0, -1).join(" "); // Join all parts except the last one (which is the variable name)
        // The name is the last part
        var name = parts[parts.length - 1];
        return { type: type, name: name };
    };
    // TO GET THEOUTPUTFIELDS
    FullBoilerCodeGenerator.prototype.extractOutputField = function (line) {
        line = line.replace("Output Field:", "");
        line = line.trim();
        return { type: line, name: "" };
    };
    FullBoilerCodeGenerator.prototype.generateCppFull = function () {
        return this.generateFullCode("cpp");
    };
    FullBoilerCodeGenerator.prototype.generateFullCode = function (lang) {
        var inputFields = this.inputFields;
        var outputFields = this.outputFields;
        // console.log(inputFields);
        // console.log(outputFields);
        // console.log(typeof inputFields);
        var cnt = 0;
        if (lang === "cpp") {
            // TAKE INPUT
            var inputCode = "";
            for (var i = 0; i < inputFields.length; i++) {
                // console.log(inputFields[i].type);
                if (inputFields[i].type === "int" ||
                    inputFields[i].type === "float" ||
                    inputFields[i].type === "double" ||
                    inputFields[i].type === "char" ||
                    inputFields[i].type === "string" ||
                    inputFields[i].type === "bool" ||
                    inputFields[i].type === "long" ||
                    inputFields[i].type === "long long") {
                    inputCode += (0, c__FUllCodeHelper_1.InputSimpleDateTypes)(inputFields[i].type, inputFields[i].name);
                }
                else if (inputFields[i].type === "vector<int>" ||
                    inputFields[i].type === "vector<float>" ||
                    inputFields[i].type === "vector<double>" ||
                    inputFields[i].type === "vector<char>" ||
                    inputFields[i].type === "vector<string>" ||
                    inputFields[i].type === "vector<bool>" ||
                    inputFields[i].type === "vector<long>" ||
                    inputFields[i].type === "vector<long long>") {
                    cnt += 1;
                    inputCode += (0, c__FUllCodeHelper_1.InputSingleVector)(inputFields[i].type, inputFields[i].name, cnt);
                }
                else if (inputFields[i].type === "vector<vector<int>>" ||
                    inputFields[i].type === "vector<vector<float>>" ||
                    inputFields[i].type === "vector<vector<double>>" ||
                    inputFields[i].type === "vector<vector<char>>" ||
                    inputFields[i].type === "vector<vector<string>>" ||
                    inputFields[i].type === "vector<vector<bool>>" ||
                    inputFields[i].type === "vector<vector<long>>" ||
                    inputFields[i].type === "vector<vector<long long>>") {
                    cnt += 1;
                    inputCode += (0, c__FUllCodeHelper_1.InputMultipleVector)(inputFields[i].type, inputFields[i].name, cnt);
                }
            }
            // console.log(inputCode);
            // PRINT OUTPUT CODE TO COMARE WITH ANS
            var outputCode = "";
            for (var i = 0; i < outputFields.length; i++) {
                if (outputFields[i].type === "int" ||
                    outputFields[i].type === "float" ||
                    outputFields[i].type === "double" ||
                    outputFields[i].type === "char" ||
                    outputFields[i].type === "string" ||
                    outputFields[i].type === "bool" ||
                    outputFields[i].type === "long" ||
                    outputFields[i].type === "long long") {
                    outputCode += "cout<<ans<<endl;\n";
                }
                else if (outputFields[i].type === "vector<int>" ||
                    outputFields[i].type === "vector<float>" ||
                    outputFields[i].type === "vector<double>" ||
                    outputFields[i].type === "vector<char>" ||
                    outputFields[i].type === "vector<string>" ||
                    outputFields[i].type === "vector<bool>" ||
                    outputFields[i].type === "vector<long>" ||
                    outputFields[i].type === "vector<long long>") {
                    outputCode += "cout<<ans.size()<<endl; \n";
                    outputCode += "for(int i = 0; i < ans.size(); i++) {cout<<ans[i]<<\" \";} cout<<endl; \n";
                }
                else if (outputFields[i].type === "vector<vector<int>>" ||
                    outputFields[i].type === "vector<vector<float>>" ||
                    outputFields[i].type === "vector<vector<double>>" ||
                    outputFields[i].type === "vector<vector<char>>" ||
                    outputFields[i].type === "vector<vector<string>>" ||
                    outputFields[i].type === "vector<vector<bool>>" ||
                    outputFields[i].type === "vector<vector<long>>" ||
                    outputFields[i].type === "vector<vector<long long>>") {
                    outputCode += "\nfor(int i=0; i<ans.size(); i++){\n    for(int j=0; j<ans[0].size(); j++){\n        cout<<ans[i][j]<<\" \";\n    }\n       cout<<endl;\n}\ncout<<endl;\n";
                }
            }
            // How to write the function call
            var functionCall = "";
            functionCall += this.functionName + "(";
            for (var i = 0; i < inputFields.length; i++) {
                functionCall += inputFields[i].type;
                functionCall += " ";
                functionCall += inputFields[i].name;
                functionCall += ",";
            }
            functionCall = functionCall.slice(0, -1);
            functionCall += ");\n";
            //TODO: we have the add the user function here
            return "\n#include <bits/stdc++.h>\nusing namespace std;\n\nint  main(){\n\n".concat(inputCode, "\n").concat(outputFields[0].type, " ans = ").concat(functionCall, "\n").concat(outputCode, "\n\nreturn 0;\n}\n");
        }
        return "";
    };
    return FullBoilerCodeGenerator;
}());
exports.FullBoilerCodeGenerator = FullBoilerCodeGenerator;
// const obj = new FullBoilerCodeGenerator();
//
// obj.parse(`
// Problem Name: "Problem Name"
// Function Name: "maxoftwonumber"
// Input Structure:
// Input Field: int a
// Input Field: float f
// Input Field: vector<vector<int>> v1
// Input Field: vector<vector<string>> v2
// Input Field: vector<int> v3
// Input Field: vector<string> v4
// Output Structure:
// Output Field: vector<vector<string>>
// `);
//
// console.log(obj.generateCpp());
