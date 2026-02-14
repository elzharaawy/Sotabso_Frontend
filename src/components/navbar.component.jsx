import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import darkLogo from "../imgs/logo-dark.png";
import lightLogo from "../imgs/logo-light.png";
import { ThemeContext, UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";
import axios from "axios";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let { theme, setTheme } = useContext(ThemeContext);
  let navigate = useNavigate();

  const {
    userAuth,
    userAuth: {
      access_token,
      profile_img,
      new_notification_available,
      isAdmin,
    },
    setUserAuth,
  } = useContext(UserContext);

  const changeTheme = () => {
    let newTheme = theme == "light" ? "dark" : "light";

    setTheme(newTheme);

    document.body.setAttribute("data-theme", newTheme);

    storeInSession("theme", newTheme);
  };

  useEffect(() => {
    if (access_token) {
      axios
        .get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(({ data }) => {
          setUserAuth({ ...userAuth, ...data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [access_token]);

  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  const handleSearch = (e) => {
    let query = e.target.value;

    if (e.keyCode == 13 && query.length) {
      navigate(`/search/${query}`);
      setSearchBoxVisibility(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar z-50">
        <Link to="/" className="flex-none w-10">
          <img
            src={theme == "light" ? darkLogo : lightLogo}
            className="w-full"
            alt="Logo"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 ml-8">
          <Link to="/" className="link">
            Home
          </Link>
          <Link to="/blogs" className="link">
            Blogs
          </Link>
          <Link to="/about" className="link">
            About
          </Link>
          <Link to="/contact" className="link">
            Contact
          </Link>
        </div>

        {/* Search Box */}
        <div
          className={
            "absolute bg-white w-full left-0 top-full mt-0 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleSearch}
          />

          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
          >
            <i className="fi fi-rr-search text-xl"></i>
          </button>

          {isAdmin ? (
            <Link to="/editor" className="hidden md:flex gap-2 link">
              <i className="fi fi-rr-file-edit"></i>
              <p>Write</p>
            </Link>
          ) : (
            ""
          )}

          <button
            className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10"
            onClick={changeTheme}
          >
            <i
              className={
                "fi fi-bs-" +
                (theme == "light" ? "moon-stars" : "brightness") +
                " text-2xl block mt-1"
              }
            ></i>
          </button>

          {access_token ? (
            <>
              <Link to="/dashboard/notifications">
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                  <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                  {new_notification_available ? (
                    <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                  ) : (
                    ""
                  )}
                </button>
              </Link>

              <div
                className="relative"
                onClick={handleUserNavPanel}
                onBlur={handleBlur}
              >
                <button className="w-12 h-12 mt-1">
                  <img
                    src={profile_img}
                    className="w-full h-full object-cover rounded-full"
                    alt="Profile"
                  />
                </button>

                {userNavPanel ? <UserNavigationPanel /> : ""}
              </div>
            </>
          ) : (
            <>
              <Link className="btn-dark py-2" to="/signin">
                Sign In
              </Link>
              <Link className="btn-light py-2 hidden md:block" to="/signup">
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setMobileMenuOpen((currentVal) => !currentVal)}
          >
            <i
              className={
                "fi text-xl " +
                (mobileMenuOpen ? "fi-rr-cross" : "fi-rr-menu-burger")
              }
            ></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <div
        className={
          "md:hidden fixed top-[80px] right-0 w-full bg-white border-b border-grey z-40 transition-all duration-300 " +
          (mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none -translate-y-4")
        }
      >
        <div className="flex flex-col p-6 gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 hover:bg-grey rounded-lg transition-colors"
            onClick={handleMobileMenuClick}
          >
            <i className="fi fi-rr-home text-xl"></i>
            <span className="text-lg">Home</span>
          </Link>

          <Link
            to="/blogs"
            className="flex items-center gap-3 p-3 hover:bg-grey rounded-lg transition-colors"
            onClick={handleMobileMenuClick}
          >
            <i className="fi fi-rr-document text-xl"></i>
            <span className="text-lg">Blogs</span>
          </Link>

          <Link
            to="/about"
            className="flex items-center gap-3 p-3 hover:bg-grey rounded-lg transition-colors"
            onClick={handleMobileMenuClick}
          >
            <i className="fi fi-rr-info text-xl"></i>
            <span className="text-lg">About</span>
          </Link>

          <Link
            to="/contact"
            className="flex items-center gap-3 p-3 hover:bg-grey rounded-lg transition-colors"
            onClick={handleMobileMenuClick}
          >
            <i className="fi fi-rr-envelope text-xl"></i>
            <span className="text-lg">Contact</span>
          </Link>

          {isAdmin && (
            <Link
              to="/editor"
              className="flex items-center gap-3 p-3 hover:bg-grey rounded-lg transition-colors"
              onClick={handleMobileMenuClick}
            >
              <i className="fi fi-rr-file-edit text-xl"></i>
              <span className="text-lg">Write</span>
            </Link>
          )}

          {access_token ? (
            <>
              {isAdmin ? (
                <Link
                  to="/dashboard/blogs"
                  className="flex items-center gap-3 p-3 hover:bg-grey rounded-lg transition-colors"
                  onClick={handleMobileMenuClick}
                >
                  <i className="fi fi-rr-dashboard text-xl"></i>
                  <span className="text-lg">Dashboard</span>
                </Link>
              ) : (
                ""
              )}
              <Link
                to="/settings/edit-profile"
                className="flex items-center gap-3 p-3 hover:bg-grey rounded-lg transition-colors"
                onClick={handleMobileMenuClick}
              >
                <i className="fi fi-rr-settings text-xl"></i>
                <span className="text-lg">Settings</span>
              </Link>
            </>
          ) : (
            <Link
              to="/signup"
              className="btn-dark py-3 text-center mt-2"
              onClick={handleMobileMenuClick}
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-30 top-[80px]"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <Outlet />
    </>
  );
};

export default Navbar;
