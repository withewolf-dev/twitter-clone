import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Post from "../components/Post";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import Head from "next/head";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectPost } from "../slice/post-slice";
import firestore from "../firebaseinit";
import Login from "../components/Login";
import SideBar from "../components/SideBar";
import Comment from "../components/Comment";
import Widgets from "../components/Widget";

function PostPage({ trendingResults, followResults, providers }) {
  const { data: session } = useSession();
  const [post, setPost] = useState<any>();
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  const select = useAppSelector(selectPost);
  const dispatch = useAppDispatch();

  useEffect(
    () =>
      onSnapshot(doc(firestore, "posts", id.toLocaleString()), (snapshot) => {
        setPost(snapshot.data());
      }),
    [firestore]
  );

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(firestore, "posts", id.toLocaleString(), "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [firestore, id]
  );

  if (!session) return <Login providers={providers} />;

  return (
    <div>
      <Head>
        <title>
          {post?.username} on Twitter: "{post?.text}"
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <SideBar />
        <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <div
              className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 text-white" />
            </div>
            Tweet
          </div>

          <Post id={id.toLocaleString()} post={post} postPage />
          {comments.length > 0 && (
            <div className="pb-72">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  id={comment.id}
                  comment={comment.data()}
                />
              ))}
            </div>
          )}
        </div>
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />

        {select.postId && <Modal />}
      </main>
    </div>
  );
}

export default PostPage;

export async function getServerSideProps(context) {
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
      //session,
    },
  };
}
