import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useFormLogic } from "./userFormLogic.tsx";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllPointLedgerAcc } from "@/api/pointLedgerApi.ts";
import { useQuery } from "@tanstack/react-query";
import { useRoleListStore } from "@/stores/useRoleListStore.ts";

//This type is used to define the shape of our data
// We can use a zod schema if we want

type DialogType = "edit" | "adjustPoints" | "delete";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  pointBalance: number;
  role: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "User ID",
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },

  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="secondary"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "pointBalance",
    header: "Point Balance",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("pointBalance")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("role")}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    accessorKey: "actions", // Or however you're defining your columns
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [dialogType, setDialogType] = useState<DialogType | "">("");

      const { roles } = useRoleListStore.getState();

      const openDialog = (type: DialogType) => {
        setDialogType(type);
        setIsDialogOpen(true); // Open the dialog with the specified type
      };

      const closeDialog = () => {
        setIsDialogOpen(false); // Close the dialog
      };

      // Use the custom hook for form logic
      const {
        formData,
        handleChange,
        handleSelectChange,
        handleSelectPointAccountChange,
        handleSelectDeltaChange,
        handleSubmit,
        resetForm,
        updateFormData,
      } = useFormLogic();

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

      const isInEditUserPermission = (role: string) => {
        const allowedRoles = roles
          .filter((role) => role.userStorage.includes("update"))
          .map((role) => role.role);

        return allowedRoles.includes(role);
      };
      const isInDeleteUserPermission = (role: string) => {
        const allowedRoles = roles
          .filter((role) => role.userStorage.includes("delete"))
          .map((role) => role.role);

        return allowedRoles.includes(role);
      };
      const isInAdjustPointsPermission = (role: string) => {
        const allowedRoles = roles
          .filter((role) => role.pointLedger.includes("update"))
          .map((role) => role.role);

        return allowedRoles.includes(role);
      };

      const handleEdit = () => {
        // Assuming row.original contains the user data
        const userData = row.original;

        updateFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
          id: userData.id,
        });

        console.log(formData.role);
        openDialog("edit");
      };

      const getAllPointLedgerAccQuery = useQuery({
        queryKey: ["getAllPointLedgerAcc", row.original.id],
        queryFn: async () => {
          const data = await getAllPointLedgerAcc({ id: row.original.id });

          console.log("data ", data);

          return data;
        },
        refetchOnWindowFocus: false,
        // retry: 0,
        enabled: dialogType === "adjustPoints",
      });

      return (
        <div>
          <div className="text-center">{row.getValue("actions")}</div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {isInEditUserPermission(getApiHeaders().role) && (
                  <DropdownMenuItem onSelect={handleEdit}>
                    Edit
                  </DropdownMenuItem>
                )}
                {isInAdjustPointsPermission(getApiHeaders().role) && (
                  <DropdownMenuItem onSelect={() => openDialog("adjustPoints")}>
                    Adjust Points
                  </DropdownMenuItem>
                )}
                {isInDeleteUserPermission(getApiHeaders().role) && (
                  <DropdownMenuItem onSelect={() => openDialog("delete")}>
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {dialogType && (
              <DialogContent className="sm:max-w-[425px]">
                {dialogType === "edit" && (
                  <>
                    {
                      <div>
                        <DialogHeader>
                          <DialogTitle>Edit User Details</DialogTitle>
                          <DialogDescription>
                            Make changes to the user's profile here. Click save
                            when you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={(event) =>
                            handleSubmit(event, "UPDATE_USER")
                          }
                        >
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="FirstName" className="text-right">
                                First Name
                              </Label>
                              <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="LastName" className="text-right">
                                Last Name
                              </Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="Email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="Role" className="text-right">
                                Role
                              </Label>
                              <Select
                                value={formData.role}
                                onValueChange={handleSelectChange}
                              >
                                <SelectTrigger
                                  id="Role"
                                  value=""
                                  className="col-span-3"
                                >
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Roles</SelectLabel>
                                    {roles?.map((item) => (
                                      <SelectItem
                                        key={item.role}
                                        value={item.role}
                                      >
                                        {item.role}
                                      </SelectItem>
                                    ))}
                                    {/* <SelectItem value="Owner">Owner</SelectItem>
                                    <SelectItem value="Manager">
                                      Manager
                                    </SelectItem>
                                    <SelectItem value="Engineer">
                                      Engineer
                                    </SelectItem>
                                    <SelectItem value="ProductManager">
                                      Product Manager
                                    </SelectItem>
                                    <SelectItem value="Customer">-</SelectItem> */}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Save changes</Button>
                            <DialogClose asChild>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                  resetForm(); // Call resetForm first
                                  closeDialog(); // Then close the dialog
                                }}
                              >
                                Close
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </form>
                      </div>
                    }
                  </>
                )}
                {dialogType === "adjustPoints" && (
                  <>
                    {
                      <form
                        onSubmit={(event) =>
                          handleSubmit(event, "UPDATE_POINT")
                        }
                      >
                        <div>
                          <DialogHeader>
                            <DialogTitle>Adjust Point Balance</DialogTitle>
                            <DialogDescription>
                              Make changes to the user's points here. Click save
                              when you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {/* <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="Name" className="text-right">
                              Name
                            </Label>
                            <Input id="Name" value="" className="col-span-3" />
                          </div> */}

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="Role" className="text-right">
                                Point Accounts
                              </Label>
                              <Select
                                value={formData.id}
                                onValueChange={handleSelectPointAccountChange}
                              >
                                <SelectTrigger
                                  id="id"
                                  value=""
                                  className="col-span-3"
                                >
                                  <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Point Accounts</SelectLabel>
                                    {getAllPointLedgerAccQuery?.data?.map(
                                      (item: { id: string }) => {
                                        return (
                                          <SelectItem
                                            key={item.id}
                                            value={item.id}
                                          >
                                            {item.id}
                                          </SelectItem>
                                        );
                                      }
                                    )}

                                    {/* <SelectItem value="Manager">
                                    Manager
                                  </SelectItem>
                                  <SelectItem value="Engineer">
                                    Engineer
                                  </SelectItem>
                                  <SelectItem value="ProductManager">
                                    Product Manager
                                  </SelectItem>
                                  <SelectItem value="Customer">-</SelectItem> */}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="Balance" className="text-right">
                                Balance
                              </Label>
                              <div className="flex flex-row justify-end gap-2">
                                <div>
                                  <Select
                                    value={formData.delta}
                                    onValueChange={handleSelectDeltaChange}
                                    // defaultValue="+"
                                  >
                                    <SelectTrigger
                                      id="Delta"
                                      value=""
                                      className="col-span-3"
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        {/* <SelectLabel>Deduct or Add</SelectLabel> */}
                                        <SelectItem value="+">+</SelectItem>
                                        <SelectItem value="-">-</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="basis-3/4">
                                  <Input
                                    type="number"
                                    id="Balance"
                                    name="balance"
                                    value={formData.balance}
                                    onChange={handleChange}
                                    // value=""
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Save changes</Button>
                            <DialogClose asChild>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={closeDialog}
                              >
                                Close
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </div>
                      </form>
                    }
                  </>
                )}
                {dialogType === "delete" && (
                  <>
                    {
                      <form
                        onSubmit={(event) => handleSubmit(event, "DELETE_USER")}
                      >
                        <div>
                          <DialogHeader>
                            <DialogTitle>
                              Are you absolutely sure? {row.original.id}
                            </DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button type="submit">Continue</Button>
                            <DialogClose asChild>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={closeDialog}
                              >
                                Close
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </div>
                      </form>
                    }
                  </>
                )}
              </DialogContent>
            )}
          </Dialog>
        </div>
      );
    },
  },
];
