import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field.component";
import axios from "axios";
import NoDataMessage from "./nodata.component";
import AnimationWrapper from "../common/page-animation";
import CommentCard from "./comment-card.component";

/**
 * Fetch comments from backend
 */
export const fetchComments = async ({ skip = 0, blog_id }) => {
  let res = [];

  await axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", {
      blog_id,
      skip,
    })
    .then(({ data }) => {
      data.map((comment) => {
        comment.childrenLevel = 0;
      });
      res = data;
    });

  return res;
};

const CommentsContainer = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      comments: { results: commentsArr },
      // ✅ commentsArr already comes from context (DO NOT redeclare later)
      activity: { total_parent_comments },
    },
    commentsWrapper,
    setCommentsWrapper,
    totalParentCommentsLoaded,
    setTotalParentCommentsLoaded,
    setBlog,
  } = useContext(BlogContext);

  const loadMoreComments = async () => {
    let newCommentsArr = await fetchComments({
      skip: totalParentCommentsLoaded, // ✅ pagination works using skip
      blog_id: _id,
      // ❌ below two params are unused in fetchComments (safe but unnecessary)
      setParentCommentCountFun: setTotalParentCommentsLoaded,
      comment_array: commentsArr,
    });

    // ❌ ISSUE: This REPLACES comments instead of appending
    // setBlog({ ...blog, comments: newCommentsArr });

    // ✅ FIX: append new comments to existing ones
    setBlog((prev) => ({
      ...prev,
      comments: {
        ...prev.comments,
        results: [...prev.comments.results, ...newCommentsArr],
      },
    }));

    // ✅ update loaded count so "Load More" button hides correctly
    setTotalParentCommentsLoaded((prev) => prev + newCommentsArr.length);
  };

  // ❌ ISSUE: commentsArr is ALREADY declared above via context
  // ❌ This line causes redeclaration / shadowing bug
  // let commentsArr = comments?.results || [];

  // ✅ Initial comments load
  useEffect(() => {
    if (!_id) return;

    fetchComments({ blog_id: _id }).then((data) => {
      setBlog((prev) => ({
        ...prev,
        comments: {
          ...prev.comments,
          results: data,
        },
      }));

      // ✅ initialize loaded comments count
      setTotalParentCommentsLoaded(data.length);
    });
  }, [_id]);

  return (
    <div
      className={
        "max-sm:w-full fixed " +
        (commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") +
        " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto"
      }
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comments</h1>
        <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">
          {title}
        </p>
        <button
          onClick={() => setCommentsWrapper((prev) => !prev)}
          className="absolute top-0 right-0 w-12 h-12 rounded-full bg-grey flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      <hr className="border-grey my-8 w-[120%] -ml-10" />

      <CommentField action="comment" />

      {commentsArr?.length ? (
        commentsArr.map((comment, i) => (
          <AnimationWrapper key={i}>
            <CommentCard
              index={i}
              leftVal={comment.childrenLevel * 4}
              commentData={comment}
            />
          </AnimationWrapper>
        ))
      ) : (
        <NoDataMessage message="No Comments" />
      )}

      {/* ✅ Load More button logic is correct */}
      {total_parent_comments > totalParentCommentsLoaded ? (
        <button
          onClick={loadMoreComments}
          className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
        >
          Load More
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default CommentsContainer;
