import React from "react";
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
import { AddDelivery } from "@/Servises/Delivery";
import { GetSales } from "@/Servises/Sales";
import { GetEmployees } from "@/Servises/Employees";
import { toast } from "sonner";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Truck, User, MapPin, Calendar } from "lucide-react";

export default function Add({ isAdding, setIsAdding }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "pending",
      estimatedArrival: new Date().toISOString().split('T')[0],
      actualArrival: new Date().toISOString().split('T')[0],
      deliveryAddress: {
        city: "",
        street: "",
        phone: "",
        notes: ""
      }
    },
  });

  const { data: salesData } = useQuery({
    queryKey: ["sales"],
    queryFn: GetSales,
  });

  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: () => GetEmployees("69f5c02c8a334dc5b3181c40"),
  });

  // Filter sales that require delivery
  const eligibleSales = salesData?.sales?.filter(s => s.requiresDelivery) || [];

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: AddDelivery,
    onSuccess: () => {
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      toast.success("Livraison ajoutée avec succès");
      reset();
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div>
      {isAdding && (
        <ActionsModel
          open={isAdding}
          setIsOpen={setIsAdding}
          title="Nouvelle Livraison"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de l'ajout"
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto px-1 hide-scrollbar">
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Vente associée
                  </FieldLabel>
                  <Controller
                    name="sale"
                    control={control}
                    rules={{ required: "La vente est requise" }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        options={eligibleSales}
                        getOptionLabel={(option) => option.invoiceNumber || ""}
                        isOptionEqualToValue={(option, val) => option._id === val}
                        value={eligibleSales.find(s => s._id === value) || null}
                        onChange={(_, newValue) => onChange(newValue?._id || "")}
                        renderInput={(params) => <TextField {...params} size="small" placeholder="Sélectionner une facture" />}
                      />
                    )}
                  />
                  {errors.sale && <FieldError>{errors.sale.message}</FieldError>}
                </Field>

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
                        renderInput={(params) => <TextField {...params} size="small" placeholder="Assigner un livreur" />}
                      />
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel>Statut</FieldLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        options={['pending', 'preparing', 'on_route', 'arrived', 'failed']}
                        value={field.value}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Arrivée prévue
                  </FieldLabel>
                  <TextField type="date" {...register("estimatedArrival", { required: "Requis" })} size="small" />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLabel className="flex items-center gap-2 mb-2 font-bold">
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
                  <FieldLabel>Notes d'adresse</FieldLabel>
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
