import { DataTable } from "@/Component/Ui/DataTable";
import { useMemo } from "react";

const mockData = [
  { id: 1, name: "Product A", email: "[EMAIL_ADDRESS]" },
  { id: 2, name: "Product B", email: "[EMAIL_ADDRESS]" },
  { id: 3, name: "Product C", email: "[EMAIL_ADDRESS]" },
  { id: 4, name: "Product D", email: "[EMAIL_ADDRESS]" },
];

export default function ProductType() {
      const columns = useMemo(() => [
        {
          header: 'ID',
          accessorKey: 'id', // This matches the key in your data object
        },
        {
          header: 'Name',
          accessorKey: 'name',
          // Custom design for this specific cell
          cell: (info) => <span className="font-bold text-indigo-600">{info.getValue()}</span>,
        },
        {
          header: 'Email Address',
          accessorKey: 'email',
        }
      ], []);
    return (
        <div>
            <DataTable data={mockData} columns={columns}/>
        </div>
    );
}