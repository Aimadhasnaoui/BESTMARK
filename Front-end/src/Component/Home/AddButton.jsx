import { Button } from "@/components/ui/button";
import { Plus, Receipt, ShoppingBag } from "lucide-react";
import React from "react";

export default function AddButton({
  buttonAppear,
  setbuttoAppear,
  setBuyerModalOpen,
  setOpenAddSellerModal
}) {
  return (
    <div
      className="fixed bottom-16 right-4"
      onMouseEnter={() => setbuttoAppear(true)}
      onMouseLeave={() => setbuttoAppear(false)}
    >
      {buttonAppear && (
        <div className="flex flex-col gap-4 items-end  mb-4">
          <Button 
            onClick={() => {
              setOpenAddSellerModal(true);
            }}
          className="bg-white shadow-xl cursor-pointer  px-4 py-2 rounded-md text-gray-600 hover:border  hover:border-green-400">
            <ShoppingBag
              size={18}
              className="inline-block mr-2 text-green-400"
            />
            NEW SALE
          </Button>
          <Button
            className="bg-white shadow-xl px-4 py-2 rounded-md text-gray-600 cursor-pointer hover:border  hover:border-blue-400"
            onClick={() => {
              setBuyerModalOpen(true);
            }}
          >
            <Receipt size={18} className="inline-block mr-2 text-blue-500" />
            NEW BUYER
          </Button>
        </div>
      )}
      <button className="group fixed bottom-4 right-4  flex items-end gap-2 bg-blue-500 text-white px-4 py-4 rounded-full hover:bg-blue-600 cursor-pointer transition">
        <Plus
          size={18}
          className="transition-transform group-hover:rotate-90"
        />
      </button>
    </div>
  );
}
