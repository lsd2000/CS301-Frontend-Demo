import { UserLogsType } from "@/components/UserLogs/columns";
import axios from "axios";

export const gatewayApi = axios.create({
  baseURL: "https://nsopxzgi88.execute-api.ap-southeast-1.amazonaws.com/test",
});

// Function to get updated apiHeaders
const getApiHeaders = () => {
  const userHeaders = JSON.parse(
    sessionStorage.getItem("user_headers") ?? "{}"
  );
  return {
    ...userHeaders,
    ["Authorization"]: `Bearer ${sessionStorage.getItem("id_token")}`,
  };
};

export const getLogs = async () => {
  try {
    const config = {
      //   params: {
      //     id,
      //   },
      headers: getApiHeaders(),
    };

    const response = await gatewayApi.get("/logs/getLogs", config);
    const responseData: Record<string, UserLogsType> = response.data;

    // Convert the provided JSON object into an array of objects
    // Convert JSON data to an array of objects conforming to UserLogsType
    const formatResponseData = Object.values(responseData).map(
      (log: UserLogsType) => ({
        id: log.id,
        method: log.method,
        endpoint: log.endpoint,
        timestamp: formatTimestamp(log.timestamp),
        statusCode: log.statusCode,
      })
    );

    console.log("formatResponseData ", formatResponseData);

    return formatResponseData;
  } catch (error) {
    throw new Error("Failed to fetch user profile with points: " + error);
  }
};

const formatTimestamp = (timestamp: number) => {
  // Create a new Date object using the timestamp
  const date = new Date(timestamp);

  // Get day, month, and year from the Date object
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Get hours, minutes, and seconds from the Date object
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Format the time as DD MMM YYYY, HH:mm:ss
  const formattedDateTime = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
};
