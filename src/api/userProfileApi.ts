import { User } from "@/components/user/columns";
import axios from "axios";

export const gatewayApi = axios.create({
  baseURL: "https://nsopxzgi88.execute-api.ap-southeast-1.amazonaws.com/test",
});

type getAllUserProfileWithPointsAPIResponse = {
  "User ID": string;
  Email: string;
  Name: string;
  Role: string;
  "Point Balance": number;
};

export type UserProfile = Omit<User, "pointBalance">;

type createUserProfileAPIResponseBody = {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
};

type updateUserProfileAPIResponseBody = createUserProfileAPIResponseBody & {
  id: string;
};

type deleteUserProfileAPIResponseBody = {
  id: string;
};

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

console.log(
  'sessionStorage.getItem("id_token") ',
  sessionStorage.getItem("id_token")
);

export const getAllUserProfileWithPoints = async ({
  page_no = 1,
}: {
  page_no?: number;
} = {}) => {
  try {
    const config = {
      params: {
        page_no,
      },
      headers: getApiHeaders(),
    };

    console.log("apiHeaders ", getApiHeaders());

    const response = await gatewayApi.get(
      "/userProfile/getUserProfileWithPoints",
      config
    );

    // const response = await axios.get(
    //   "https://7kmh80osdj.execute-api.ap-southeast-1.amazonaws.com/test/GetSevenUsers?page_no=2",
    //   config
    // );

    const formatResponseData: User[] = response.data.map(
      (item: getAllUserProfileWithPointsAPIResponse) => {
        const userData: User = {
          email: item["Email"],
          name: item["Name"],
          firstName: item["Name"].split(" ")[0],
          lastName: item["Name"].split(" ")[1],
          pointBalance: item["Point Balance"],
          role: item["Role"],
          id: item["User ID"],
        };

        return userData;
      }
    );

    console.log("formatResponseData ", formatResponseData);

    return formatResponseData;

    // return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user profile with points: " + error);
  }
};

export const getUserProfileByName = async ({
  searched_name = "",
}: {
  searched_name?: string;
} = {}) => {
  try {
    const config = {
      params: {
        searched_name,
      },
      headers: getApiHeaders(),
    };

    const response = await gatewayApi.get(
      "/userProfile/getUserProfileByName",
      config
    );

    // const response = await axios.get(
    //   "https://7kmh80osdj.execute-api.ap-southeast-1.amazonaws.com/test/GetSevenUsers?page_no=2",
    //   config
    // );

    const formatResponseData: User[] = response.data.map(
      (item: getAllUserProfileWithPointsAPIResponse) => {
        const userData: User = {
          email: item["Email"],
          name: item["Name"],
          firstName: item["Name"].split(" ")[0],
          lastName: item["Name"].split(" ")[1],
          pointBalance: item["Point Balance"],
          role: item["Role"],
          id: item["User ID"],
        };

        return userData;
      }
    );

    console.log("formatResponseData ", formatResponseData);

    return formatResponseData;

    // return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user profile with points: " + error);
  }
};

export const createUserProfile = async (userProfile: UserProfile) => {
  try {
    const config = {
      headers: getApiHeaders(),
    };

    const createUserProfilePayload: createUserProfileAPIResponseBody = {
      first_name: userProfile.firstName,
      last_name: userProfile.lastName,
      email: userProfile.email,
      role: userProfile.role,
    };

    const response = await gatewayApi({
      method: "post",
      url: "/userProfile/createUserProfile",
      headers: config.headers,
      data: JSON.stringify(createUserProfilePayload),
    });

    return response.data;

    // return response.data;
  } catch (error) {
    throw new Error("Failed to create user profile: " + error);
  }
};

export const updateUserProfile = async (userProfile: UserProfile) => {
  try {
    console.log("update apiHeaders ", getApiHeaders());

    const config = {
      headers: getApiHeaders(),
    };

    const updateUserProfilePayload: updateUserProfileAPIResponseBody = {
      first_name: userProfile.firstName,
      last_name: userProfile.lastName,
      email: userProfile.email,
      role: userProfile.role,
      id: userProfile.id,
    };

    const response = await gatewayApi({
      method: "put",
      url: "/userProfile/updateUserProfileById",
      headers: config.headers,
      data: updateUserProfilePayload,
    });

    return response.data;

    // return response.data;
  } catch (error) {
    throw new Error("Failed to create user profile: " + error);
  }
};

export const deleteUserProfile = async (id: string) => {
  try {
    const config = {
      headers: getApiHeaders(),
    };

    const deleteUserProfilePayload: deleteUserProfileAPIResponseBody = {
      id,
    };

    const response = await gatewayApi({
      method: "delete",
      url: "/userProfile/deleteUserProfileById",
      headers: config.headers,
      data: deleteUserProfilePayload,
    });

    // await gatewayApi.delete("/userProfile/deleteUserProfileById", {headers: config.headers, params:  });

    return response.data;

    // return response.data;
  } catch (error) {
    throw new Error("Failed to delete user profile: " + error);
  }
};
