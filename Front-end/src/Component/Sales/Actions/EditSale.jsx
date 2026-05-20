import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { UpdateSale } from "@/Servises/Sales";
import { GetEmployees } from "@/Servises/Employees";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "react-hot-toast";
import {
  X,
  User,
  Van,
  Phone,
  Banknote,
  IdCard,
  FolderSync,
  Save,
  ClipboardList,
} from "lucide-react";

export default function EditSale({ open, setIsOpen, saleData }) {
  const queryClient = useQueryClient();

  const { data: emploisData } = useQuery({
    queryKey: ["emplois"],
    queryFn: () => GetEmployees(),
  });

  const PaymentMethods = [
    { label: "Espèces", value: "cash", icon: <Banknote size={16} /> },
    { label: "Carte", value: "card", icon: <IdCard size={16} /> },
    { label: "Virement", value: "transfer", icon: <FolderSync size={16} /> },
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerName: "",
      customerPhone: "",
      requiresDelivery: false,
      deliveryId: "",
      deliveryAddress: "",
      deliveryfees: 0,
      paymentMethod: "cash",
      paidAmount: 0,
    },
  });

  // Manually register fields that are not bound to standard HTML inputs in the JSX.
  // This allows React Hook Form's reset() and watch() to track them reactively.
  useEffect(() => {
    register("paymentMethod");
    register("requiresDelivery");
    register("paidAmount");
    register("deliveryfees");
  }, [register]);

  const watchRequiresDelivery = watch("requiresDelivery");
  const watchPaymentMethod = watch("paymentMethod");
  const watchDeliveryfees = watch("deliveryfees");
  const watchPaidAmount = watch("paidAmount");

  // Dynamic calculations for preview
  const subtotal = saleData?.subtotal || 0;
  const discount = saleData?.discount || 0;
  const deliveryfees = watchRequiresDelivery ? Number(watchDeliveryfees || 0) : 0;
  const totalAmount = Math.max(0, subtotal - discount + deliveryfees);
  const paidAmount = Number(watchPaidAmount || 0);
  const remainAmount = Math.max(0, totalAmount - paidAmount);
  const hasRemain = saleData?.remainAmount > 0;

  let paymentStatus = "unpaid";
  if (paidAmount >= totalAmount && totalAmount > 0) {
    paymentStatus = "paid";
  } else if (paidAmount > 0 && paidAmount < totalAmount) {
    paymentStatus = "partial";
  }

  useEffect(() => {
    if (saleData) {
      const isDelivery = !!saleData.requiresDelivery;
      console.log(saleData);

      // Resolve delivery man id
      let resolvedDeliveryManId = "";
      if (saleData.deliveryId) {
        resolvedDeliveryManId = saleData.deliveryId.deliveryMan?._id ||
                                saleData.deliveryId.deliveryMan ||
                                (typeof saleData.deliveryId === "string" ? saleData.deliveryId : "");
      }

      // Resolve address string
      let resolvedAddress = "";
      // Resolve address fields
      let resolvedStreet = "";
      let resolvedCity = "";
      if (saleData.deliveryId?.deliveryAddress) {
        resolvedStreet = saleData.deliveryId.deliveryAddress.street ||
                          (typeof saleData.deliveryId.deliveryAddress === "string" ? saleData.deliveryId.deliveryAddress : "");
        resolvedCity = saleData.deliveryId.deliveryAddress.city || "";
      }

      reset({
        customerName: saleData.customerName || "",
        customerPhone: saleData.customerPhone || "",
        requiresDelivery: isDelivery,
        deliveryId: resolvedDeliveryManId,
        street: resolvedStreet,
        city: resolvedCity,
        deliveryfees: saleData.deliveryfees ?? saleData.deliveryId?.deliveryfees ?? 0,
        paymentMethod: saleData.paymentMethod || "cash",
        paidAmount: saleData.paidAmount || 0,
      });
    }
  }, [saleData, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => UpdateSale(saleData._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast.success("Vente mise à jour avec succès !");
      setIsOpen(false);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Une erreur est survenue lors de la mise à jour.",
      );
    },
  });

  const onSubmit = (data) => {
    const payload = {
      sale: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        requiresDelivery: data.requiresDelivery,
        deliveryAddress: data.requiresDelivery ? `${data.street || ""}${data.city ? ", " + data.city : ""}` : null,
        deliveryfees: data.requiresDelivery ? Number(watchDeliveryfees || 0) : 0,
        paymentMethod: data.paymentMethod,
        paidAmount: Number(watchPaidAmount || 0),
        remainAmount,
        paymentStatus,
      },
      delevrydata: {
        deliveryMan: data.requiresDelivery ? data.deliveryId : null,
        deliveryAddress: data.requiresDelivery ? {
          street: data.street,
          city: data.city,
          phone: data.customerPhone,
          notes: saleData?.notes || "",
        } : null,
        deliveryfees: data.requiresDelivery ? Number(watchDeliveryfees || 0) : 0,
      }
    };
    mutate(payload);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      onClose={handleClose}
      scroll="paper"
    >
      <DialogTitle sx={{ background: "#F8FAFC" }}>
        <div className="flex justify-between items-center my-1 text-slate-800">
          <div>
            <h2 className="text-[#94A3B8] text-[12px] font-bold tracking-wider">
              MODIFIER LA VENTE
            </h2>
            <p className="text-[#0F172A] text-[18px] font-bold">
              {saleData?.invoiceNumber || "N/A"}
            </p>
          </div>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <X />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="space-y-5">
          {/* Customer Details */}
          <div className="border border-slate-100 p-4 rounded-xl space-y-4 bg-slate-50/50">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-[#0F172A]">
              <User className="w-4 h-4 text-blue-600" />
              Détails du Client
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <FieldLabel>Nom du client</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nom du client"
                  {...register("customerName")}
                />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>Téléphone</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Numéro de téléphone"
                  {...register("customerPhone")}
                />
              </div>
            </div>
          </div>

          {/* Delivery Configuration */}
          <div className="border border-slate-100 p-4 rounded-xl space-y-4 bg-slate-50/50">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-[#0F172A]">
                <Van className="w-4 h-4 text-blue-600" />
                Détails de Livraison
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">
                  Activer la livraison
                </span>
                <Switch
                  checked={watchRequiresDelivery}
                  onChange={(e) =>
                    setValue("requiresDelivery", e.target.checked)
                  }
                />
              </div>
            </div>

            {watchRequiresDelivery && (
              <div className="grid grid-cols-1 gap-4 pt-2 border-t border-slate-100/80">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <FieldLabel>Livreur</FieldLabel>
                    <Controller
                      name="deliveryId"
                      control={control}
                      rules={{
                        required: watchRequiresDelivery ? "Veuillez sélectionner un livreur" : false,
                      }}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                          <Autocomplete
                            options={
                              emploisData?.employees?.filter(
                                (emp) => emp.mission?.name === "Livreur"
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
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Sélectionner un livreur..."
                              />
                            )}
                          />
                          {error && <FieldError>{error.message}</FieldError>}
                        </>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <FieldLabel>Frais de livraison (DH)</FieldLabel>
                    <div className="h-[38px] flex items-center px-3 border border-slate-200 rounded-md bg-[#F1F5F9] text-slate-700 text-sm font-medium">
                      {watchDeliveryfees ?? 0}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="flex flex-col gap-1">
                    <FieldLabel>Rue / Adresse</FieldLabel>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Ex: Rue de la Liberté"
                      {...register("street", {
                        required: watchRequiresDelivery ? "La rue / adresse est requise" : false,
                      })}
                    />
                    {errors.street && <FieldError>{errors.street.message}</FieldError>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <FieldLabel>Ville</FieldLabel>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Ex: Agadir"
                      {...register("city", {
                        required: watchRequiresDelivery ? "La ville est requise" : false,
                      })}
                    />
                    {errors.city && <FieldError>{errors.city.message}</FieldError>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment details */}
          <div className="border border-slate-100 p-4 rounded-xl space-y-4 bg-slate-50/50">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-[#0F172A]">
              <Banknote className="w-4 h-4 text-emerald-600" />
              Détails du Paiement
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Method */}
              <div className="space-y-2">
                <FieldLabel>Méthode de paiement</FieldLabel>
                <div className="flex gap-2">
                  {PaymentMethods.map((p) => (
                    <Button
                      key={p.value}
                      type="button"
                      variant="outline"
                      className={`flex-1 gap-2 cursor-pointer transition-all duration-200 ${
                        watchPaymentMethod === p.value 
                          ? "bg-[#0050CB] text-white hover:bg-[#0050CB]/90" 
                          : "hover:bg-slate-100"
                      }`}
                      onClick={() => setValue("paymentMethod", p.value)}
                    >
                      {p.icon}
                      <span className="text-xs font-semibold">{p.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Paid Amount */}
              <div className="flex flex-col gap-1">
                <FieldLabel>Montant Payé (DH)</FieldLabel>
                <div className="h-[38px] flex items-center px-3 border border-slate-200 rounded-md bg-[#F1F5F9] text-slate-700 text-sm font-medium">
                  {watchPaidAmount ?? 0}
                </div>
              </div>
            </div>

            {/* Financial Details Summary in Dialog */}
            <div className="bg-[#0F172A] px-5 py-4 rounded-xl text-white space-y-3 mt-4">
              <div className="flex justify-between items-center text-xs text-[#94A3B8]">
                <span>Sous-total:</span>
                <span className="font-semibold text-white">{subtotal} DH</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-xs text-[#94A3B8]">
                  <span>Remise:</span>
                  <span className="font-semibold text-red-400">-{discount} DH</span>
                </div>
              )}
              {watchRequiresDelivery && (
                <div className="flex justify-between items-center text-xs text-[#94A3B8]">
                  <span>Frais de Livraison:</span>
                  <span className="font-semibold text-white">+{deliveryfees} DH</span>
                </div>
              )}
              <Divider className="bg-slate-800" />
              <div className="flex justify-between items-center text-sm font-bold">
                <span>Montant Total:</span>
                <span className="text-[#38BDF8]">{totalAmount} DH</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold pt-1">
                <span className="text-slate-300">Reste à payer:</span>
                <span className={remainAmount > 0 ? "text-amber-500" : "text-emerald-400"}>
                  {remainAmount} DH
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
        <Divider />
        <DialogActions className="bg-[#F8FAFC] px-6 py-4 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-100 text-slate-700 bg-white font-medium px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 shadow-sm text-sm"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 bg-[#0050CB] hover:bg-[#0040A3] text-white font-semibold px-6 py-2.5 rounded-lg cursor-pointer transition-all duration-200 shadow-md flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={15} />
            {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
