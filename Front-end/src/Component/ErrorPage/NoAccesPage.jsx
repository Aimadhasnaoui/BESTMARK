import React from "react";
import { Link } from "react-router-dom";
import { Lock, ShieldAlert, Home, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NoAccesPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        {/* Animated Icon Container */}
        <div className="relative mb-10 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-red-100 rounded-full animate-pulse opacity-50"></div>
            <div className="relative w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white">
              <ShieldAlert size={48} className="text-red-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 shadow-lg">
              <Lock size={20} className="text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Accès refusé
        </h1>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-6">
          <ShieldAlert size={14} />
          Code d'erreur : 403 Interdit
        </div>

        <p className="text-slate-600 mb-10 text-lg leading-relaxed max-w-md mx-auto">
          Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette zone. 
          Veuillez contacter votre administrateur si vous pensez qu'il s'agit d'une erreur.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button asChild variant="default" size="lg" className="bg-primary hover:bg-secondary shadow-lg shadow-primary/20">
            <Link to="/" className="flex items-center justify-center gap-2">
              <Home size={18} />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login" className="flex items-center justify-center gap-2">
              <UserCheck size={18} />
              Changer de compte
            </Link>
          </Button>
        </div>

        <div className="mt-16 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">
            Besoin d'aide ?
          </h3>
          <p className="text-sm text-slate-500">
            Vérifiez le rôle de votre compte ou demandez l'accès au gestionnaire du système.
          </p>
        </div>
      </div>
    </div>
  );
}
