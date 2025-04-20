// components/data-table.tsx
"use client"
import * as React from "react"
import { useState } from "react"
import { Search, PlusIcon } from "lucide-react"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
  }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false)
  
    const table = useReactTable({
      data,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
    })

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    }
    
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { 
          type: "spring", 
          stiffness: 100,
          damping: 15
        }
      }
    }

    const tableRowVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.05,
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1]
        }
      })
    }

    const buttonHoverVariants = {
      hover: { 
        scale: 1.05,
        boxShadow: "0px 5px 15px rgba(209, 55, 106, 0.3)",
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }
    }

  return (
    <motion.div 
      className="text-foreground container mx-auto px-4 pt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
        {/* Header Section */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="lg:text-4xl text-3xl font-semibold"
            variants={itemVariants}
          >
            Your <motion.span 
              className="text-[#D1376A]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >Decisions Log</motion.span>
          </motion.h1>
          <Link href="/new-decision">
            <motion.div
              whileHover="hover"
              variants={buttonHoverVariants}
            >
              <Button className="bg-[#D1376A] hover:bg-[#b32e5a] text-white flex items-center gap-2 px-6 py-5 rounded-full">
                <PlusIcon size={20} />
                Add new decision
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="relative w-full lg:max-w-lg"
            variants={itemVariants}
          >
            <Input
              type="text"
              placeholder="Search Decisions....."
              className="pl-10 py-6 bg-gray-100 dark:bg-gray-800 rounded-lg w-full"
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
            />
            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />
          </motion.div>

          <motion.div 
            className="flex gap-4 w-full lg:w-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Select onValueChange={(value) => 
                table.getColumn("status")?.setFilterValue(value !== "all" ? value : undefined)
              }>
                <SelectTrigger className="w-32 md:w-40 bg-rose-100 rounded-lg">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Decided">Decided</SelectItem>
                  <SelectItem value="Reflection">Reflection</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Select onValueChange={(value) => 
                table.getColumn("category")?.setFilterValue(value !== "all" ? value : undefined)
              }>
                <SelectTrigger className="w-32 md:w-40 bg-rose-100 rounded-lg">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Relationship">Relationship</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-32 md:w-40 bg-rose-100 text-foreground border-none rounded-lg flex justify-between">
                    <span>Columns</span>
                    <span className="ml-2">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter(
                      (column) => column.getCanHide()
                    )
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Table Section */}
        <motion.div 
          className="overflow-x-scroll rounded-lg shadow w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            delay: 0.4,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <Table>
            <TableHeader className="bg-[#D1376A] text-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <motion.tr
                  key={headerGroup.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="py-4 font-semibold text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </motion.tr>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    custom={index}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ 
                      backgroundColor: "rgba(249, 250, 251, 1)", 
                      scale: 1.01,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>

        {/* Pagination and Selection Info */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
        >
          <motion.div 
            className="text-sm text-muted-foreground"
            variants={itemVariants}
          >
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-2"
            variants={itemVariants}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-[#D1376A] text-[#D1376A] hover:bg-rose-50"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-[#D1376A] text-[#D1376A] hover:bg-rose-50"
            >
              Next
            </Button>
          </motion.div>
        </motion.div>
    </motion.div>
  )
}