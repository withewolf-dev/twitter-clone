import Head from "next/head";
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
      </main>
    </div>
  );
}
