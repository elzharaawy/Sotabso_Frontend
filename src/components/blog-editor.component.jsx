// blog-editor.component.jsx
import { Link, useNavigate, useParams } from "react-router-dom";
import darkLogo from "../imgs/logo-dark.png";
import lightLogo from "../imgs/logo-light.png";
import AnimationWrapper from "../common/page-animation";
import lightBanner from "../imgs/blog banner light.png";
import darkBanner from "../imgs/blog banner dark.png";
import { useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import { uploadImage, deleteImage } from "../common/upload";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import axios from "axios";
import { ThemeContext, UserContext } from "../App";

const BlogEditor = () => {
  const {
    blog,
    blog: { title, banner, content, tags, des, banner_public_id },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  const { theme } = useContext(ThemeContext);
  const { blog_id } = useParams();
  const navigate = useNavigate();

  // Initialize EditorJS
  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holderId: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
          placeholder: "Let's write an awesome story",
        }),
      );
    }
  }, []);

  // ─── Banner Upload ──────────────────────────────────────────────────────────
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const loadingToast = toast.loading("Uploading banner...");

    try {
      // Delete old banner from Cloudinary if it exists
      // deleteImage never throws — returns false silently on failure
      if (banner_public_id) {
        await deleteImage(banner_public_id);
      }

      // uploadImage returns { url, public_id, width, height, format }
      const result = await uploadImage(file);

      if (!result?.url) {
        throw new Error("Upload failed - no URL returned");
      }

      // Functional update prevents stale state
      setBlog((prev) => ({
        ...prev,
        banner: result.url,
        banner_public_id: result.public_id,
      }));

      toast.success("Banner uploaded! 🎉");
    } catch (error) {
      console.error("Banner upload error:", error);
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      toast.dismiss(loadingToast);
      // Reset so the same file can be re-selected if needed
      e.target.value = "";
    }
  };

  // ─── Title ─────────────────────────────────────────────────────────────────
  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const handleTitleChange = (e) => {
    const input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog((prev) => ({ ...prev, title: input.value }));
  };

  const handleError = (e) => {
    e.currentTarget.src = theme === "light" ? lightBanner : darkBanner;
  };

  // ─── Publish ───────────────────────────────────────────────────────────────
  const handlePublishEvent = () => {
    if (!banner?.length) {
      return toast.error("Upload a blog banner to publish it");
    }
    if (!title.length) {
      return toast.error("Write blog title to publish it");
    }

    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog((prev) => ({ ...prev, content: data }));
            setEditorState("publish");
          } else {
            toast.error("Write something in your blog to publish it");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to save editor content");
        });
    }
  };

  // ─── Save Draft ────────────────────────────────────────────────────────────
  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) return;

    if (!title.length) {
      return toast.error("Write blog title before saving it as a draft");
    }

    const loadingToast = toast.loading("Saving Draft...");
    e.target.classList.add("disable");

    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        const blogObj = {
          title,
          banner,
          banner_public_id,
          des,
          content,
          tags,
          draft: true,
        };

        axios
          .post(
            import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",
            { ...blogObj, id: blog_id },
            { headers: { Authorization: `Bearer ${access_token}` } },
          )
          .then(() => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            toast.success("Saved 👍");
            setTimeout(() => navigate("/dashboard/blogs?tab=draft"), 500);
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            toast.error(response?.data?.error || "Failed to save draft");
          });
      });
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Toaster />

      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={theme === "light" ? darkLogo : lightLogo} alt="Logo" />
        </Link>

        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            {/* Banner */}
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label
                htmlFor="uploadBanner"
                className="cursor-pointer block w-full h-full"
              >
                <img
                  src={
                    typeof banner === "string" && banner.length
                      ? banner
                      : theme === "light"
                        ? lightBanner
                        : darkBanner
                  }
                  className="z-20 w-full h-full object-cover"
                  alt="Blog banner"
                  onError={handleError}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg, .webp"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            {/* Title */}
            <textarea
              value={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            />

            <hr className="w-full opacity-10 my-5" />

            {/* Editor */}
            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
