import React from 'react'
import LoginForm from './LoginForm'
import {
  ShoppingCart,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { me } from "@/Servises/Autontification";
import LoaderApp from "@/Component/UI/LoaderApp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
export default function LoginPage() {
    const navigate = useNavigate();
  const { isPending, isSuccess } = useQuery({
    queryKey: ["me"],
    queryFn: () => me(),
    retry: false, // Ne pas réessayer si on a une erreur 401
  });

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess]);
  return (
    <>
      {isPending ? (
        <LoaderApp />
      ) : (
        <div className="w-full flex h-screen">
          <div className="LoginBackground relative w-[45%]">
            <div className="m-4 flex gap-1 items-center">
              <div className="bg-white p-2 rounded-full">
                <ShoppingCart size={18} color="#2563EB" />
              </div>
              <h1 className="text-white font-bold text-[24px]">Store Pilot</h1>
            </div>
            <div className="absolute bottom-8 left-8 text-[42px] text-white w-[60%] text-centre font-bold">
              Pilotez votre commerce,vers de nouveaux sommets.
            </div>
          </div>
          <LoginForm />
        </div>
      )}
    </>
  );
}
