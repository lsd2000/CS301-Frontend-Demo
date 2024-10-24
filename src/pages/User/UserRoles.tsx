import { UserRole, createUserRole } from "@/api/rolePermissionApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

function UserRoles() {
  const queryClient = useQueryClient();

  const [roleValue, setRoleValue] = useState("");

  const [userStorageOptionsSelected, setUserStorageOptionsSelected] = useState<
    string[]
  >([]);
  const [pointLedgerOptionsSelected, setPointLedgerOptionsSelected] = useState<
    string[]
  >([]);
  const [logOptionsSelected, setLogOptionsSelected] = useState<string[]>([]);

  const userStorageOptions = [
    {
      id: "read",
      label: "read",
    },
    {
      id: "create",
      label: "create",
    },
    {
      id: "update",
      label: "update",
    },
    {
      id: "delete",
      label: "delete",
    },
  ];

  const pointLedgerOptions = [
    {
      id: "read",
      label: "read",
    },
    {
      id: "update",
      label: "update",
    },
  ];

  const logOptions = [
    {
      id: "read",
      label: "read",
    },
  ];

  const handleRoleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoleValue(event.target.value);
  };

  const handleUserStorageOptionsChange = (optionId: string) => {
    if (userStorageOptionsSelected.includes(optionId)) {
      setUserStorageOptionsSelected(
        userStorageOptionsSelected.filter((id: string) => id !== optionId)
      );
    } else {
      setUserStorageOptionsSelected([...userStorageOptionsSelected, optionId]);
    }
  };

  const handlePointLedgerOptionsChange = (optionId: string) => {
    if (pointLedgerOptionsSelected.includes(optionId)) {
      setPointLedgerOptionsSelected(
        pointLedgerOptionsSelected.filter((id: string) => id !== optionId)
      );
    } else {
      setPointLedgerOptionsSelected([...pointLedgerOptionsSelected, optionId]);
    }
  };

  const handleLogOptionsChange = (optionId: string) => {
    if (logOptionsSelected.includes(optionId)) {
      setLogOptionsSelected(
        logOptionsSelected.filter((id: string) => id !== optionId)
      );
    } else {
      setLogOptionsSelected([...logOptionsSelected, optionId]);
    }
  };

  const createUserRoleMutation = useMutation({
    mutationFn: async (userRole: UserRole) => {
      return await createUserRole(userRole);
    },
    onError: (error) => {
      toast.error("Error creating user role");
      console.error("error creating user role: ", error);
    },
    onSuccess: async (data) => {
      toast.success(data);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["userRoles"],
        });
      }
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const requestBody: UserRole = {
      role: roleValue,
      userStorage: userStorageOptionsSelected,
      pointLedger: pointLedgerOptionsSelected,
      logs: logOptionsSelected,
    };

    console.log("requestBody ", requestBody);

    createUserRoleMutation.mutate(requestBody);

    return requestBody;
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

  return (
    <div className="my-5">
      {getApiHeaders().role === "Owner" ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-4  gap-10">
            <div>
              {/* <Select
              value={roleSelected}
              onValueChange={(value) => setRoleSelected(value)}
            >
              <SelectTrigger id="Role" value="" className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Engineer">Engineer</SelectItem>
                  <SelectItem value="ProductManager">
                    Product Manager
                  </SelectItem>
                  <SelectItem value="Customer">-</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select> */}
              <Input
                placeholder="New Role"
                value={roleValue}
                onChange={handleRoleChange}
                className="max-w-sm"
              />
            </div>

            <div>
              <div className="text-left">User Storage</div>
              <div className="flex gap-2">
                {userStorageOptions.map((option) => (
                  <span key={option.id} className="flex gap-2">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={userStorageOptionsSelected.includes(option.id)}
                      onChange={() => handleUserStorageOptionsChange(option.id)}
                    />
                    <label>{option.label}</label>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-left">Point Ledger</div>
              <div className="flex gap-2">
                {pointLedgerOptions.map((option) => (
                  <span key={option.id} className="flex gap-2">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={pointLedgerOptionsSelected.includes(option.id)}
                      onChange={() => handlePointLedgerOptionsChange(option.id)}
                    />
                    <label>{option.label}</label>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-left">Logs</div>
              <div className="flex gap-2">
                {logOptions.map((option) => (
                  <span key={option.id} className="flex gap-2">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={logOptionsSelected.includes(option.id)}
                      onChange={() => handleLogOptionsChange(option.id)}
                    />
                    <label>{option.label}</label>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" className="my-4">
            Create Role
          </Button>
        </form>
      ) : (
        <div>No permission to create role</div>
      )}
    </div>
  );
}

export default UserRoles;
