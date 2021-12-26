import Head from "next/head";
import { Feed } from "../components/Feed";
import SideBar from "../components/SideBar";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Twitter clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <SideBar />
        <Feed />
      </main>
    </div>
  );
}
