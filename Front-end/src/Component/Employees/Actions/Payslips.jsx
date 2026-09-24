import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ActionsModel } from "@/Component/UI/Models/ActionsModel";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, CheckCircle2, ReceiptText } from "lucide-react";
import {
  AddPayslip,
  GetEmployeePayslips,
  UpdatePayslip,
  DeletePayslip,
} from "@/Servises/Payslips";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const apiError = (error) =>
  error ? { message: error?.response?.data?.message || error.message } : null;

export default function Payslips({ isOpen, setIsOpen, selectedEmployee, canEdit, canDelete }) {
  const queryClient = useQueryClient();
  const today = new Date();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mois: today.getMonth() + 1,
      annee: today.getFullYear(),
      salaire: selectedEmployee?.salary || 0,
      avance: 0,
      TotalVerser: 0,
    },
  });

  const salaire = Number(watch("salaire") || 0);
  const avance = Number(watch("avance") || 0);
  const totalVerser = Number(watch("TotalVerser") || 0);
  const reste = Math.max(0, salaire - totalVerser);

  const { data, isPending: isLoadingList } = useQuery({
    queryKey: ["payslips", selectedEmployee?._id],
    queryFn: () => GetEmployeePayslips(selectedEmployee._id),
    enabled: !!selectedEmployee?._id,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["payslips", selectedEmployee?._id] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  const addMutation = useMutation({
    mutationFn: AddPayslip,
    onSuccess: () => {
      refresh();
      toast.success("Le bulletin de paie a été ajouté avec succès");
      reset({
        mois: today.getMonth() + 1,
        annee: today.getFullYear(),
        salaire: selectedEmployee?.salary || 0,
        avance: 0,
        TotalVerser: 0,
      });
    },
  });

  const settleMutation = useMutation({
    mutationFn: (payslip) => UpdatePayslip(payslip._id, { TotalVerser: payslip.salaire }),
    onSuccess: () => {
      refresh();
      toast.success("Le reste a été versé");
    },
    onError: (error) => toast.error(apiError(error).message),
  });

  const deleteMutation = useMutation({
    mutationFn: (payslip) => DeletePayslip(payslip._id),
    onSuccess: () => {
      refresh();
      toast.success("Le bulletin de paie a été supprimé");
    },
    onError: (error) => toast.error(apiError(error).message),
  });

  const onSubmit = (formData) => {
    addMutation.mutate({
      employee: selectedEmployee._id,
      mois: Number(formData.mois),
      annee: Number(formData.annee),
      salaire: Number(formData.salaire),
      avance: Number(formData.avance),
      TotalVerser: Number(formData.TotalVerser),
    });
  };

  const payslips = data?.payslips || [];

  return (
    <ActionsModel
      open={isOpen}
      setIsOpen={setIsOpen}
      title={`Bulletins de paie — ${selectedEmployee?.name || ""}`}
      description="Enregistrez le salaire versé chaque mois. Le montant versé est ajouté automatiquement aux transactions."
      handleSubmit={handleSubmit(onSubmit)}
      isPending={addMutation.isPending}
      isError={addMutation.isError}
      error={apiError(addMutation.error)}
      errorTitle="Échec de l'ajout"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-1">
        <FieldSet>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="mois">Mois</FieldLabel>
              <TextField
                id="mois"
                select
                fullWidth
                size="small"
                defaultValue={today.getMonth() + 1}
                {...register("mois", { required: "Le mois est requis" })}
              >
                {MONTHS.map((label, index) => (
                  <MenuItem key={label} value={index + 1}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Field>

            <Field>
              <FieldLabel htmlFor="annee">Année</FieldLabel>
              <TextField
                id="annee"
                type="number"
                fullWidth
                size="small"
                {...register("annee", {
                  required: "L'année est requise",
                  min: { value: 2000, message: "Année invalide" },
                })}
              />
              {errors.annee && <FieldError>{errors.annee.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="salaire">Salaire (DH)</FieldLabel>
              <TextField
                id="salaire"
                type="number"
                fullWidth
                size="small"
                {...register("salaire", {
                  required: "Le salaire est requis",
                  min: { value: 0, message: "Le salaire doit être positif" },
                })}
              />
              {errors.salaire && <FieldError>{errors.salaire.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="avance">Avance (DH)</FieldLabel>
              <TextField
                id="avance"
                type="number"
                fullWidth
                size="small"
                {...register("avance", {
                  min: { value: 0, message: "L'avance doit être positive" },
                })}
              />
              {errors.avance && <FieldError>{errors.avance.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="TotalVerser">Total versé, avance incluse (DH)</FieldLabel>
              <TextField
                id="TotalVerser"
                type="number"
                fullWidth
                size="small"
                {...register("TotalVerser", {
                  validate: (value) => {
                    const total = Number(value || 0);
                    if (total < avance) return "Le total versé doit inclure l'avance";
                    if (total > salaire) return "Le total versé ne peut pas dépasser le salaire";
                    return true;
                  },
                })}
              />
              {errors.TotalVerser && <FieldError>{errors.TotalVerser.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Reste à verser</FieldLabel>
              <div
                className={`flex h-10 items-center rounded-md border px-3 font-bold ${
                  reste > 0 ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {reste.toLocaleString("fr-FR")} DH
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>

      <div className="mt-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ReceiptText className="h-4 w-4 text-blue-600" />
          Historique des bulletins
        </h3>

        {isLoadingList ? (
          <Skeleton className="h-16 w-full" />
        ) : payslips.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
            Aucun bulletin de paie pour cet employé.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 rounded-md border border-slate-200">
            {payslips.map((payslip) => (
              <div key={payslip._id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                <div>
                  <p className="font-semibold text-slate-800">
                    {MONTHS[payslip.mois - 1]} {payslip.annee}
                  </p>
                  <p className="text-xs text-slate-500">
                    Salaire {payslip.salaire} DH · Avance {payslip.avance} DH · Versé {payslip.TotalVerser} DH
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                      payslip.reste > 0
                        ? "border-amber-100 bg-amber-50 text-amber-700"
                        : "border-emerald-100 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {payslip.reste > 0 ? `Reste ${payslip.reste} DH` : "Soldé"}
                  </span>
                  {canEdit && payslip.reste > 0 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="cursor-pointer gap-1 text-emerald-700"
                      disabled={settleMutation.isPending}
                      onClick={() => settleMutation.mutate(payslip)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Solder
                    </Button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      aria-label="Supprimer le bulletin"
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(payslip)}
                      className="rounded-full border border-red-600 p-2"
                    >
                      <Trash2 className="h-3.5 w-3.5 cursor-pointer text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ActionsModel>
  );
}
