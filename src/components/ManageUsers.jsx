import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";

const ManageUsers = () => {
  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/get-users", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(({ data }) => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch users");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAdmin = (userId, currentAdminStatus) => {
    const loadingToast = toast.loading(
      currentAdminStatus
        ? "Removing admin access..."
        : "Granting admin access...",
    );

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/toggle-admin",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      )
      .then(({ data }) => {
        toast.dismiss(loadingToast);
        toast.success(data.message);

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? { ...user, admin: !currentAdminStatus }
              : user,
          ),
        );
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        toast.error(err.response?.data?.error || "Failed to update user role");
      });
  };

  const UserCard = ({ user }) => {
    const {
      personal_info: { fullname, username, profile_img },
      admin,
      _id,
      joinedAt,
    } = user;

    return (
      <AnimationWrapper>
        <div className="flex gap-5 lg:gap-8 mb-6 pb-6 border-b border-grey items-center">
          <img
            src={profile_img}
            alt={username}
            className="w-14 h-14 flex-none rounded-full"
          />

          <div className="flex-1 flex flex-col gap-1">
            <h1 className="font-medium text-xl line-clamp-1">{fullname}</h1>
            <p className="text-dark-grey line-clamp-1">@{username}</p>
            <p className="text-dark-grey text-sm">
              Joined {new Date(joinedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                admin ? "bg-purple/10 text-purple" : "bg-grey/50 text-dark-grey"
              }`}
            >
              {admin ? "Admin" : "User"}
            </span>

            <button
              className={`btn-light py-2 px-4 ${
                admin ? "text-red" : "text-purple"
              }`}
              onClick={() => handleToggleAdmin(_id, admin)}
            >
              {admin ? "Remove Admin" : "Make Admin"}
            </button>
          </div>
        </div>
      </AnimationWrapper>
    );
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.personal_info.fullname.toLowerCase().includes(query.toLowerCase()) ||
      user.personal_info.username.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <Toaster />
      <h1 className="max-md:hidden text-2xl font-medium mb-8">Manage Users</h1>

      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder="Search users by name or username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      {loading ? (
        <Loader />
      ) : filteredUsers && filteredUsers.length ? (
        <InPageNavigation
          routes={[
            "All Users",
            `Admins (${users.filter((u) => u.admin).length})`,
          ]}
          defaultHidden={["Admins"]}
        >
          <>
            {filteredUsers.map((user, i) => (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            ))}
          </>

          <>
            {filteredUsers
              .filter((user) => user.admin)
              .map((user, i) => (
                <AnimationWrapper
                  key={i}
                  transition={{ duration: 1, delay: i * 0.08 }}
                >
                  <UserCard user={user} />
                </AnimationWrapper>
              ))}
          </>
        </InPageNavigation>
      ) : (
        <NoDataMessage message="No users found" />
      )}
    </>
  );
};

export default ManageUsers;
