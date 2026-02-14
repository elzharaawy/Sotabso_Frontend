export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:3000/api/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.url;
  } catch (error) {
    console.error("Image upload error:", error);
    return null;
  }
};
