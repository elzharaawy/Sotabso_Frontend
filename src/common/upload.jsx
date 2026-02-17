// common/upload.js
import axios from "axios";

const SERVER = import.meta.env.VITE_SERVER_DOMAIN;

// ─── Upload ───────────────────────────────────────────────────────────────────

export const uploadImage = async (file) => {
  if (!file) throw new Error("No file provided");

  // Validate type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
  }

  // Validate size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size exceeds 5MB limit.");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const { data } = await axios.post(`${SERVER}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30000,
    });

    // Returns { url, public_id, width, height, format }
    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Upload failed.");
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "Upload failed.");
    }
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deleteImage = async (public_id) => {
  // Silently skip if no public_id — dicebear/google imgs don't have one
  if (!public_id) return false;

  try {
    await axios.delete(`${SERVER}/delete-image`, {
      data: { public_id },
    });

    return true;
  } catch (error) {
    // Non-fatal — log but don't crash the caller
    console.error(
      "Failed to delete image from Cloudinary:",
      error.response?.data?.error || error.message,
    );
    return false;
  }
};
