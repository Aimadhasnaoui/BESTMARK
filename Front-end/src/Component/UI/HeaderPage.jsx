import React from 'react'
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
export default function HeaderPage({title,description,isAjouter,ButtonText,onButtonClick,children}) {
  return (
    <div className='flex justify-between items-center'>
        <div className="flex flex-col space-y-2">
                  <h1 className="text-lg font-semibold text-primary">{title}</h1>
                  {
                    description ? (
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    ) : null
                  }
                </div>
                <div className="flex items-center gap-2">
                  {children}
                  {isAjouter && (
                        <Button
                                 size="sm"
                                 variant="default"
                                 className="cursor-pointer bg-[#0050CB] text-white hover:bg-[#0050CB]/90"
                                 onClick={onButtonClick}
                               >
                                 <Plus />
                                 {ButtonText}
                               </Button>
                        )}
                </div>
    </div>
  )
}
