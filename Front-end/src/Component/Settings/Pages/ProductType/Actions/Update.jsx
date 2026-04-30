import React from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCategory } from "@/Servises/ProductCategories";

export default function Update({ isUpdating, setIsUpdating, selectedType }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: selectedType, // Pre-fill the form with selected item data
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => UpdateCategory(selectedType.id, data),
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const onSubmit = (data) => {
    mutate({ id: selectedType.id, data });
  };

  return (
    <div>
      {isUpdating && (
        <ActionsModel
          open={isUpdating}
          setIsOpen={setIsUpdating}
          title="Update Product Type"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="update-name">
                    Product Type Name
                  </FieldLabel>
                  <Input
                    id="update-name"
                    autoComplete="off"
                    placeholder="Product Type Name"
                    {...register("name", {
                      required: "Product Type Name is required",
                      minLength: {
                        value: 2,
                        message:
                          "Product Type Name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message:
                          "Product Type Name must be at most 50 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message:
                          "Product Type Name must contain only letters and spaces",
                      },
                    })}
                  />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="update-slug">Slug</FieldLabel>
                  <Input
                    id="update-slug"
                    autoComplete="off"
                    placeholder="Slug"
                    {...register("slug", {
                      required: "Slug is required",
                      minLength: {
                        value: 2,
                        message: "Slug must be at least 2 characters",
                      },
                      maxLength: {
                        value: 10,
                        message: "Slug must be at most 10 characters",
                      },
                    })}
                  />
                  {errors.slug && (
                    <FieldError>{errors.slug.message}</FieldError>
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
