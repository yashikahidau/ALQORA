import { protectedFetch } from "./protectedFetch";

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  return protectedFetch("/upload", {
    method: "POST",
    body: formData,
  });
};