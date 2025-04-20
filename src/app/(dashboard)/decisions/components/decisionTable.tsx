// components/decisionTable.tsx
import { columns } from "./column"
import { DecisionData } from '@/types'
import { DataTable } from "./data-table"

async function getData(): Promise<DecisionData[]> {
  return [
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
    ]
}

export default async function DecisionTable() {
  const data = await getData()

  return (
    <div className="container mx-auto py-8">
      <DataTable columns={columns} data={data} />
    </div>
  )
}