import React from 'react'
import { ActionsModel } from '@/Component/UI/Models/ActionsModel'

export default function Update({ isUpdating, setIsUpdating, handleSubmitUpdate }) {
  return (
    <div>
      {isUpdating && (
        <ActionsModel
          open={isUpdating}
          setIsOpen={setIsUpdating}
          title='Update Product Type'
          handleSubmit={handleSubmitUpdate}
        >
        </ActionsModel>
      )}
    </div>
  )
}

