import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 Illustration */}
        <div className="relative mb-8">
          <h1 className="text-[150px] font-black text-slate-200 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-white rounded-full shadow-xl animate-bounce">
              <Search size={48} className="text-primary" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Page non trouvée
        </h2>
        <p className="text-slate-600 mb-10 leading-relaxed">
          Oups ! La page que vous recherchez n'existe pas ou a été déplacée. 
          Revenons sur le bon chemin.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="default" size="lg" className="w-full sm:w-auto bg-primary hover:bg-secondary transition-all duration-300">
            <Link to="/" className="flex items-center gap-2">
              <Home size={18} />
              Retour au tableau de bord
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <button onClick={() => window.history.back()} className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Retourner
            </button>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-400">
            Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support
          </p>
        </div>
      </div>
    </div>
  );
}
