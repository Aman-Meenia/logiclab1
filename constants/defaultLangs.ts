const JsStarterCode: string = `function helloWorld() {
    return "Hello, Coder!";
}

console.log(helloWorld());
`;

const CppStarterCode: string = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Coder!" << endl;
    return 0;
}
`;

const PythonStarterCode: string = `def hello_world():
    return "Hello, Coder!"

print(hello_world())
`;

const JavaStarterCode: string = `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Coder!");
    }
}
`;

interface Lang {
  name: string;
  language: string;
  value: string;
  key: string;
}

const langs: { [key: string]: Lang } = {
  js: {
    name: "javascript",
    language: "Javascript",
    value: JsStarterCode,
    key: "js",
  },
  cpp: {
    name: "cpp",
    language: "C++",
    value: CppStarterCode,
    key: "cpp",
  },
  py: {
    name: "python",
    language: "Python",
    value: PythonStarterCode,
    key: "py",
  },
  java: {
    name: "java",
    language: "Java",
    value: JavaStarterCode,
    key: "java",
  },
};

export default langs;
