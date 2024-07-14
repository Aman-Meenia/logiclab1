import LoginButton from "@/components/session/LoginButton";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-3 flex flex-col gap-3 items-center">
      <h1>Home Page</h1>
      <div>
        <LoginButton />
      </div>
      <div className="editor m-4 text-center">
        <Link href="/editor">Editor Page</Link>
      </div>
    </div>
  );
}
