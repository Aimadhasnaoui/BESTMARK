import React from "react";
import { Banknote } from "lucide-react";

export default function FactureSell({
  price,
  register,
  NeedDelevry,
  deliveryfees,
}) {
  return (
    <div className="w-[350px] flex flex-col gap-4 h-full">
      <div className="w-full h-full py-6 border border-slate-800 rounded-xl px-6 bg-[#0B1120] flex flex-col shadow-2xl relative overflow-hidden">
        <div className="flex gap-2 items-center mb-6">
          <Banknote size={18} color="#60A5FA"></Banknote>
          <h1 className="text-[#60A5FA] tracking-[0.2em] text-xs font-semibold uppercase">
            RÉSUMÉ DE LA COMMANDE
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[#94A3B8] text-sm">Sous-total</h1>
            <p className="text-white font-bold text-sm">{price.subtotal} DH</p>
          </div>

          <div className="flex justify-between items-center">
            <h1 className="text-[#94A3B8] text-sm">Remise</h1>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm font-medium">-DH</span>
              <input
                type="number"
                {...register("discount", { valueAsNumber: true })}
                className="text-white font-bold bg-[#1E293B] px-3 py-1 rounded-md text-sm border border-slate-700/50 shadow-inner w-20 text-right focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {NeedDelevry && (
            <div className="flex justify-between items-center">
              <h1 className="text-[#94A3B8] text-sm">Frais de livraison</h1>
              <p className="text-white font-bold text-sm">
                {deliveryfees || 0} DH
              </p>
            </div>
          )}
        </div>

        <div className="w-full h-[1px] bg-slate-800/80 my-5 mt-auto"></div>

        <div className="flex flex-col gap-1">
          <h1 className="text-[#64748B] text-[10px] font-bold tracking-wider uppercase mb-1">
            MONTANT TOTAL
          </h1>
          <div className="flex justify-between items-end">
            <p className="text-white font-black text-4xl tracking-tight">
              {price.totalAmount}
            </p>
            <div className="bg-[#3B82F6] text-white text-[10px] font-bold px-2.5 py-1 rounded mb-1.5 shadow-sm">
              DH
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
