import React, { useEffect, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AddSale } from "@/Servises/Sales";
import { GetSuppliers } from "@/Servises/Suppliers";
import { GetProducts } from "@/Servises/Products";
import { GetEmployees } from "@/Servises/Employees";
import { toast } from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Plus,
  Trash2,
  ShoppingCart,
  PackageSearch,
  ArrowLeft,
  ArrowRight,
  ClipboardPenLine,
  Package,
  Banknote,
  Van,
  User,
  IdCard,
  FolderSync,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { DataContext } from "@/Component/Data/contextApi";
import Switch from "@mui/material/Switch";
import ErrorAlert from "@/Component/Ui/ErrorAlert";
import IconButton from "@mui/material/IconButton";
import ProductPart from "./AddSelleParts/ProductPart";
import CustomerPart from "./AddSelleParts/CustomerPart";
import PaymentPart from "./AddSelleParts/PaymentPart";
import FactureSell from "./AddSelleParts/FactureSell";
export default function AddSlle() {
  const { openAddSellerModal, setOpenAddSellerModal, userInfo } =
    useContext(DataContext);
  const [NeedDelevry, setNeedDelevry] = useState(false);
  const [pages, setpages] = useState({
    currentPage: 0,
    maxPage: 2,
  });
  const [price, setprice] = useState({
    subtotal: 0,
    totalAmount: 0,
    remainAmount: 0,
  });
  const PaymentMethods = [
    { label: "Espèces", value: "cash", icon: <Banknote /> },
    { label: "Carte", value: "card", icon: <IdCard /> },
    { label: "Virement", value: "transfer", icon: <FolderSync /> },
  ];

  const {
    register,
    reset,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      discount: 0,
      deliveryfees: 0,
      paidAmount: 0,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const watchItems = watch("items");
  const paidAmount = watch("paidAmount");
  const discount = watch("discount");
  const deliveryfees = watch("deliveryfees");

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: () => GetProducts(),
  });
  const { data: emploisData } = useQuery({
    queryKey: ["emplois"],
    queryFn: () => GetEmployees(),
  });
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    isSuccess,
    isError,
    error,
    reset: resetMutation,
  } = useMutation({
    mutationFn: AddSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("La vente a été enregistrée avec succès !");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Une erreur est survenue lors de l'enregistrement.",
      );
    },
  });

  useEffect(() => {
    register("paymentMethod", {
      required: "Veuillez sélectionner une méthode de paiement",
    });
  }, [register]);

  useEffect(() => {
    // Calculate subtotal dynamically using quantity * buyingPrice
    const subtotalprice =
      watchItems?.reduce(
        (accumulator, currentValue) =>
          accumulator +
          (currentValue.quantity || 0) * (currentValue.buyingPrice || 0),
        0,
      ) || 0;

    const discVal = Number(discount || 0);
    const delFeesVal = NeedDelevry ? Number(deliveryfees || 0) : 0;
    let paidVal = Number(paidAmount || 0);

    const total = Math.max(0, subtotalprice - discVal + delFeesVal);

    if (paidVal > total && total > 0) {
      setValue("paidAmount", total);
      paidVal = total;
    }

    const remain = Math.max(0, total - paidVal);

    let status = "unpaid";
    if (paidVal >= total && total > 0) {
      status = "paid";
    } else if (paidVal > 0 && paidVal < total) {
      status = "partial";
    }

    setprice({
      subtotal: subtotalprice,
      totalAmount: total,
      remainAmount: remain,
    });

    setValue("paymentStatus", status);
  }, [watchItems, discount, deliveryfees, paidAmount, NeedDelevry, setValue]);
  // 1. On liste les champs par numéro de page
  const FIELDS_BY_PAGE = {
    0: ["items", "product"],
    1: NeedDelevry
      ? [
          "customerName",
          "customerPhone",
          "deliveryId",
          "deliveryAddress",
          "deliveryfees",
        ]
      : ["customerName", "customerPhone"],
    2: ["paymentMethod", "paidAmount"],
  };

  // 2. On rend la fonction asynchrone
  async function ToglePages(direction) {
    if (direction === "next") {
      // Obtenir la liste des champs de la page active
      const fieldsToValidate = FIELDS_BY_PAGE[pages.currentPage];

      // Déclencher la validation uniquement pour ces champs
      const isStepValid = await trigger(fieldsToValidate);
      console.log("Étape valide ?", isStepValid);

      // Si la page contient une erreur, on arrête la fonction ici !
      if (!isStepValid) return;

      // Si tout est valide, on passe à la suite
      if (pages.currentPage !== pages.maxPage) {
        setpages((pre) => ({
          ...pre,
          currentPage: pre.currentPage + 1,
        }));
      } else {
        handleSubmit(onSubmit)();
      }
    } else if (direction === "prev") {
      if (pages.currentPage > 0) {
        setpages((pre) => ({
          ...pre,
          currentPage: pre.currentPage - 1,
        }));
      }
    }
  }

  function handleClose() {
    setOpenAddSellerModal(false);
    reset(); // Reset form values
    resetMutation(); // Reset mutation state
    setpages({
      currentPage: 0,
      maxPage: 2,
    });
  }
  const onSubmit = (data) => {
    delete data.product;
    const sendData = {
      ...data,
      subtotal: price.subtotal,
      remainAmount: price.remainAmount,
      servedBy: userInfo?._id,
      requiresDelivery: NeedDelevry,
      totalAmount: price.totalAmount,
      deliveryId:data.deliveryMan,
    };
    console.log(sendData);
    mutate(sendData);
  };

  return (
    <Dialog
      open={openAddSellerModal}
      fullWidth
      maxWidth="lg"
      onClose={handleClose}
      scroll="paper"
    >
      <DialogTitle>
        <div className="w-full flex gap-2 items-center">
          <div className="bg-[#EFF6FF] p-2 rounded-md">
            <ShoppingCart size={24} color="#2563EB"></ShoppingCart>
          </div>
          <Typography variant="h6" component="div">
            Ajouter une nouvelle vente
          </Typography>
        </div>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <X />
        </IconButton>
      </DialogTitle>
      {isSuccess ? (
        <>
          <DialogContent className="flex flex-col items-center justify-center py-12 text-center bg-slate-950/5">
            <div className="bg-emerald-50 text-emerald-500 p-4 rounded-full mb-4">
              <CheckCircle size={48} />
            </div>
            <Typography variant="h5" className="text-slate-800 font-bold mb-2">
              Vente Enregistrée avec Succès !
            </Typography>
            <Typography
              variant="body2"
              className="text-slate-500 max-w-md mb-6"
            >
              La vente a été enregistrée dans le système, le stock a été mis à
              jour et la transaction financière a été créée.
            </Typography>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 w-full max-w-sm mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">
                  Montant Total :
                </span>
                <span className="font-bold text-slate-800">
                  {price.totalAmount.toFixed(2)} DH
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">
                  Montant Payé :
                </span>
                <span className="font-bold text-emerald-600">
                  {(watch("paidAmount") || 0).toFixed(2)} DH
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">
                  Reste à payer :
                </span>
                <span className="font-bold text-amber-600">
                  {price.remainAmount.toFixed(2)} DH
                </span>
              </div>
            </div>
          </DialogContent>
          <Divider />
          <DialogActions>
            <div className="flex justify-end w-full py-2 px-4">
              <button
                onClick={handleClose}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2 rounded-md cursor-pointer transition-all duration-200 shadow-md"
              >
                Fermer
              </button>
            </div>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
            {isError && (
              <div className="mb-4">
                <ErrorAlert error={error} title="Échec de la vente" />
              </div>
            )}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-4 items-stretch flex-1"
            >
              <div className="flex-1 flex flex-col gap-4 h-full">
                {pages.currentPage === 0 && (
                  <ProductPart
                    Controller={Controller}
                    append={append}
                    fields={fields}
                    errors={errors}
                    control={control}
                    watchItems={watchItems}
                    productsData={productsData}
                    register={register}
                    remove={remove}
                  ></ProductPart>
                )}
                {pages.currentPage === 1 && (
                  <CustomerPart
                    register={register}
                    control={control}
                    errors={errors}
                    NeedDelevry={NeedDelevry}
                    setNeedDelevry={setNeedDelevry}
                    emploisData={emploisData}
                    productsData={productsData}
                    Controller={Controller}
                  />
                )}
                {pages.currentPage === pages.maxPage && (
                  <PaymentPart
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    errors={errors}
                    price={price}
                    paidAmount={paidAmount}
                    PaymentMethods={PaymentMethods}
                  />
                )}
              </div>
              <FactureSell
                price={price}
                register={register}
                NeedDelevry={NeedDelevry}
                deliveryfees={deliveryfees}
              />
            </form>
          </DialogContent>
          <Divider></Divider>
          <DialogActions>
            <div className="flex justify-between items-center w-full py-2 px-4">
              <button
                onClick={handleClose}
                className="text-[#94A3B8] font-normal text-[16px] cursor-pointer"
                disabled={isPending}
              >
                Annuler & fermer
              </button>
              <div className="flex gap-4">
                <button
                  className="flex items-center gap-1.5 py-2 px-3 rounded-md cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => ToglePages("prev")}
                  disabled={pages.currentPage === 0 || isPending}
                >
                  <ArrowLeft size={12}></ArrowLeft>
                  Précédent
                </button>
                <button
                  className="flex items-center gap-1.5 bg-[#0050CB] text-white py-2 px-3 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => ToglePages("next")}
                  disabled={isPending}
                >
                  {isPending
                    ? "Enregistrement..."
                    : pages.currentPage === pages.maxPage
                      ? "Confirmer la vente"
                      : "Prochaine étape"}
                  {!isPending && pages.currentPage !== pages.maxPage && (
                    <ArrowRight size={12}></ArrowRight>
                  )}
                </button>
              </div>
            </div>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
