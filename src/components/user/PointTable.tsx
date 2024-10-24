"use client";

import "./PointTable.css";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";
import { useRoleListStore } from "@/stores/useRoleListStore.ts";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchedName?: string;
  setSearchedName?: (name: string) => void;
  handlePrevPage?: () => void | undefined;
  handleNextPage?: () => void | undefined;
  handleSearchNameSubmit?: (event: React.FormEvent) => void | undefined;
  handleResetSearch?: () => void | undefined;
}

export function PointTable<TData, TValue>({
  columns,
  data,
  searchedName,
  setSearchedName,
  handlePrevPage,
  handleNextPage,
  handleSearchNameSubmit,
  handleResetSearch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const roles = useRoleListStore((state) => state.roles);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Set the desired number of entries per page using setPageSize
  React.useEffect(() => {
    table.setPageSize(7); // Set the desired number of entries per page
  }, [table]);

  // Use the custom hook for form logic
  const {
    formData,
    handleChange,
    handleSelectChange,
    handleSubmit,
    resetForm,
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

  const isInAddUserPermission = (role: string) => {
    const allowedRoles = roles
      .filter((role) => role.userStorage.includes("create"))
      .map((role) => role.role);

    return allowedRoles.includes(role);
  };

  return (
    <div>
      <div className="flex items-center py-4">
        {isInAddUserPermission(getApiHeaders().role) && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="AddUserButton" style={{ marginRight: "10px" }}>
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
                <DialogDescription>
                  Input all of the user's basic details. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(event) => handleSubmit(event, "CREATE_USER")}>
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
                    <Select onValueChange={handleSelectChange}>
                      <SelectTrigger id="Role" value="" className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          {roles?.map((item) => (
                            <SelectItem key={item.role} value={item.role}>
                              {item.role}
                            </SelectItem>
                          ))}
                          {/* <SelectItem value="Owner">Owner</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Engineer">Engineer</SelectItem>
                        <SelectItem value="Product Manager">
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
                      onClick={resetForm}
                    >
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
        <div className="flex gap-3">
          <form onSubmit={handleSearchNameSubmit}>
            <Input
              placeholder="Filter name..."
              value={searchedName ?? ""}
              onChange={(event) =>
                // table.getColumn("name")?.setFilterValue(event.target.value)
                setSearchedName && setSearchedName(event.target.value)
              }
              className="max-w-sm"
            />
          </form>
          <Button variant={"secondary"} onClick={handleResetSearch}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.previousPage();

            handlePrevPage && handlePrevPage();
          }}
          // disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.nextPage();
            handleNextPage && handleNextPage();
          }}
          // disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default PointTable;
