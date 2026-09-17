import {createContext, useState} from "react";
import { loadPermissions } from "@/lib/permissions";

export const DataContext = createContext();

export const DataProvider = ({children}) => {
    const [data, setData] = useState(null);
    const [openAddSellerModal, setOpenAddSellerModal] = useState(false);
    const [openAddBuyerModal, setOpenAddBuyerModal] = useState(false);
    const [prefillProduct, setPrefillProduct] = useState(null);
    const [userInfo,setuserInfo] = useState({

    })
    const [permissions, setPermissions] = useState(() => loadPermissions());
    return (
        <DataContext.Provider value={{data, setData, openAddSellerModal, setOpenAddSellerModal, openAddBuyerModal, setOpenAddBuyerModal,setuserInfo,userInfo, prefillProduct, setPrefillProduct, permissions, setPermissions}}>
            {children}
        </DataContext.Provider>
    )
}
