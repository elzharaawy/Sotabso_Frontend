import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      blog_id,
      title,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    islikedByUser,
    setLikedByUser,
    commentsWrapper,
    setCommentsWrapper,
  } = useContext(BlogContext);

  let {
    userAuth: { username, access_token },
  } = useContext(UserContext);

  const handleLike = () => {
    if (access_token) {
      // optimistic update
      setLikedByUser((preVal) => !preVal);
      !islikedByUser ? total_likes++ : total_likes--;

      setBlog({ ...blog, activity: { ...activity, total_likes } });

      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/like-blog",
          { _id, islikedByUser },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        )
        .then(({ data: { liked_by_user } }) => {
          setLikedByUser(Boolean(liked_by_user));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("please login to like this blog");
    }
  };

  useEffect(() => {
    if (access_token) {
      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user",
          { _id },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        )
        .then(({ data: { result } }) => {
          setLikedByUser(Boolean(result));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            onClick={handleLike}
            className={
              "w-10 h-10 rounded-full flex items-center justify-center " +
              (islikedByUser ? "bg-red/20 text-red" : "bg-grey/80")
            }
          >
            <i
              className={
                "fi " + (islikedByUser ? "fi-sr-heart" : "fi-rr-heart")
              }
            ></i>
          </button>

          <p className="text-xl text-dark-grey">{total_likes}</p>

          <button
            onClick={() => setCommentsWrapper((preVal) => !preVal)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
          >
            <i className="fi fi-rr-comment-dots"></i>
          </button>

          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username === author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-purple"
            >
              Edit
            </Link>
          ) : (
            ""
          )}

          {/* Twitter */}
          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
            target="_blank"
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>

          {/* Facebook */}
          <Link
            to={`https://www.facebook.com/sharer/sharer.php?u=${location.href}`}
            target="_blank"
          >
            <i className="fi fi-brands-facebook text-xl hover:text-twitter"></i>
          </Link>

          {/* Telegram */}
          <Link
            to={`https://t.me/share/url?url=${location.href}&text=Read ${title}`}
            target="_blank"
          >
            <i className="fi fi-brands-telegram text-xl hover:text-twitter"></i>
          </Link>

          {/* Copy Link */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(location.href);
              toast.success("Link copied!");
            }}
          >
            <i className="fi fi-rr-link text-xl hover:text-twitter"></i>
          </button>
        </div>
      </div>

      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
