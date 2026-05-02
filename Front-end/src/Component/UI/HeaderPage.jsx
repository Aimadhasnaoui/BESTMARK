import React from 'react'
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
export default function HeaderPage({title,description,isAjouter,ButtonText,onButtonClick}) {
  return (
    <div className='flex justify-between items-center'>
        <div className="flex flex-col space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
                  {
                    description ? (
                      <p className="text-muted-foreground">
                        {description}
                      </p>
                    ) : null
                  }
                </div>
                  {isAjouter && (
                          <Button
                            size="lg"
                            className="bg-[#0050CB] cursor-pointer text-white rounded-md py-4 px-2"
                            onClick={onButtonClick}
                          >
                            <Plus className="w-4 h-4" />
                            {ButtonText}
                          </Button>
                        )}
    </div>
  )
}
