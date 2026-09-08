import http from "./http";

export const registerUser = async (formData) => {
  const response = await http.post("/auth/register", formData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await http.post("/auth/login", credentials);
  return response.data;
};
