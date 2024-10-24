import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserLogsType = {
  id: string;
  method: string;
  endpoint: string;
  timestamp: number;
  statusCode: string;
};

export const columns: ColumnDef<UserLogsType>[] = [
  {
    accessorKey: "id",
    header: "Log ID",
  },
  {
    accessorKey: "method",
    header: "Method",
  },
  {
    accessorKey: "endpoint",
    header: "Endpoint",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
  },
  {
    accessorKey: "statusCode",
    header: "Status Code",
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => {
      return <Button>Details</Button>;
    },
  },
];
