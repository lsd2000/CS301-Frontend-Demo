import { getLogs } from "@/api/logsApi";
import "./UserLogs.css";
import { UserLogsType, columns } from "@/components/UserLogs/columns";
import { UserLogsTable } from "@/components/UserLogs/UserLogsTable";
import { useQuery } from "@tanstack/react-query";
import { useRoleListStore } from "@/stores/useRoleListStore";

function UserLogs() {
  const getLogsQuery = useQuery({
    queryKey: ["getLogs"],
    queryFn: async () => {
      const data = await getLogs();
      return data as unknown as UserLogsType[];
    },
    refetchOnWindowFocus: false,
    // retry: 0,
  });

  const roles = useRoleListStore((state) => state.roles);

  console.log("getLogsQuery ", getLogsQuery.data);

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

  const isInReadLogsPermission = (role: string) => {
    const allowedRoles = roles
      .filter((role) => role.logs.includes("read"))
      .map((role) => role.role);

    return allowedRoles.includes(role);
  };

  return (
    <div className="logsPageContainer">
      {isInReadLogsPermission(getApiHeaders().role) ? (
        <UserLogsTable columns={columns} data={getLogsQuery.data ?? []} />
      ) : (
        "No permission to view logs"
      )}
    </div>
  );
}

export default UserLogs;
