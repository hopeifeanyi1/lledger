"use client";
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Decision {
  id: number;
  title: string;
  status: string;
  category: string;
  dateCreated: string;
  finalOutcome: string;
}

const DecisionsPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [decisions, setDecisions] = useState<Decision[]>([
    { 
      id: 1, 
      title: "Job offer", 
      status: "Pending", 
      category: "Career", 
      dateCreated: "Apr 8", 
      finalOutcome: "Accepted Job" 
    },
    { 
      id: 2, 
      title: "Move cities", 
      status: "Decided", 
      category: "Personal", 
      dateCreated: "Mar 30", 
      finalOutcome: "Moved" 
    },
    { 
      id: 3, 
      title: "Invest stocks", 
      status: "Reflection", 
      category: "Finance", 
      dateCreated: "Mar 15", 
      finalOutcome: "----" 
    },
    { 
      id: 4, 
      title: "Travel solo to Japan", 
      status: "Decided", 
      category: "Personal", 
      dateCreated: "Feb 01", 
      finalOutcome: "Booked trip" 
    },
    { 
      id: 5, 
      title: "Break up with partner", 
      status: "Pending", 
      category: "Relationship", 
      dateCreated: "Jan 23", 
      finalOutcome: "Reconciled" 
    }
  ]);

  // Function to get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-amber-600";
      case "Decided":
        return "text-green-600";
      case "Reflection":
        return "text-rose-600";
      default:
        return "text-gray-600";
    }
  };

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
  };
  
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
  };

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
  };

  const buttonHoverVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(209, 55, 106, 0.3)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 pt-16 lg:pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
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
          />
          <svg
            className="absolute left-3 top-3 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </motion.div>

        <motion.div 
          className="flex gap-4 w-full lg:w-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Select>
              <SelectTrigger className="w-32 md:w-40 bg-rose-100 rounded-lg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="decided">Decided</SelectItem>
                <SelectItem value="reflection">Reflection</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Select>
              <SelectTrigger className="w-32 md:w-40 bg-rose-100 rounded-lg">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="relationship">Relationship</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Select>
              <SelectTrigger className="w-32 md:w-40 bg-rose-100 rounded-lg">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="overflow-x-scroll rounded-lg shadow w-screen lg:w-full"
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
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <TableHead className="py-4 font-semibold text-white">Decision Title</TableHead>
              <TableHead className="py-4 font-semibold text-white">Status</TableHead>
              <TableHead className="py-4 font-semibold text-white">Category</TableHead>
              <TableHead className="py-4 font-semibold text-white">Date Created</TableHead>
              <TableHead className="py-4 font-semibold text-white">Final Outcome</TableHead>
            </motion.tr>
          </TableHeader>
          <TableBody>
            {decisions.map((decision, index) => (
              <motion.tr 
                key={decision.id}
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
                <TableCell className="py-4 font-medium">{decision.title}</TableCell>
                <TableCell className={`py-4 ${getStatusColorClass(decision.status)}`}>
                  {decision.status}
                </TableCell>
                <TableCell className="py-4">{decision.category}</TableCell>
                <TableCell className="py-4">{decision.dateCreated}</TableCell>
                <TableCell className="py-4">{decision.finalOutcome}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
};

export default DecisionsPage;