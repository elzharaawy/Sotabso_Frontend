import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { useEffect, useState } from "react";
import axios from "axios";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import Loader from "../components/loader.component";

const HomePage = () => {
  const [trendingBlogs, setTrendingBlogs] = useState(null);

  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs.slice(0, 3)); // Get only top 3
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchTrendingBlogs();
  }, []);

  return (
    <AnimationWrapper>
      {/* Hero Section */}
      <section className="h-cover flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Welcome to Our Blog
        </h1>
        <p className="text-xl md:text-2xl text-dark-grey max-w-2xl mb-8">
          Discover stories, thinking, and expertise from writers on any topic
        </p>
        <Link to="/blogs" className="btn-dark px-8 py-4 text-lg">
          Start Reading
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-grey/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Read With Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                <i className="fi fi-rr-bulb text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Diverse Topics</h3>
              <p className="text-dark-grey">
                From tech to travel, cooking to finance - explore a wide range
                of topics
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                <i className="fi fi-rr-users text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Writers</h3>
              <p className="text-dark-grey">
                Read insights from passionate writers and industry experts
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                <i className="fi fi-rr-refresh text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fresh Content</h3>
              <p className="text-dark-grey">
                New articles published regularly to keep you informed and
                inspired
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              Trending Now <i className="fi fi-rr-arrow-trend-up"></i>
            </h2>
            <Link
              to="/blogs"
              className="text-dark-grey hover:text-black transition-colors flex items-center gap-2"
            >
              View all blogs <i className="fi fi-rr-arrow-right"></i>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {trendingBlogs == null ? (
              <div className="col-span-3 flex justify-center py-12">
                <Loader />
              </div>
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => (
                <AnimationWrapper
                  key={i}
                  transition={{ duration: 1, delay: i * 0.1 }}
                >
                  <div className="border border-grey rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <MinimalBlogPost blog={blog} index={i} />
                  </div>
                </AnimationWrapper>
              ))
            ) : (
              <p className="col-span-3 text-center text-dark-grey">
                No trending posts yet
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-80">
            Join thousands of readers discovering new perspectives every day
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/blogs" className="btn-light px-8 py-4 text-lg">
              Explore Blogs
            </Link>
            <Link to="/signin" className="btn-dark px-8 py-4 text-lg">
              Sign Up
            </Link>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
