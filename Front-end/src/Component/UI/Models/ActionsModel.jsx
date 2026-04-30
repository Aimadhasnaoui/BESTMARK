import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator"


export function ActionsModel({ children, title = "Edit Profile",open, setIsOpen ,handleSubmit,isPending}) {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}> 
 <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden flex flex-col max-h-[85vh]">
          <DialogHeader className="px-6 py-4">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          
          <Separator />
          
          {/* Main Content Area */}
          <div className="p-6">
            {children}
          </div>
          <DialogFooter className="  flex items-center gap-2">
          <div className="flex justify-end gap-4 w-full px-4 py-2">
              <Button
                type="button"
                variant="ghost"
             onClick={() => setIsOpen(false)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 font-medium cursor-pointer"
              >
                Annuler
              </Button>

            <Button
              type="button"
                onClick={handleSubmit}
              className="bg-[#0050CB] hover:bg-[#0040a3] text-white px-8 cursor-pointer"
            >
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
