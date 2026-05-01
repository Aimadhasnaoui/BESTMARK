import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
export default function ErrorAlert({message,title}) {
  return (
    <div className='my-2'>
    <Alert variant="destructive" className='border-red-500 border-dashed bg-red-50 text-red-500'>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className='text-red-500'>{title}</AlertTitle>
      <AlertDescription className='text-red-500'>
        {message}
      </AlertDescription>
    </Alert>
    </div>
  )
}
