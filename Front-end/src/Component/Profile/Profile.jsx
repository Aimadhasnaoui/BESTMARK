import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "@/Component/Data/contextApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateEmployee, PasswordUpdate } from "@/Servises/Employees";
import { getImageUrl } from "@/lib/utils";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Camera,
  KeyRound,
  ShieldCheck,
  Calendar,
  Pencil,
  X,
  Check,
  Loader2,
  Lock,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TextField from "@mui/material/TextField";

const PHONE_PATTERN = /^0[67][0-9]{8}$/;

export default function Profile() {
  const { userInfo, setuserInfo } = useContext(DataContext);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("personal");

  // Inline Editing state for Personal Information
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Sync state with userInfo
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        address: userInfo.address || "",
      });
    }
  }, [userInfo]);

  // Profile Update Mutation calling API /employees/:id
  const updateProfileMutation = useMutation({
    mutationFn: (dataToSend) => UpdateEmployee(userInfo?._id, dataToSend),
    onSuccess: (res) => {
      toast.success("Profil mis à jour avec succès !");
      if (res?.employee) {
        setuserInfo(res.employee);
      }
      setSelectedFile(null);
      setImagePreview(null);
      setIsEditingInfo(false);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Erreur lors de la mise à jour";
      toast.error(msg);
    },
  });

  // Handle Direct Photo Selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));

      updateProfileMutation.reset();

      const payload = new FormData();
      if (userInfo?.name) payload.append("name", userInfo.name);
      if (userInfo?.phone) payload.append("phone", userInfo.phone);
      payload.append("image", file);

      updateProfileMutation.mutate(payload);
    }
  };

  // Password Update Mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (dataToSend) => PasswordUpdate(userInfo?._id || "me", dataToSend),
    onSuccess: () => {
      toast.success("Mot de passe mis à jour avec succès !");
      setPasswordData({ password: "", confirmPassword: "" });
      setPasswordError("");
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || "Erreur lors du changement de mot de passe";
      toast.error(msg);
    },
  });

  // Submit Profile Information Form
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (formData.phone && !PHONE_PATTERN.test(formData.phone)) {
      toast.error("Le téléphone doit commencer par 06 ou 07 et contenir 10 chiffres");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("address", formData.address);

    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    updateProfileMutation.mutate(payload);
  };

  // Submit Password Changes
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordData.password) {
      setPasswordError("Veuillez saisir un mot de passe");
      return;
    }
    if (passwordData.password.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (passwordData.password !== passwordData.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }

    setPasswordError("");
    updatePasswordMutation.mutate({ password: passwordData.password });
  };

  const currentImageSrc =
    imagePreview || (userInfo?.image ? getImageUrl(userInfo.image) : null);

  const formattedDate = userInfo?.createdAt
    ? new Date(userInfo.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Non renseigné";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* HEADER SECTION - StorePilot Blue Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-5">
          {/* Avatar with Direct Photo Upload Click */}
          <div className="relative group shrink-0">
            <Avatar className="w-20 h-20 ring-2 ring-slate-100 shadow-xs border border-slate-200 bg-slate-100">
              {currentImageSrc ? (
                <AvatarImage
                  src={currentImageSrc}
                  alt={userInfo?.name}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="text-xl font-bold bg-[#0066FF] text-white">
                  {userInfo?.name ? userInfo.name.slice(0, 2).toUpperCase() : "EM"}
                </AvatarFallback>
              )}
            </Avatar>

            <label
              htmlFor="avatar-upload-direct"
              className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              title="Modifier la photo de profil"
            >
              <Camera className="w-6 h-6 text-white" />
              <input
                id="avatar-upload-direct"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {updateProfileMutation.isPending && selectedFile && (
              <div className="absolute inset-0 rounded-full bg-white/80 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#0066FF] animate-spin" />
              </div>
            )}
          </div>

          {/* User Info Overview */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {userInfo?.name || "Employé"}
              </h1>
              {userInfo?.mission?.name && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0066FF] text-white">
                  {userInfo.mission.name}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-500 font-normal">
              {userInfo?.email || "Pas d'adresse email"}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-0.5">
              <span>Membre depuis le {formattedDate}</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Actif
              </span>
            </div>
          </div>
        </div>

        {/* Change Photo Direct Button */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <label
            htmlFor="header-upload-btn-direct"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs transition-all flex items-center gap-2"
          >
            {updateProfileMutation.isPending && selectedFile ? (
              <Loader2 className="w-3.5 h-3.5 text-[#0066FF] animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5 text-slate-500" />
            )}
            Modifier la photo
            <input
              id="header-upload-btn-direct"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      {/* ERROR ALERT DISPLAY BANNER */}
      {updateProfileMutation.isError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span>
              {updateProfileMutation.error?.response?.data?.message ||
                updateProfileMutation.error?.message ||
                "Erreur lors de la mise à jour de la photo"}
            </span>
          </div>
          <button
            onClick={() => updateProfileMutation.reset()}
            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HORIZONTAL TAB NAVIGATION */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("personal")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "personal"
                ? "border-[#0066FF] text-[#0066FF] bg-blue-50/60 px-3 py-1.5 rounded-t-md"
                : "border-transparent text-slate-500 hover:text-slate-800 px-3 py-1.5"
            }`}
          >
            Personnel
          </button>
          <button
            onClick={() => setActiveTab("job")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "job"
                ? "border-[#0066FF] text-[#0066FF] bg-blue-50/60 px-3 py-1.5 rounded-t-md"
                : "border-transparent text-slate-500 hover:text-slate-800 px-3 py-1.5"
            }`}
          >
            Poste
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "security"
                ? "border-[#0066FF] text-[#0066FF] bg-blue-50/60 px-3 py-1.5 rounded-t-md"
                : "border-transparent text-slate-500 hover:text-slate-800 px-3 py-1.5"
            }`}
          >
            Sécurité
          </button>
          <button
            onClick={() => setActiveTab("permissions")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "permissions"
                ? "border-[#0066FF] text-[#0066FF] bg-blue-50/60 px-3 py-1.5 rounded-t-md"
                : "border-transparent text-slate-500 hover:text-slate-800 px-3 py-1.5"
            }`}
          >
            Permissions
          </button>
        </nav>
      </div>

      {/* TAB CONTENT: PERSONAL */}
      {activeTab === "personal" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Personal Information */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Informations personnelles
              </h2>
              <button
                onClick={() => setIsEditingInfo(!isEditingInfo)}
                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title={isEditingInfo ? "Fermer l'édition" : "Modifier"}
              >
                {isEditingInfo ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Pencil className="w-4 h-4" />
                )}
              </button>
            </div>

            {!isEditingInfo ? (
              /* View Mode - Grid Key-Values */
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs font-medium text-slate-400">Nom complet</p>
                  <p className="text-[15px] font-semibold text-slate-900 mt-0.5">
                    {userInfo?.name || "Non renseigné"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">Email</p>
                  <p className="text-[15px] font-semibold text-slate-900 mt-0.5 truncate">
                    {userInfo?.email || "Non renseigné"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">Téléphone</p>
                  <p className="text-[15px] font-semibold text-slate-900 mt-0.5">
                    {userInfo?.phone || "Non renseigné"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">Statut du compte</p>
                  <p className="text-[15px] font-semibold text-emerald-600 mt-0.5">
                    Actif
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-medium text-slate-400">Adresse</p>
                  <p className="text-[15px] font-semibold text-slate-900 mt-0.5">
                    {userInfo?.address || "Non renseignée"}
                  </p>
                </div>
              </div>
            ) : (
              /* Edit Mode - Form Inputs */
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Nom complet
                  </label>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Email
                  </label>
                  <TextField
                    fullWidth
                    size="small"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Téléphone
                  </label>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Adresse
                  </label>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingInfo(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="px-4 py-1.5 bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Enregistrer
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Card 2: Account Details & Overview */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Aperçu du compte
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs font-medium text-slate-400">ID Employé</p>
                <p className="text-[13.5px] font-mono font-semibold text-slate-700 mt-0.5 truncate">
                  {userInfo?._id || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Date d'inscription</p>
                <p className="text-[15px] font-semibold text-slate-900 mt-0.5">
                  {formattedDate}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Mission principale</p>
                <p className="text-[15px] font-semibold text-[#0066FF] mt-0.5">
                  {userInfo?.mission?.name || "Non définie"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Salaire de base</p>
                <p className="text-[15px] font-semibold text-slate-900 mt-0.5">
                  {userInfo?.salary != null ? `${userInfo.salary} DH` : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: JOB */}
      {activeTab === "job" && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Informations sur le poste
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <p className="text-xs font-medium text-slate-400">Mission / Postes</p>
              <p className="text-[16px] font-bold text-slate-900 mt-0.5">
                {userInfo?.mission?.name || "Non assigné"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Salaire contractuel</p>
              <p className="text-[16px] font-bold text-slate-900 mt-0.5">
                {userInfo?.salary != null ? `${userInfo.salary} DH` : "Non spécifié"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Statut d'activité</p>
              <p className="text-[15px] font-semibold text-emerald-600 mt-0.5 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Employé Actif
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Date d'embauche</p>
              <p className="text-[15px] font-semibold text-slate-900 mt-0.5">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SECURITY */}
      {activeTab === "security" && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6 max-w-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Sécurité & Mot de passe
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Modifiez votre mot de passe pour sécuriser l'accès à votre compte.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700">
                {passwordError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Nouveau mot de passe
              </label>
              <TextField
                fullWidth
                size="small"
                type="password"
                value={passwordData.password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, password: e.target.value })
                }
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <TextField
                fullWidth
                size="small"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updatePasswordMutation.isPending}
                className="px-4 py-2 bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {updatePasswordMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <KeyRound className="w-3.5 h-3.5" />
                )}
                Changer le mot de passe
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: PERMISSIONS */}
      {activeTab === "permissions" && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Droits d'accès & Permissions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Permissions configurées pour le rôle "{userInfo?.mission?.name || "Employé"}".
            </p>
          </div>

          {userInfo?.mission?.permissions &&
          userInfo.mission.permissions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userInfo.mission.permissions.map((perm, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">
                      {perm.model}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {perm.canView && (
                      <span className="text-[11px] bg-white border border-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded">
                        Lecture
                      </span>
                    )}
                    {perm.canAdd && (
                      <span className="text-[11px] bg-blue-50 border border-blue-200 text-[#0066FF] font-medium px-2 py-0.5 rounded">
                        Ajout
                      </span>
                    )}
                    {perm.canEdit && (
                      <span className="text-[11px] bg-blue-50 border border-blue-200 text-blue-700 font-medium px-2 py-0.5 rounded">
                        Modification
                      </span>
                    )}
                    {perm.canDelete && (
                      <span className="text-[11px] bg-red-50 border border-red-200 text-red-700 font-medium px-2 py-0.5 rounded">
                        Suppression
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              Aucune permission explicite pour ce poste.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
