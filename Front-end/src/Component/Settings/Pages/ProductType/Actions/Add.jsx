import React from "react";
import { ActionsModel } from "@/Component/UI/Models/ActionsModel";

export default function Add({ isAdding, setIsAdding, handleSubmitAdd }) {
  return (
    <div>
      {isAdding && (
        <ActionsModel
          open={isAdding}
          setIsOpen={setIsAdding}
          title="Add Product Type"
          handleSubmit={handleSubmitAdd}
        ></ActionsModel>
      )}
    </div>
  );
}
