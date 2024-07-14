import React from "react";

const LeftContent = () => {
  return (
    <div className="bg-[#212121] rounded-b-sm h-full p-3 text-white tracking-wide leading-normal">
      <h2 className="text-[20px] font-bold">345. Reverse Vowels of a String</h2>
      <div className="tags py-2.5">
        <span className="tag text-[12px] bg-[#3C3C3C] py-1 px-2 rounded-2xl text-[#449C6B]">
          Easy
        </span>
        <span className="tag text-[12px] bg-[#3C3C3C] py-1 px-2 rounded-2xl text-[#fed455] ml-2">
          Strings
        </span>
      </div>
      <div className="statement text-[14px] my-3">
        <p className="mb-3">
          Given a string s, reverse only all the vowels in the string and return
          it.
        </p>
        <p className="mb-3">
          The vowels are {"'a', 'e', 'i', 'o', and 'u'"}, and they can appear in
          both lower and upper cases, more than once.
        </p>
      </div>
      <div className="examples my-10 text-[14px]">
        <div className="py-3">
          <h3 className="font-bold">Example 1:</h3>
          <p className="px-4 pt-3 text-slate-300 tracking-wider">
            <span className="font-bold text-white">{`Input:`} </span>
            {` s = "hello"`}
          </p>
          <p className="px-4 pt-1 text-slate-300 tracking-wider">
            <span className="font-bold text-white">{`Output:`} </span>
            {` "holle"`}
          </p>
        </div>
        <div className="py-3">
          <h3 className="font-bold">Example 2:</h3>
          <p className="px-4 pt-3 text-slate-300 tracking-wider">
            <span className="font-bold text-white">{`Input:`} </span>
            {` s = "coder"`}
          </p>
          <p className="px-4 pt-1 text-slate-300 tracking-wider">
            <span className="font-bold text-white">{`Output:`} </span>
            {` "cedor"`}
          </p>
        </div>
      </div>
      <div className="constraints py-3 text-[14px]">
        <h3 className="font-bold mb-3">Constraints:</h3>
        <ul className="list-disc px-5 text-slate-300 ">
          <li className="mb-2.5">{"1 <= s.length <= 3 * 105"}</li>
          <li className="mb-2.5">
            {"s consist of printable ASCII characters."}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftContent;
