// tools.component.jsx
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "../common/upload";

// ─── Upload by File ───────────────────────────────────────────────────────────
const uploadImageByFile = async (file) => {
  try {
    // uploadImage returns { url, public_id, width, height, format }
    const result = await uploadImage(file);

    if (!result?.url) {
      throw new Error("Upload failed - no URL returned");
    }

    // EditorJS image plugin expects { success: 1, file: { url } }
    return {
      success: 1,
      file: { url: result.url },
    };
  } catch (error) {
    console.error("EditorJS file upload error:", error);
    return {
      success: 0,
      error: error.message || "Image upload failed",
    };
  }
};

// ─── Upload by URL ────────────────────────────────────────────────────────────
const uploadImageByURL = (url) => {
  return Promise.resolve({
    success: 1,
    file: { url },
  });
};

// ─── Tools Config ─────────────────────────────────────────────────────────────
export const tools = {
  embed: Embed,

  list: {
    class: List,
    inlineToolbar: true,
  },

  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },

  header: {
    class: Header,
    config: {
      placeholder: "Type Heading....",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },

  quote: {
    class: Quote,
    inlineToolbar: true,
  },

  marker: Marker,
  inlineCode: InlineCode,
};
