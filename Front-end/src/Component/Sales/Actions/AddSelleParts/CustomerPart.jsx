import React from "react";
import { User, Van } from "lucide-react";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FieldLabel, FieldError } from "@/components/ui/field";

export default function CustomerPart({
  register,
  control,
  errors,
  NeedDelevry,
  setNeedDelevry,
  emploisData,
  productsData,
  Controller,
}) {
  return (
    <div className="border-2 border-[#E2E8F0] p-4 rounded-md h-full">
      <div className="flex items-center justify-between my-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Détails du client & de la vente
        </h3>
      </div>
      <div className="py-4 border my-2 rounded-md px-2 bg-[#F8FAFC] flex justify-between">
        <div className="flex gap-3 items-center">
          <div className="bg-white rounded-full w-fit p-2  flex items-center justify-center ">
            <Van size={24} color="#475569"></Van>
          </div>
          <div>
            <h1 className="text-[#0F172A] text-xl">Livraison requise</h1>
            <h2 className="text-[12px] text-[#64748B]">
              Activer la logistique pour cette commande
            </h2>
          </div>
        </div>
        <div>
          <Switch
            checked={NeedDelevry}
            onChange={() => {
              setNeedDelevry(!NeedDelevry);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="flex flex-col gap-1">
          <FieldLabel>Nom du client</FieldLabel>
          <TextField
            fullWidth
            size="small"
            placeholder="Nom du client"
            {...register("customerName", {
              required: NeedDelevry ? "Le nom du client est requis" : false,
            })}
          />
          {errors.customerName && (
            <FieldError>{errors.customerName.message}</FieldError>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Téléphone</FieldLabel>
          <TextField
            fullWidth
            size="small"
            placeholder="Numéro de téléphone"
            {...register("customerPhone", {
              required: NeedDelevry ? "Le numéro de téléphone est requis" : false,
            })}
          />
          {errors.customerPhone && (
            <FieldError>{errors.customerPhone.message}</FieldError>
          )}
        </div>
      </div>
      {NeedDelevry && (
        <div className="w-full flex flex-col gap-2 my-2">
          <div className="w-full">
            <FieldLabel>Livreur</FieldLabel>
            <Controller
              name={`deliveryId`}
              control={control}
              rules={{
                required: NeedDelevry ? "veuillez sélectionner un livreur" : false,
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <Autocomplete
                    options={
                      emploisData?.employees.filter(
                        (employer) => employer.mission.name === "Livreur",
                      ) || []
                    }
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, val) =>
                      option._id === val || option._id === val?._id
                    }
                    value={
                      emploisData?.employees?.find((e) => e._id === value) || null
                    }
                    onChange={(_, newValue) => {
                      onChange(newValue ? newValue._id : "");
                    }}
                    popupIcon={null}
                    renderInput={(params) => (
                      <div className="relative">
                        <TextField
                          {...params}
                          variant="outlined"
                          size="small"
                          placeholder="Rechercher ou sélectionner un livreur..."
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1,
                            },
                            "& .MuiAutocomplete-input": {
                              paddingLeft: "35px !important",
                            },
                          }}
                        />
                        <Van className="absolute top-2 left-2" color="#2563EB"></Van>
                      </div>
                    )}
                  />
                  {error && <FieldError>{error.message}</FieldError>}
                </>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-1">
              <FieldLabel>Rue / Adresse</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="Ex: Rue de la Liberté"
                {...register("street", {
                  required: NeedDelevry ? "La rue / adresse est requise" : false,
                })}
              />
              {errors.street && (
                <FieldError>{errors.street.message}</FieldError>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Ville</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="Ex: Agadir"
                {...register("city", {
                  required: NeedDelevry ? "La ville est requise" : false,
                })}
              />
              {errors.city && (
                <FieldError>{errors.city.message}</FieldError>
              )}
            </div>
          </div>
          <div className="w-full">
            <FieldLabel>Frais de livraison (DH)</FieldLabel>
            <div className="relative flex items-center">
              <Van className="absolute left-3 w-5 h-5 text-blue-500 pointer-events-none z-10" />
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="Ex: 25"
                {...register("deliveryfees", {
                  required: NeedDelevry ? "Les frais de livraison sont requis" : false,
                  valueAsNumber: true,
                })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                    backgroundColor: "#EFF6FF",
                    paddingLeft: "35px",
                    "& fieldset": {
                      borderColor: "#BFDBFE",
                      borderWidth: 1.5,
                    },
                    "&:hover fieldset": {
                      borderColor: "#60A5FA !important",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2563EB !important",
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
            {errors.deliveryfees && (
              <FieldError>{errors.deliveryfees.message}</FieldError>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
