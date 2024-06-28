"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemDefinitionParser = void 0;
var ProblemDefinitionParser = /** @class */ (function () {
    function ProblemDefinitionParser() {
        this.problemName = "";
        this.functionName = "";
        this.inputFields = [];
        this.outputFields = [];
    }
    ProblemDefinitionParser.prototype.parse = function (input) {
        var _this = this;
        var lines = input.split("\n").map(function (line) { return line.trim(); });
        console.log(lines);
        var currentSection = null;
        lines.forEach(function (line) {
            console.log("Line is " + line);
            if (line.startsWith("Problem Name:")) {
                _this.problemName = _this.extractQuotedValue(line);
            }
            else if (line.startsWith("Function Name:")) {
                console.log("Function Name working :");
                console.log(line);
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
        console.log(this.functionName);
    };
    ProblemDefinitionParser.prototype.extractQuotedValue = function (line) {
        var match = line.match(/: "(.*)"$/);
        return match ? match[1] : "";
    };
    // TO GET THE INPUT FIELDS
    ProblemDefinitionParser.prototype.extractInputField = function (line) {
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
    // TO GET THE OUTPUTFIELDS
    ProblemDefinitionParser.prototype.extractOutputField = function (line) {
        line = line.replace("Output Field:", "");
        line = line.trim();
        return { type: line, name: "" };
    };
    ProblemDefinitionParser.prototype.generateCpp = function () {
        return this.generateFunction("cpp");
    };
    ProblemDefinitionParser.prototype.generateJs = function () {
        return this.generateFunction("js");
    };
    ProblemDefinitionParser.prototype.generateTs = function () {
        return this.generateFunction("ts");
    };
    ProblemDefinitionParser.prototype.generateFunction = function (lang) {
        var _this = this;
        var inputParams = this.inputFields
            .map(function (field) { return _this.mapType(field.type, lang) + " " + field.name; })
            .join(", ");
        console.log("Input params ");
        console.log(inputParams);
        var returnType = this.outputFields.length > 0
            ? this.mapType(this.outputFields[0].type, lang)
            : this.defaultReturnType(lang);
        var implementationPlaceholder = lang === "ts" ? "" : "";
        var functionSignature;
        switch (lang) {
            case "cpp":
                functionSignature = "".concat(returnType, " ").concat(this.functionName, "(").concat(inputParams, ")");
                break;
            case "js":
                functionSignature = "let ".concat(this.functionName, " = function (").concat(this.inputFields
                    .map(function (field) { return field.name; })
                    .join(", "), ")");
                break;
            case "ts":
                functionSignature = "function ".concat(this.functionName, "(").concat(this.inputFields
                    .map(function (field) { return "".concat(field.name, ": ").concat(_this.mapType(field.type, "ts")); })
                    .join(", "), ") :").concat(returnType);
                break;
        }
        var InputAndOutputParams = "";
        if (lang == "js") {
            InputAndOutputParams = "/**\n * @param {".concat(inputParams, "} ").concat(this.inputFields
                .map(function (field) { return field.name; })
                .join(", "), "\n * @returns {").concat(returnType, "}\n */\n");
        }
        return "\n\n".concat(InputAndOutputParams, "\n\n").concat(functionSignature, " {\n    // Implementation goes here\n    ").concat(implementationPlaceholder, "\n}").trim();
    };
    ProblemDefinitionParser.prototype.mapType = function (type, lang) {
        var typeMapping = {
            int: { cpp: "int", js: "number", ts: "number" },
            float: { cpp: "float", js: "number", ts: "number" },
            char: { cpp: "char", js: "string", ts: "string" },
            string: { cpp: "string", js: "string", ts: "string" },
            double: { cpp: "double", js: "number", ts: "number" },
            "vector<int>": {
                cpp: "vector<int>",
                js: "number[]",
                ts: "number[]",
            },
            "vector<float>": {
                cpp: "vector<float>",
                js: "number[]",
                ts: "number[]",
            },
            "vector<char>": {
                cpp: "vector<char>",
                js: "string[]",
                ts: "string[]",
            },
            "vector<string>": {
                cpp: "vector<string>",
                js: "string[]",
                ts: "string[]",
            },
            "vector<double>": {
                cpp: "vector<double>",
                js: "number[]",
                ts: "number[]",
            },
            "vector<bool>": {
                cpp: "vector<bool>",
                js: "boolean[]",
                ts: "boolean[]",
            },
            "vector<vector<int>>": {
                cpp: "vector<vector<int>>",
                js: "number[][]",
                ts: "number[][]",
            },
            "vector<vector<float>>": {
                cpp: "vector<vector<float>>",
                js: "number[][]",
                ts: "number[][]",
            },
            "vector<vector<char>>": {
                cpp: "vector<vector<char>>",
                js: "string[][]",
                ts: "string[][]",
            },
            "vector<vector<string>>": {
                cpp: "vector<vector<string>>",
                js: "string[][]",
                ts: "string[][]",
            },
            "vector<vector<double>>": {
                cpp: "vector<vector<double>>",
                js: "number[][]",
                ts: "number[][]",
            },
            "vector<vector<bool>>": {
                cpp: "vector<vector<bool>>",
                js: "boolean[][]",
                ts: "boolean[][]",
            },
        };
        return typeMapping[type][lang] || "unknown";
    };
    ProblemDefinitionParser.prototype.defaultReturnType = function (lang) {
        switch (lang) {
            case "cpp":
                return "void";
            case "js":
                return "void";
            case "ts":
                return "void";
            default:
                return "unknown";
        }
    };
    return ProblemDefinitionParser;
}());
exports.ProblemDefinitionParser = ProblemDefinitionParser;
