import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { useEffect, useState,useContext } from "react";
import Add from "../Purchase/Actions/Add";
import AddButton from "./AddButton";
import { useQuery } from "@tanstack/react-query";
import { me } from "@/Servises/Autontification";
import LoaderApp from "../UI/LoaderApp";
import {DataContext} from '@/Component/Data/contextApi'
import { useNavigate } from "react-router-dom";
import AddSlle from "../Sales/Actions/AddSlle";
function HomePage() {
  const [buttonAppear, setbuttoAppear] = useState(false);
  // const [buyerModalOpen, setBuyerModalOpen] = useState(false);
  const [currentPage, setcurrentPage] = useState("dashboard");
  const navigate = useNavigate();
  const {openAddBuyerModal, setOpenAddBuyerModal,setuserInfo,setOpenAddSellerModal} = useContext(DataContext)

  const { isPending, isError ,isSuccess,data} = useQuery({
    queryKey: ["me"],
    queryFn: () => me(),
    retry: false, // Ne pas réessayer si on a une erreur 401
  });

useEffect(()=>{
if(isSuccess){
  setuserInfo(data.userInfo)
}
},[isSuccess])

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  return (
    <>
      {isSuccess ? (
        <SidebarProvider>
          <AppSidebar
            currentPage={currentPage}
            setcurrentPage={setcurrentPage}
          />
          <main className="flex-1 min-w-0 relative">
            <NavBar />
            <div className="px-6 py-4 bg-[#f7f9fb] min-h-screen">
              <Outlet />
            </div>
            <AddButton
              buttonAppear={buttonAppear}
              setbuttoAppear={setbuttoAppear}
              setBuyerModalOpen={setOpenAddBuyerModal}
              setOpenAddSellerModal={setOpenAddSellerModal}
            />
              <Add isAdding={openAddBuyerModal} setIsAdding={setOpenAddBuyerModal} />
              <AddSlle></AddSlle>
          </main>
        </SidebarProvider>
      ) : (
        <LoaderApp />
      )}
    </>
  );
}

export default HomePage;
