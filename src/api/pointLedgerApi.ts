import axios from "axios";

export const gatewayApi = axios.create({
  baseURL: "https://nsopxzgi88.execute-api.ap-southeast-1.amazonaws.com/test",
});

type updatePointLedgerByIdAPIRequestBody = {
  point_id: string;
  point_delta: number;
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

export const getAllPointLedgerAcc = async ({
  id = "",
}: {
  id?: string;
} = {}) => {
  try {
    const config = {
      params: {
        id,
      },
      headers: getApiHeaders(),
    };

    const response = await gatewayApi.get(
      "/pointLedger/getAllPointLedgerAcc",
      config
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user profile with points: " + error);
  }
};

export const updatePointLedgerById = async ({
  id = "",
  balance = 0,
  delta = "",
}: {
  id?: string;
  balance?: number;
  delta?: string;
} = {}) => {
  try {
    const config = {
      headers: getApiHeaders(),
    };

    const updatePointLedgerByIdPayload: updatePointLedgerByIdAPIRequestBody = {
      point_id: id,
      point_delta: Number(delta + balance),
    };

    const response = await gatewayApi({
      method: "patch",
      url: "/pointLedger/updatePointLedgerById",
      headers: config.headers,
      data: JSON.stringify(updatePointLedgerByIdPayload),
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user profile with points: " + error);
  }
};
