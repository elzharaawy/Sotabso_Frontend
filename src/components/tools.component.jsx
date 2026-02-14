// importing tools
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "../common/upload";


const uploadImageByFile = async (file) => {
  try {
    const url = await uploadImage(file);

    if (!url) {
      throw new Error("Upload failed");
    }

    return {
      success: 1,
      file: { url },
    };
  } catch (error) {
    console.error("EditorJS file upload error:", error);

    return {
      success: 0,
      error: "Image upload failed",
    };
  }
};




const uploadImageByURL = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });

  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};


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
      //uploadby url  
      uploadByUrl: uploadImageByURL,
      // uploadByFile:
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
