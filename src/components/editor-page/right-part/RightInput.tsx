import React, { useState } from "react";

interface Variable {
  name: string;
  type: string;
  value: string;
}

interface TestCase {
  id: number;
  var: Variable[];
}

const RightInput: React.FC = () => {
  const cases: TestCase[] = [
    { id: 1, var: [{ name: "s", type: "string", value: "hello" }] },
    { id: 2, var: [{ name: "s", type: "string", value: "coder" }] },
    { id: 3, var: [{ name: "s", type: "string", value: "world" }] },
  ];

  const [testCases, setTestCases] = useState<TestCase[]>(cases);
  const [currentCase, setCurrentCase] = useState<number>(1);

  return (
    <div className="flex flex-col">
      <div className="flex gap-3 p-2">
        {testCases.map((testCase, index) => (
          <div
            key={index}
            className={`${
              currentCase === testCase.id
                ? "bg-[#3C3C3C]  rounded-md cursor-default"
                : "cursor-pointer"
            } px-2 py-1`}
            onClick={() => {
              if (currentCase !== testCase.id) {
                setCurrentCase(testCase.id);
              }
            }}
          >
            {"Case " + testCase.id}
          </div>
        ))}
      </div>
      <div className="px-3">
        {testCases
          .filter((case_) => case_.id === currentCase)[0]
          .var.map((variable, index) => (
            <div key={index}>
              <p className="text-[13px] mb-1">{variable.name + " = "}</p>
              <div className="p-3 bg-[#3C3C3C] rounded-lg">
                {variable.type === "string"
                  ? '"' + variable.value + '"'
                  : variable.value}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RightInput;
