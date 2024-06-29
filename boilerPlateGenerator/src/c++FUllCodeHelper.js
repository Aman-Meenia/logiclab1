"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputMultipleVector = exports.InputSingleVector = exports.InputSimpleDateTypes = void 0;
var InputSimpleDateTypes = function (dataType, dataTypeName) {
    var inputCode = "";
    inputCode += "".concat(dataType, " ").concat(dataTypeName, "; \n");
    inputCode += "cin >> ".concat(dataTypeName, "; \n");
    return inputCode;
};
exports.InputSimpleDateTypes = InputSimpleDateTypes;
function extractValueForSingleVector(input) {
    var regex = /<([^>]+)>/;
    var match = input.match(regex);
    return match ? match[1] : null;
}
function extractInnermostValue(input) {
    var regex = /<([^<>]*)>/g;
    var match;
    var innermostValue = null;
    while ((match = regex.exec(input)) !== null) {
        innermostValue = match[1]; // Keep updating innermostValue with the last match
    }
    return innermostValue;
}
// INPUTSINGLEVECTOR LIKE VECTOR<ANY TYPE>
var InputSingleVector = function (dataType, dataTypeName, cnt) {
    // TAKE INPUT
    var inputCode = "";
    inputCode += "int size_".concat(cnt, "; \n");
    inputCode += "cin >> size_".concat(cnt, "; \n");
    // EXTRACT VALUE INSIDE THE VECTOR<>
    // const vectorDataType = extractValueForSingleVector(dataType);
    // console.log("vectorDataType is " + vectorDataType);
    // console.log("type is " + typeof dataType);
    // console.log("data is " + dataType);
    // DEFINE VECTOR
    inputCode += "".concat(dataType, " ").concat(dataTypeName, "(size_").concat(cnt, "); \n");
    // INPUT VECTOR
    inputCode += "\n  for(int i = 0; i < size_".concat(cnt, "; i++){\n    cin >> ").concat(dataTypeName, "[i];\n  } \n");
    return inputCode;
};
exports.InputSingleVector = InputSingleVector;
// INPUT <vector<vector<data type >>
var InputMultipleVector = function (dataType, dataTypeName, cnt) {
    var inputCode = "";
    // AS IT IS A 2D VECTOR WE HAVE TO TAKE BOTH N AND M AS INPUT
    inputCode += "int n_".concat(cnt, "; \n");
    inputCode += "cin >> n_".concat(cnt, "; \n");
    inputCode += "int m_".concat(cnt, "; \n");
    inputCode += "cin >> m_".concat(cnt, "; \n");
    var vectorDataType = extractInnermostValue(dataType);
    // console.log("vectorDataType is " + vectorDataType);
    // DEFINE VECTOR
    inputCode += "".concat(dataType, " ").concat(dataTypeName, " (n_").concat(cnt, ",vector<").concat(vectorDataType, ">(m_").concat(cnt, ")); \n");
    // INPUT VECTOR
    //
    return inputCode;
};
exports.InputMultipleVector = InputMultipleVector;
