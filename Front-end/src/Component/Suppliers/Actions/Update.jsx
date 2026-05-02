import React, { useEffect } from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateSupplier } from "@/Servises/Suppliers";
import { toast } from "sonner";

export default function Update({ isUpdating, setIsUpdating, selectedSupplier }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (selectedSupplier) {
      reset({
        name: selectedSupplier.name,
        company: selectedSupplier.company,
        email: selectedSupplier.email,
        phone: selectedSupplier.phone,
        address: selectedSupplier.address,
      });
    }
  }, [selectedSupplier, reset]);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data) => UpdateSupplier(selectedSupplier._id, data),
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Le fournisseur a été mis à jour avec succès");
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
          title="Modifier le fournisseur"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de la mise à jour"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="name">Nom complet</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Ex: Jean Dupont"
                    {...register("name", { required: "Le nom est requis" })}
                  />
                  {errors.name && <FieldError>{errors.name.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="company">Entreprise</FieldLabel>
                  <Input
                    id="company"
                    placeholder="Ex: Tech Solutions SARL"
                    {...register("company")}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
                  <Input
                    id="phone"
                    placeholder="Ex: 06 12 34 56 78"
                    {...register("phone")}
                  />
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@mail.com"
                    {...register("email", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Adresse email invalide"
                      }
                    })}
                  />
                  {errors.email && <FieldError>{errors.email.message}</FieldError>}
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="address">Adresse</FieldLabel>
                  <Textarea
                    id="address"
                    placeholder="Adresse complète..."
                    {...register("address")}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </ActionsModel>
      )}
    </div>
  );
}
