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
import { PasswordUpdate } from "@/Servises/Employees";
import { toast } from "react-hot-toast";
import TextField from "@mui/material/TextField";

export default function PasswordReset({ isUpdating, setIsUpdating, selectedEmployee }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm();

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data) => PasswordUpdate(selectedEmployee._id, data),
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Le mot de passe a été mis à jour avec succès");
    },
  });

  const onSubmit = (data) => {
    console.log(data)
    if(data.Conpassword === data.password){
      console.log("good")
      mutate(data);
    }else{
      console.log("bad")
      // setError('Conpassword','le password que vous avis entre ne marche pas avec the first one')
      setError("Conpassword", { type: "manual", message: "Le mot de passe que vous avez constaté ne marche pas avec le premiere" })
    }
  };

  return (
    <ActionsModel
      open={isUpdating}
      setIsOpen={setIsUpdating}
      title={`Réinitialiser le mot de passe : ${selectedEmployee?.name}`}
      handleSubmit={handleSubmit(onSubmit)}
      isPending={isPending}
      isError={isError}
      error={error}
      errorTitle="Échec de la réinitialisation"
      type="Update"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">Nouveau mot de passe</FieldLabel>
              <TextField
                id="password"
                type="password"
                fullWidth
                placeholder="Entrez le nouveau mot de passe"
                {...register("password", { 
                  required: "Le mot de passe est requis",
                  minLength: { value: 8, message: "Minimum 8 caractères" }
                })}
              />
              {errors.password && <FieldError>{errors.password.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmepassword">Confirmer mot de passe</FieldLabel>
              <TextField
                id="confirmepassword"
                type="password"
                fullWidth
                placeholder="Confirmer le mot de passe"
                {...register("Conpassword", { 
                  required: "confirmation du  mot de passe est requis",
                })}
                onChange={
                  (e)=>{
                    console.log(e.target.value === data.password)

                  }
                }
              />
              {errors.Conpassword && <FieldError>{errors.Conpassword.message}</FieldError>}
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </ActionsModel>
  );
}
