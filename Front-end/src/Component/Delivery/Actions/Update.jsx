import React, { useEffect } from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { UpdateDelivery } from "@/Servises/Delivery";
import { GetSales } from "@/Servises/Sales";
import { GetEmployees } from "@/Servises/Employees";
import { toast } from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Truck, User, MapPin, Calendar, Banknote } from "lucide-react";

import { useModelPermissions } from "@/hooks/usePermissions";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "preparing", label: "Préparation" },
  { value: "on_route", label: "En route" },
  { value: "arrived", label: "Livré" },
  { value: "failed", label: "Échoué" },
];

export default function Update({ isUpdating, setIsUpdating, selectedDelivery }) {
  const { canAdd } = useModelPermissions("Livraisons");
  const { canView: isLivreurView } = useModelPermissions("Gestion des Livraisons");
  const isLivreur = isLivreurView && !canAdd;

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (selectedDelivery) {
      reset({
        sale: selectedDelivery.sale?._id || selectedDelivery.sale,
        deliveryMan: selectedDelivery.deliveryMan?._id || selectedDelivery.deliveryMan,
        status: selectedDelivery.status,
        estimatedArrival: selectedDelivery.estimatedArrival ? new Date(selectedDelivery.estimatedArrival).toISOString().split('T')[0] : "",
        deliveryAddress: selectedDelivery.deliveryAddress || {},
        collectedAmount: "",
      });
    }
  }, [selectedDelivery, reset]);

  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: GetEmployees,
    enabled: !isLivreur,
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data) => UpdateDelivery(selectedDelivery._id, data),
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Livraison et règlement mis à jour");
    },
  });

  const isPaymentOnDelivery = !!selectedDelivery?.sale?.payementInlivrisan;

  return (
    <div>
      {isUpdating && (
        <ActionsModel
          open={isUpdating}
          setIsOpen={setIsUpdating}
          title="Modifier la Livraison"
          handleSubmit={handleSubmit((data) => mutate(data))}
          isPending={isPending}
          isError={isError}
          error={error}
          type="Update"
          size="lg"
        >
          <form className="space-y-6 max-h-[70vh] overflow-y-auto px-1 hide-scrollbar">
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!isLivreur && (
                  <Field>
                    <FieldLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Livreur
                    </FieldLabel>
                    <Controller
                      name="deliveryMan"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          options={employeesData?.employees || []}
                          getOptionLabel={(option) => option.name || ""}
                          isOptionEqualToValue={(option, val) => option._id === val}
                          value={employeesData?.employees?.find(e => e._id === value) || null}
                          onChange={(_, newValue) => onChange(newValue?._id || "")}
                          renderInput={(params) => <TextField {...params} size="small" />}
                        />
                      )}
                    />
                  </Field>
                )}

                <Field>
                  <FieldLabel>Statut</FieldLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        options={STATUS_OPTIONS}
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, val) => option.value === val}
                        value={STATUS_OPTIONS.find((opt) => opt.value === value) || null}
                        onChange={(_, newValue) => onChange(newValue?.value || "")}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Arrivée prévue
                  </FieldLabel>
                  <TextField type="date" {...register("estimatedArrival")} size="small" />
                </Field>

                {isPaymentOnDelivery && (
                  <Field className="col-span-1 md:col-span-2 bg-emerald-50/60 border border-emerald-200/80 p-3 rounded-xl">
                    <FieldLabel className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Banknote className="w-4 h-4 text-emerald-600" /> Montant encaissé (Paiement à la livraison)
                    </FieldLabel>
                    <TextField
                      type="number"
                      placeholder={`Reste à encaisser : ${selectedDelivery?.sale?.remainAmount ?? selectedDelivery?.sale?.totalAmount ?? 0} DH`}
                      {...register("collectedAmount")}
                      size="small"
                      className="bg-white rounded-md mt-1"
                    />
                    <p className="text-[11px] text-emerald-700 mt-1">
                      Le montant saisi enregistrera une transaction financière de vente et mettra à jour le règlement du client.
                    </p>
                  </Field>
                )}
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLabel className="flex items-center gap-2 mb-2 font-bold text-slate-700">
                <MapPin className="w-4 h-4" /> Adresse de livraison
              </FieldLabel>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-slate-50">
                <Field>
                  <FieldLabel>Ville</FieldLabel>
                  <TextField {...register("deliveryAddress.city")} size="small" />
                </Field>
                <Field>
                  <FieldLabel>Rue / Quartier</FieldLabel>
                  <TextField {...register("deliveryAddress.street")} size="small" />
                </Field>
                <Field>
                  <FieldLabel>Téléphone</FieldLabel>
                  <TextField {...register("deliveryAddress.phone")} size="small" />
                </Field>
                <Field>
                  <FieldLabel>Notes</FieldLabel>
                  <TextField {...register("deliveryAddress.notes")} size="small" multiline rows={2} />
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </ActionsModel>
      )}
    </div>
  );
}
