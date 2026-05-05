import React, { useEffect } from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateTransaction } from "@/Servises/Transactions";
import { toast } from "sonner";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function Update({ isUpdating, setIsUpdating, selectedTransaction }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (selectedTransaction) {
      reset({
        type: selectedTransaction.type,
        direction: selectedTransaction.direction,
        amount: selectedTransaction.amount,
        date: new Date(selectedTransaction.date).toISOString().split('T')[0],
        note: selectedTransaction.note,
      });
    }
  }, [selectedTransaction, reset]);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data) => UpdateTransaction(selectedTransaction._id, data),
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("La transaction a été mise à jour avec succès");
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div>
      {isUpdating && (
        <ActionsModel
          open={isUpdating}
          setIsOpen={setIsUpdating}
          title="Modifier la transaction"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          type="Update"
          errorTitle="Échec de la modification"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 hide-scrollbar overflow-y-auto px-1"
          >
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="type">Type de transaction</FieldLabel>
                  <TextField
                    id="type"
                    select
                    fullWidth
                    {...register("type", { required: "Le type est requis" })}
                  >
                    <MenuItem value="sale">Vente</MenuItem>
                    <MenuItem value="expense">Dépense</MenuItem>
                    <MenuItem value="purchase">Achat</MenuItem>
                  </TextField>
                </Field>

                <Field>
                  <FieldLabel htmlFor="direction">Direction du flux</FieldLabel>
                  <TextField
                    id="direction"
                    select
                    fullWidth
                    {...register("direction", { required: "La direction est requise" })}
                  >
                    <MenuItem value="in">Entrée (Recette)</MenuItem>
                    <MenuItem value="out">Sortie (Dépense)</MenuItem>
                  </TextField>
                </Field>

                <Field>
                  <FieldLabel htmlFor="amount">Montant (MAD)</FieldLabel>
                  <TextField
                    id="amount"
                    type="number"
                    step="0.01"
                    fullWidth
                    {...register("amount", {
                      required: "Le montant est requis",
                      min: { value: 0, message: "Le montant doit être positif" },
                    })}
                  />
                  {errors.amount && (
                    <FieldError>{errors.amount.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="date">Date</FieldLabel>
                  <TextField
                    id="date"
                    type="date"
                    fullWidth
                    {...register("date", { required: "La date est requise" })}
                    InputLabelProps={{ shrink: true }}
                  />
                  {errors.date && (
                    <FieldError>{errors.date.message}</FieldError>
                  )}
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="note">Note / Description</FieldLabel>
                  <TextField
                    id="note"
                    multiline
                    rows={3}
                    fullWidth
                    {...register("note", { required: "La note est requise" })}
                  />
                  {errors.note && (
                    <FieldError>{errors.note.message}</FieldError>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </ActionsModel>
      )}
    </div>
  );
}
