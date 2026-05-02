// import React from "react";
// import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
// import {
//   Field,
//   FieldGroup,
//   FieldLabel,
//   FieldSet,
// } from "@/components/ui/field";
// import { useForm, Controller } from "react-hook-form";
// import { useQuery } from "@tanstack/react-query";
// import { GetCategorys } from "@/Servises/ProductCategories";
// import { GetSuppliers } from "@/Servises/Suppliers";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";
// import { 
//   RadioGroup, 
//   Radio, 
//   FormControlLabel, 
//   FormControl,
//   Slider,
//   Box
// } from "@mui/material";

// export default function Filter({ isFiltering, setIsFiltering, onApplyFilters, currentFilters }) {
//   const { control, handleSubmit, reset } = useForm({
//     defaultValues: currentFilters || {
//       category: null,
//       supplier: null,
//       stockStatus: "all",
//       priceRange: [0, 10000],
//     },
//   });

//   const { data: categoriesData } = useQuery({
//     queryKey: ["categories"],
//     queryFn: GetCategorys,
//   });

//   const { data: suppliersData } = useQuery({
//     queryKey: ["suppliers"],
//     queryFn: GetSuppliers,
//   });

//   const onSubmit = (data) => {
//     onApplyFilters(data);
//     setIsFiltering(false);
//   };

//   const handleReset = () => {
//     const defaults = {
//       category: null,
//       supplier: null,
//       stockStatus: "all",
//       priceRange: [0, 10000],
//     };
//     reset(defaults);
//     onApplyFilters(defaults);
//     setIsFiltering(false);
//   };

//   return (
//     <ActionsModel
//       open={isFiltering}
//       setIsOpen={setIsFiltering}
//       title="Filtres avancés"
//       handleSubmit={handleSubmit(onSubmit)}
//       type="Filter"
//     >
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-1">
//         <FieldSet>
//           <FieldGroup className="space-y-6">
//             {/* Category Filter */}
//             <Field>
//               <FieldLabel>Filtrer par Catégorie</FieldLabel>
//               <Controller
//                 name="category"
//                 control={control}
//                 render={({ field: { onChange, value } }) => (
//                   <Autocomplete
//                     options={categoriesData?.categories || []}
//                     getOptionLabel={(option) => option.name || ""}
//                     value={value || null}
//                     onChange={(_, newValue) => onChange(newValue)}
//                     renderInput={(params) => <TextField {...params} placeholder="Toutes les catégories" />}
//                   />
//                 )}
//               />
//             </Field>

//             {/* Supplier Filter */}
//             <Field>
//               <FieldLabel>Filtrer par Fournisseur</FieldLabel>
//               <Controller
//                 name="supplier"
//                 control={control}
//                 render={({ field: { onChange, value } }) => (
//                   <Autocomplete
//                     options={suppliersData?.suppliers || []}
//                     getOptionLabel={(option) => option.name || ""}
//                     value={value || null}
//                     onChange={(_, newValue) => onChange(newValue)}
//                     renderInput={(params) => <TextField {...params} placeholder="Tous les fournisseurs" />}
//                   />
//                 )}
//               />
//             </Field>

//             {/* Stock Status Filter */}
//             <Field>
//               <FieldLabel>État du Stock</FieldLabel>
//               <Controller
//                 name="stockStatus"
//                 control={control}
//                 render={({ field: { onChange, value } }) => (
//                   <RadioGroup value={value} onChange={(e) => onChange(e.target.value)} row>
//                     <FormControlLabel value="all" control={<Radio size="small" />} label="Tout" />
//                     <FormControlLabel value="inStock" control={<Radio size="small" />} label="En Stock" />
//                     <FormControlLabel value="lowStock" control={<Radio size="small" />} label="Stock Faible" />
//                     <FormControlLabel value="outOfStock" control={<Radio size="small" />} label="Épuisé" />
//                   </RadioGroup>
//                 )}
//               />
//             </Field>

//             {/* Price Range Filter */}
//             <Field>
//               <FieldLabel>Tranche de Prix (DH)</FieldLabel>
//               <Box sx={{ px: 2, pt: 2 }}>
//                 <Controller
//                   name="priceRange"
//                   control={control}
//                   render={({ field: { onChange, value } }) => (
//                     <Slider
//                       value={value}
//                       onChange={(_, newValue) => onChange(newValue)}
//                       valueLabelDisplay="on"
//                       min={0}
//                       max={20000}
//                       step={100}
//                       size="small"
//                     />
//                   )}
//                 />
//               </Box>
//             </Field>

//             <div className="flex justify-end pt-4">
//                <button 
//                 type="button" 
//                 onClick={handleReset}
//                 className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
//                >
//                  Réinitialiser les filtres
//                </button>
//             </div>
//           </FieldGroup>
//         </FieldSet>
//       </form>
//     </ActionsModel>
//   );
// }
