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
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { AddCategory } from "@/Servises/ProductCategories";
// import { Switch } from "@/components/ui/switch"
export default function Add({ isAdding, setIsAdding }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {mutate,isPending} = useMutation({
    mutationFn: AddCategory,
    onSuccess: () => {
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  })
  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // handleSubmitAdd(data);
    console.log(data)
    mutate(data)
  };
  return (
    <div>
      {isAdding && (
        <ActionsModel
          open={isAdding}
          setIsOpen={setIsAdding}
          title="Add Product Type"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Product Type Name</FieldLabel>
                  <Input
                    id="name"
                    autoComplete="off"
                    placeholder="Product Type Name"
                    {...register("name", {
                      required: "Product Type Name is required",
                      minLength: {
                        value: 2,
                        message: "Product Type Name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Product Type Name must be at most 10 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "Product Type Name must contain only letters and spaces",
                      },
                    })}
                  />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="slug">Slug</FieldLabel>
                  <Input
                    id="slug"
                    autoComplete="off"
                    placeholder="Slug"
                    
                    {...register("slug", {
                      required: "Slug is required",
                      minLength: {
                        value: 2,
                        message: "Slug must be at least 2 characters",
                      },
                      maxLength: {
                        value: 5,
                        message: "Slug must be at most 5 characters",
                      },
                    
                    })}
                  />
                  {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </ActionsModel>
      )}
    </div>
  );
}
