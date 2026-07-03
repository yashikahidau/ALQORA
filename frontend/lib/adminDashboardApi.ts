import { protectedFetch } from "./protectedFetch";

export const getDashboardStats = async () => {
     try {
          const response = await protectedFetch(
               "/admin-dashboard/stats"
          );

          return response;
     } catch (error) {
          console.error(error);

          return {
               success: false,
               error: "Failed to load dashboard",
          };
     }
};