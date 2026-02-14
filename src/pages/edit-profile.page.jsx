import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { profileDataStructure } from "./profile.page";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { toast, Toaster } from "react-hot-toast";
import InputBox from "../components/input.component";
import { uploadImage } from "../common/upload";
import { storeInSession } from "../common/session";

const EditProfile = () => {
  const {
    userAuth,
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const bioLimit = 150;
  const profileImgEle = useRef();
  const editProfileForm = useRef();

  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [charactersLeft, setCharactersLeft] = useState(bioLimit);
  const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

  const {
    personal_info: {
      fullname,
      username: profile_username,
      profile_img,
      email,
      bio,
    },
    social_links,
  } = profile;

  useEffect(() => {
    if (!access_token) return;

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        username: userAuth.username,
      })
      .then(({ data }) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(console.log);
  }, [access_token]);

  const handleCharacterChange = (e) => {
    setCharactersLeft(bioLimit - e.target.value.length);
  };

  const handleImagePreview = (e) => {
    const img = e.target.files?.[0];
    if (!img) return;

    profileImgEle.current.src = URL.createObjectURL(img);
    setUpdatedProfileImg(img);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!updatedProfileImg) return;

    const loadingToast = toast.loading("Uploading...");

    try {
      const url = await uploadImage(updatedProfileImg);

      if (!url) {
        toast.error("Upload failed");
        return;
      }

      await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img",
        { profile_img: url },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      setProfile((prev) => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          profile_img: url,
        },
      }));

      toast.success("Profile image updated 👍");
      setUpdatedProfileImg(null);
    } catch (err) {
      console.log(err);
      toast.error("Upload failed");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(editProfileForm.current);
    const formData = {};

    for (const [key, value] of form.entries()) {
      formData[key] = value;
    }

    const {
      username,
      bio,
      youtube,
      facebook,
      twitter,
      github,
      instagram,
      website,
    } = formData;

    if (username.length < 3) {
      return toast.error("Username should be at least 3 letters long");
    }

    if (bio.length > bioLimit) {
      return toast.error(`Bio should not be more than ${bioLimit}`);
    }

    const loadingToast = toast.loading("Updating...");
    e.target.setAttribute("disabled", true);

    axios
      .post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/update-profile`,
        {
          username,
          bio,
          social_links: {
            youtube,
            facebook,
            twitter,
            github,
            instagram,
            website,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      )
      .then(({ data }) => {
        if (userAuth.username !== data.username) {
          const newUserAuth = {
            ...userAuth,

            username: data.username,
          };

          storeInSession("user", JSON.stringify(newUserAuth));
          setUserAuth(newUserAuth);
        }

        toast.success("Profile Updated");
      })
      .catch(({ response }) => {
        toast.error(response?.data?.error || "Update failed");
      })
      .finally(() => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
      });
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <form ref={editProfileForm}>
          <Toaster />

          <h1 className="max-md:hidden">Edit Profile</h1>

          <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
            <div className="max-lg:center mb-5">
              <label
                htmlFor="uploadImg"
                className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
              >
                <div className="w-full h-full absolute inset-0 flex items-center justify-center text-white bg-black/40 opacity-0 hover:opacity-100 cursor-pointer">
                  Upload Image
                </div>

                <img ref={profileImgEle} src={profile_img} />
              </label>

              <input
                type="file"
                id="uploadImg"
                accept=".jpeg,.jpg,.png"
                hidden
                onChange={handleImagePreview}
              />

              <button
                type="button"
                onClick={handleImageUpload}
                className="btn-light mt-5 max-lg:center lg:w-full px-10"
              >
                Upload
              </button>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <InputBox
                  name="fullname"
                  type="text"
                  value={fullname}
                  placeholder="Full Name"
                  disabled
                  icon="fi-rr-user"
                />

                <InputBox
                  name="email"
                  type="email"
                  value={email}
                  placeholder="Email"
                  disabled
                  icon="fi-rr-envelope"
                />
              </div>

              <InputBox
                type="text"
                name="username"
                value={profile_username}
                placeholder="Username"
                icon="fi-rr-at"
              />

              <textarea
                name="bio"
                maxLength={bioLimit}
                defaultValue={bio}
                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
                placeholder="Bio"
                onChange={handleCharacterChange}
              />

              <p className="mt-1 text-dark-grey">
                {charactersLeft} characters left
              </p>

              <div className="md:grid md:grid-cols-2 gap-x-6 mt-6">
                {Object.keys(social_links).map((key, i) => (
                  <InputBox
                    key={i}
                    name={key}
                    type="text"
                    value={social_links[key]}
                    placeholder="https://"
                    icon={
                      "fi " +
                      (key !== "website" ? "fi-brands-" + key : "fi-rr-globe")
                    }
                  />
                ))}
              </div>
              <button
                className="btn-dark w-auto px-10"
                type="submit"
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </AnimationWrapper>
  );
};

export default EditProfile;
