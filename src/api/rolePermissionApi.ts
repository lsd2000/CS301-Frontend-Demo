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

type getUserRolesAPIResponse = {
  role: string;
  user_storage_permission: string[];
  point_ledger_permission: string[];
  logs_permission: string[];
};

export const getUserRoles = async () => {
  try {
    const config = {
      headers: getApiHeaders(),
    };

    const response = await gatewayApi.get("/userProfile/listRoles", config);

    const responseData = JSON.parse(response.data.body);

    const formattedResponseData = responseData.map(
      (item: getUserRolesAPIResponse) => {
        return {
          role: item.role,
          userStorage: item.user_storage_permission,
          pointLedger: item.point_ledger_permission,
          logs: item.logs_permission,
        };
      }
    );

    return formattedResponseData;
  } catch (error) {
    throw new Error("Failed to fetch user profile with points: " + error);
  }
};

export type UserRole = {
  role: string;
  userStorage: string[];
  pointLedger: string[];
  logs: string[];
};
export const createUserRole = async (userRole: UserRole) => {
  try {
    const config = {
      headers: getApiHeaders(),
    };

    const response = await gatewayApi({
      method: "post",
      url: "/userProfile/createRole",
      headers: config.headers,
      data: JSON.stringify(userRole),
    });

    return response.data;

    // return response.data;
  } catch (error) {
    throw new Error("Failed to create user profile: " + error);
  }
};
