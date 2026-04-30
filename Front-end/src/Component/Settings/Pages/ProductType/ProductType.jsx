import { DataTable } from "@/Component/UI/DataTable";
import { useMemo,useState } from "react";
import { ActionsModel } from "@/Component/UI/Models/ActionsModel";
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import { ActionButtons } from "@/Component/UI/ActionButtons";
import DeletModel from "@/Component/UI/Models/DeletModel";
const mockData = [
  { id: 1, name: "Product A", email: "[EMAIL_ADDRESS]" },
  { id: 2, name: "Product B", email: "[EMAIL_ADDRESS]" },
  { id: 3, name: "Product C", email: "[EMAIL_ADDRESS]" },
  { id: 4, name: "Product D", email: "[EMAIL_ADDRESS]" },
  { id: 4, name: "Product D", email: "[EMAIL_ADDRESS]" },
  { id: 4, name: "Product D", email: "[EMAIL_ADDRESS]" },
  { id: 4, name: "Product D", email: "[EMAIL_ADDRESS]" },
  { id: 4, name: "Product D", email: "[EMAIL_ADDRESS]" },
  { id: 4, name: "Product D", email: "[EMAIL_ADDRESS]" },
  { id: 4, name: "Product D", email: "[EMAIL_ADDRESS]" },
  { id: 4, name: "Product D", email: "[EMAIL_ADDRESS]" },
  { id: 4, name: "Product D", email: "[EMAIL_ADDRESS]" },
  { id: 4, name: "Product D", email: "[EMAIL_ADDRESS]" },
];

export default function ProductType() {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

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
        },
        {
          header: 'Actions',
          accessorKey: 'actions',
          className: 'sticky right-0 bg-white border-l w-[150px] bg-[#F8FAFC]',
          cell: ({ row }) => (
            <ActionButtons
              onEdit={() => {
                setSelectedType(row.original);
                setIsUpdating(true);
              }}
              onDelete={() => {
                setSelectedType(row.original);
                setIsDeleting(true);
              }}
            />
          ),
        },

      ], []);
      const handleSubmitAdd = (e) => {
        console.log("Form submitted");
      }

      const handleSubmitUpdate = () => {
        console.log("Update submitted", selectedType);
        setIsUpdating(false);
      };

      const handleSubmitDelete = () => {
        console.log("Delete confirmed", selectedType);
        setIsDeleting(false);
      };
    return (
        <div>
            <DataTable data={mockData} columns={columns} ButtonText="Ajouter Product Type" TableTitle="Product Types" isAjouter={true} onButtonClick={() => setIsAdding(true)}/>
            <Add isAdding={isAdding} setIsAdding={setIsAdding} handleSubmitAdd={handleSubmitAdd}/>
            <Update isUpdating={isUpdating} setIsUpdating={setIsUpdating} handleSubmitUpdate={handleSubmitUpdate} />
             {/* {isDeleting && <ActionsModel open={isDeleting} setIsOpen={setIsDeleting} title="Delete Product Type" handleSubmit={handleSubmitDelete}>
               <p className="text-sm">Are you sure you want to delete {selectedType?.name}?</p>
             </ActionsModel>} */}
             <DeletModel open={isDeleting} setIsOpen={setIsDeleting} title="Delete Product Type" handelDelet={handleSubmitDelete}/>

        </div>
    );
}