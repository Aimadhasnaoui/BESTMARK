import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import TextField from "@mui/material/TextField";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { ClipboardPenLine, Banknote,Plus } from "lucide-react";

export default function PaymentPart({
  register,
  watch,
  setValue,
  errors,
  price,
  paidAmount,
  PaymentMethods,
}) {
  const [AddNote,setAddNote] =  useState(false)
  return (
    <div>
            <div className="flex items-center gap-1 text-[#2563EB] cursor-pointer hover:text-[#2564ebb3]">
          <Plus className="w-4 h-4 border-2 border-[#2563EB] rounded-md" onClick={()=>{setAddNote(!AddNote)}} />{" "}
          Ajouter des Notes Additionnelles
        </div>
        {
          AddNote &&
      <div className="border-2 border-[#E2E8F0] p-4 rounded-md mt-4 mb-2">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <ClipboardPenLine className="w-5 h-5 text-blue-600" />
          Notes Additionnelles
        </h3>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Ajouter des notes ou des instructions spéciales pour cette vente..."
          {...register("notes")}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
            },
          }}
        />
      </div>
        }
      <Field>
        <FieldLabel htmlFor="paymentMethod">Méthode de paiement</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {PaymentMethods.map((p) => {
            return (
              <Button
                key={p.value}
                className={`cursor-pointer ${watch("paymentMethod") === p.value ? "bg-blue-600 text-white" : ""}`}
                variant="outline"
                type="button"
                onClick={() => setValue("paymentMethod", p.value, { shouldValidate: true })}
              >
                {p.icon}
                {p.label}
              </Button>
            );
          })}
        </div>
        {errors.paymentMethod && (
          <span className="text-red-500">{errors.paymentMethod.message}</span>
        )}
      </Field>
      <Field className="mt-4">
        <FieldLabel htmlFor="paidAmount">Montant Payé (DH)</FieldLabel>
        <div className="relative flex items-center">
          <Banknote className="absolute left-3 w-5 h-5 text-emerald-500 pointer-events-none z-10" />
          <TextField
            id="paidAmount"
            type="number"
            fullWidth
            size="small"
            placeholder="Ex: 150"
            {...register("paidAmount", {
              required: "Le montant payé est requis",
              valueAsNumber: true,
              validate: (val) => !isNaN(val) || "Le montant payé doit être un nombre valide",
              min: {
                value: 0,
                message: "Le montant payé doit être supérieur ou égal à 0",
              },
            })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
                backgroundColor: "#F0FDFA",
                paddingLeft: "35px",
                "& fieldset": {
                  borderColor: "#99F6E4",
                  borderWidth: 1.5,
                },
                "&:hover fieldset": {
                  borderColor: "#2DD4BF !important",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0D9488 !important",
                  borderWidth: "2px !important",
                },
              },
              "& .MuiOutlinedInput-input": {
                fontWeight: "bold",
                color: "#0F172A",
              },
            }}
          />
          <span className="absolute right-3 font-bold text-xs text-slate-400 font-sans pointer-events-none z-10">
            DH
          </span>
        </div>
        {errors.paidAmount && (
          <FieldError>{errors.paidAmount.message}</FieldError>
        )}
      </Field>

      {price.remainAmount > 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex justify-between items-center">
          <div className="flex items-center gap-2 text-amber-700 font-medium text-sm">
            Reste à payer :
          </div>
          <span className="text-amber-700 font-extrabold text-base">
            {price.remainAmount.toFixed(2)} DH
          </span>
        </div>
      )}
      {price.remainAmount === 0 && Number(paidAmount || 0) > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
          <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
            Statut :
          </div>
          <span className="text-green-700 font-bold text-sm uppercase tracking-wide">
            Entièrement Payé
          </span>
        </div>
      )}
    </div>
  );
}
