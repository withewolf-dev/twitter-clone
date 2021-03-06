import {
  getProviders,
  getSession,
  GetSessionParams,
  useSession,
} from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import { Feed } from "../components/Feed";
import Login from "../components/Login";
import Modal from "../components/Modal";
import SideBar from "../components/SideBar";
import Widgets from "../components/Widget";
import { selectPost, setSession } from "../slice/post-slice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function Home({ trendingResults, followResults, providers }) {
  const { data: session } = useSession();

  const select = useAppSelector(selectPost);

  const dispatch = useAppDispatch();

  if (!session) return <Login providers={providers} />;

  return (
    <div>
      <Head>
        <title>Twitter clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <SideBar />
        <Feed />
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />
        {select.modal && <Modal />}
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetSessionParams) {
  const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  );
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      trendingResults,
      followResults,
      providers,
      session,
    },
  };
}
