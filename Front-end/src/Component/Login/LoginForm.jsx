import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Login } from "@/Servises/Autontification";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import TextField from "@mui/material/TextField";
import { Eye, EyeOff } from "lucide-react";
import ErrorAlert from "../UI/ErrorAlert";
import { useNavigate } from "react-router-dom";
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const { mutate, isError, isPending, isSuccess, data,error } = useMutation({
    mutationFn: Login,
    onSuccess:()=>{
     navigate('/')
    }
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="w-[55%] px-16 py-16">
      <div>
        <h1 className="text-[#0F172A] text-[30px] font-bold">Bienvenue</h1>
        <p className="text-[#64748B] text-[16px]">
          Veuillez saisir vos identifiants pour vous connecter.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 my-24">
          {
            isError && 
            <ErrorAlert
            title={''}
            message={error?.response?.data.message}
            >

            </ErrorAlert>

          }
          <Field>
            <FieldLabel htmlFor="username">
              Nom d'utilisateur ou Email
            </FieldLabel>
            <TextField
              id="username"
              placeholder="Saisissez votre nom d'utilisateur ou email"
              fullWidth
              {...register("username", {
                required: "L'identifiant est requis",
              })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F1F5F9", // Couleur de fond personnalisée
                  borderRadius: 0, // Supprime les bordures arrondies
                  height: "54px", // Nouvelle hauteur
                },
              }}
            />
            {errors.username && (
              <FieldError>{errors.username.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <div className="relative w-full">
              <TextField
                id="password"
                placeholder="Saisissez votre mot de passe"
                type={showPassword ? "text" : "password"}
                fullWidth
                {...register("password", {
                  required: "Le mot de passe est requis",
                })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F1F5F9", // Couleur de fond personnalisée
                    borderRadius: 0, // Supprime les bordures arrondies
                    height: "54px", // Nouvelle hauteur
                    paddingRight: "50px", // Laisse de l'espace pour le bouton absolu
                  },
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center justify-center h-full px-2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] cursor-pointer transition-colors text-white py-4 rounded-xs font-medium mt-2"
          >
            {isPending ? "Connexion en cours..." : "Se connecter"}
          </button>
        </div>
      </form>
      <h1 className="text-[#64748B] text-[16px] text-center">© 2026 STORE PILOT. TOUS DROITS RÉSERVÉS.</h1>
    </div>
  );
}
