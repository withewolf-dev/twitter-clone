import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
  SwitchHorizontalIcon as SwitchIconFilled,
} from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import firestore from "../firebaseinit";
import { selectPost, setModal, setPostId } from "../slice/post-slice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

interface Props {
  postPage?: boolean;
  id: string;
  post: any;
}

const Post = ({ postPage, post, id }: Props) => {
  const { data: session } = useSession();

  const select = useAppSelector(selectPost);
  const dispatch = useAppDispatch();

  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [rt, setrt] = useState(false);
  const [retweets, setretweets] = useState([]);
  const [rtId, setrtId] = useState();
  const router = useRouter();

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(firestore, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [firestore, id]
  );

  useEffect(
    () =>
      onSnapshot(collection(firestore, "posts", id, "likes"), (snapshot) => {
        setLikes(snapshot.docs);
      }),
    [firestore, id]
  );

  useEffect(
    () =>
      onSnapshot(collection(firestore, "posts", id, "retweets"), (snapshot) => {
        var temp = [];
        snapshot.docs.forEach((doc) => {
          temp.push({ id: doc.id, ...doc.data() });
        });
        setretweets(temp);
      }),
    [firestore, id]
  );

  useEffect(
    () =>
      setLiked(
        likes.findIndex((like) => like.id === session?.user[`uid`]) !== -1
      ),
    [likes]
  );

  useEffect(() => {
    setrt(retweets.findIndex((rts) => rts.id === session?.user[`uid`]) !== -1);
    retweets.findIndex((rts) => {
      if (rts.id === session?.user[`uid`]) {
        setrtId(rts.tweetId);
      }
    });
  }, [retweets]);

  const likePost = async () => {
    if (liked) {
      await deleteDoc(
        doc(firestore, "posts", id, "likes", session.user[`uid`])
      );
    } else {
      await setDoc(doc(firestore, "posts", id, "likes", session.user[`uid`]), {
        username: session.user.name,
      });
    }
  };

  const rtPost = async () => {
    if (rt || post?.rtweeterId === session.user[`uid`]) {
      if (post?.rt) {
        // post delete doc.id
        await deleteDoc(doc(firestore, "posts", post?.rtPostId));

        await deleteDoc(
          doc(firestore, "posts", post?.id, "retweets", post?.rtweeterId)
        );
      } else {
        await deleteDoc(doc(firestore, "posts", rtId));

        await deleteDoc(
          doc(firestore, "posts", id, "retweets", session.user[`uid`])
        );
      }
    } else {
      const newDocRef = doc(collection(firestore, "posts"));

      await setDoc(
        doc(firestore, "posts", id, "retweets", session.user[`uid`]),
        {
          username: session.user.name,
          tweetId: newDocRef.id,
        }
      );
      await setDoc(doc(firestore, "posts", newDocRef.id), {
        rtweeter: session.user.name,
        rtweeterId: session.user[`uid`],
        id,
        rt: true,
        rtPostId: newDocRef.id,
        image: post?.image || "",
        tag: post?.tag,
        text: post?.text,
        timestamp: serverTimestamp(),
        userImg: post?.userImg,
        username: post?.username,
      });
    }
  };

  return (
    <>
      {post?.rtweeterId === session.user[`uid`] && (
        <div className=" p-2 flex  items-center">
          <SwitchHorizontalIcon className="h-4 text-gray-500" />
          <p className="text-sm text-gray-500"> You Retweeted</p>
        </div>
      )}
      {post?.rtweeterId !== session.user[`uid`] && post?.rt && (
        <div className=" p-2 flex  items-center">
          <SwitchHorizontalIcon className="h-4 text-gray-500" />
          <p className="text-sm text-gray-500"> {post?.username} Retweeted</p>
        </div>
      )}
      <div
        className="p-2 w-[570px] flex cursor-pointer border-b border-gray-700"
        onClick={() => router.push(`/${id}`)}
      >
        {!postPage && (
          <img
            src={post?.userImg}
            alt=""
            className="h-11 w-11 rounded-full mr-4"
          />
        )}
        <div className="flex flex-col space-y-2 w-full">
          <div className={`flex ${!postPage && "justify-between"}`}>
            {postPage && (
              <img
                src={post?.userImg}
                alt="Profile Pic"
                className="h-11 w-11 rounded-full mr-4"
              />
            )}
            <div className="text-[#6e767d]">
              <div className="inline-block group">
                <h4
                  className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${
                    !postPage && "inline-block"
                  }`}
                >
                  {post?.username}
                </h4>
                <span
                  className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}
                >
                  @{post?.tag}
                </span>
              </div>
              ·{" "}
              <span className="hover:underline text-sm sm:text-[15px]">
                <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
              </span>
              {!postPage && (
                <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                  {post?.text}
                </p>
              )}
            </div>
            <div className="icon group flex-shrink-0 ml-auto">
              <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
            </div>
          </div>
          {postPage && (
            <p className="text-[#d9d9d9] mt-0.5 text-xl">{post?.text}</p>
          )}
          <img
            src={post?.image}
            alt=""
            className="rounded-2xl max-h-[700px] object-cover mr-2"
          />
          <div
            className={`text-[#6e767d] flex justify-between w-10/12 ${
              postPage && "mx-auto"
            }`}
          >
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setModal(true));
                dispatch(setPostId(id));
              }}
            >
              <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
                <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
              </div>
              {comments.length > 0 && (
                <span className="group-hover:text-[#1d9bf0] text-sm">
                  {comments.length}
                </span>
              )}
            </div>

            {session.user[`uid`] === post?.id ? (
              <div
                className="flex items-center space-x-1 group"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDoc(doc(firestore, "posts", id));
                  router.push("/");
                }}
              >
                <div className="icon group-hover:bg-red-600/10">
                  <TrashIcon className="h-5 group-hover:text-red-600" />
                </div>
              </div>
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  rtPost();
                }}
                className="flex items-center space-x-1 group"
              >
                <div className="icon group-hover:bg-green-500/10">
                  {rt || post?.rtweeterId === session.user[`uid`] ? (
                    <SwitchHorizontalIcon className="h-5 text-green-500" />
                  ) : (
                    <SwitchIconFilled className="h-5 group-hover:text-green-500" />
                  )}
                </div>
                {retweets.length > 0 && (
                  <span
                    className={`group-hover:text-green-600 text-sm ${
                      retweets && "text-green-600"
                    }`}
                  >
                    {retweets.length}
                  </span>
                )}
              </div>
            )}

            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                likePost();
              }}
            >
              <div className="icon group-hover:bg-pink-600/10">
                {liked ? (
                  <HeartIconFilled className="h-5 text-pink-600" />
                ) : (
                  <HeartIcon className="h-5 group-hover:text-pink-600" />
                )}
              </div>
              {likes.length > 0 && (
                <span
                  className={`group-hover:text-pink-600 text-sm ${
                    liked && "text-pink-600"
                  }`}
                >
                  {likes.length}
                </span>
              )}
            </div>

            <div className="icon group">
              <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            <div className="icon group">
              <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
