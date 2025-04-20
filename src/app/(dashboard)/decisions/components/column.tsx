// components/column.tsx
"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DecisionData } from '@/types'
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion } from "framer-motion"

export const columns: ColumnDef<DecisionData>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="h-5 w-5 border-white data-[state=checked]:bg-white data-[state=checked]:text-[#D1376A]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="h-5 w-5"
          />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="text-white hover:text-white/90 p-0 font-semibold"
              >
                Decision Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        cell: ({ row }) => {
          const title = row.getValue("title") as string;
          return <div className="font-medium">{title}</div>;
        }
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="text-white hover:text-white/90 p-0 font-semibold"
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <div className="font-medium">
              {status === "Pending" && <div className="text-amber-600 font-semibold">Pending</div>}
              {status === "Decided" && <div className="text-green-600 font-semibold">Decided</div>}
              {status === "Reflection" && <div className="text-rose-600 font-semibold">Reflection</div>}
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },        
      {
        accessorKey: "category",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="text-white hover:text-white/90 p-0 font-semibold"
            >
              Category
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "dateCreated",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="text-white hover:text-white/90 p-0 font-semibold"
            >
              Date Created
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        accessorKey: "finalOutcome",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="text-white hover:text-white/90 p-0 font-semibold"
            >
              Final Outcome
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
    ];