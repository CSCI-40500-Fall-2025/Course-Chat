import axios from "axios";
export const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error("API error:", error.response.data);
      throw new Error((error.response.data as { message?: string })?.message);
    } else if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("No response from server. Please try again.");
    } else {
      console.error("Axios error:", error.message);
      throw new Error(error.message);
    }
  } else {
    console.error("Unexpected error:", error);
    throw new Error("Unexpected error occurred");
  }
};
