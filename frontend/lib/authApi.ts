import { API_URL } from "./config";


import { protectedFetch } from "./protectedFetch";

export const registerUser = async(
     name: string ,
     email: string,
     password: string
) => {

     const response = await fetch(
          `${API_URL}/auth/register`,
          {
               method: "POST",

               headers: {
                    "Content-Type": 
                    "application/json",
               },

               body: JSON.stringify({
                    name,
                    email,
                    password,
               }),
          }
     );
     return response.json();
};

export const loginUser = async(
     email: string,
     password: string
) => {

     const response = await fetch(
          `${API_URL}/auth/login`,

          {
               method: "POST",

               headers: {
                    "Content-Type":
                    "application/json",
               },

               body: JSON.stringify({
                    email,
                    password,
               }),
          }
     );

     return response.json();
};

export const getMyProfile =
async () => {

  return protectedFetch(
    "/auth/me"
  );

};

export const updateMyProfile =
async (
  data: {
    name: string;
    email: string;
  }
) => {

  return protectedFetch(
    "/auth/me",
    {
      method: "PUT",

      body: JSON.stringify(
        data
      ),
    }
  );

};

export const changePassword =
async (
  currentPassword: string,
  newPassword: string
) => {

  return protectedFetch(
    "/auth/change-password",
    {
      method: "PUT",

      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    }
  );

};