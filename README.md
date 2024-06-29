# How to add any new problem

## Step 1:

### Generate the problem structure (No need to write the function for every language)

## How to Define the Input and output field

```
int
float
char
string
double
vector<int>
vector<char>
vector<bool>
vector<string>
vector<long>
vector<long long>
vector<float>
vector<double>
vector<vector<int>>
vector<vector<long>>
vector<vector<long long>>
vector<vector<char>>
vector<vector<bool>>
vector<vector<string>>
vector<vector<float>>
vector<vector<double>>
```

## How structure.md should look like

```
Problem Name: "Max Pair Sum"
Function Name: "maxPairSum"
Input Structure:
Input Field: vector<int> arr
Output Structure:
Output Field: int

```

### For multiple input

```
Just add the new line with inputField
Problem Name: "Max Pair Sum"
Function Name: "maxPairSum"
Input Structure:
Input Field: int n
Input Field: vector<vector<int>> temp
Output Structure:
Output Field: string
```

## Step 2:

### How to write the problem description

````

# 1.Maximum pair sum (Write the problem name)

&nbsp;

#### (write problem description) Given an array of numbers, find the maximum pair sum of the given array.And we can not use the same element twice.

&nbsp;

**Example 1:**

&nbsp;

**Input**

```code2
[1, 2, 3, 4, 5, 4, 12, 4]
````

&nbsp;

**Output**

```
17
```

&nbsp;

**Example 2:**

&nbsp;

**Input**

```
[1, 100, 12 ,50, 90, 12]
```

&nbsp;

**Output**

```
190
```

&nbsp;

### Constraints

&nbsp;

- 1 <= n <= 10^5

  &nbsp;

- -10^9 <= A[i] <= 10^9

  &nbsp;

```

```

## After defining the problem structure and problem description now you have to generate the boilerplate and full boilerplate for the problem.

## How to generate boilerplate

```
Go to directory = logiclab/boilerPlateGenerator/src

npx ts-node generateCode.ts "../../problems/Longest-Palindrome-Substring"
npx ts-node generateCode.ts "../../problems/{Enter your new added problem folder name}"

By running this command a new folder name as boilerplate is generated which contains boilerplate for the different languages.

```
