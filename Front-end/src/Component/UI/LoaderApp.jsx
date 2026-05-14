import React, { useEffect, useState } from "react";
import Logo from "@/assets/Logo/logo.png";
import { Loader2 } from "lucide-react";

export default function LoaderApp() {
  // Messages dynamiques premium qui défilent pendant le chargement
  const loadingMessages = [
    "Connexion sécurisée en cours d'établissement...",
    "Chargement de vos indicateurs de performance...",
    "Synchronisation des mouvements de stock en temps réel...",
    "Préparation de votre interface premium StorePilot...",
  ];
  const [messageIndex, setMessageIndex] = useState(0);

  // Rotation dynamique des messages de chargement
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0F172A] relative overflow-hidden">
      <div className="w-[98%] h-[98%] absolute bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/10 p-10 rounded-3xl  "></div>
      <div className="flex flex-col items-center justify-center  max-w-md w-full mx-4 z-10 transition-all duration-500">
       {/* Spinner et titre de l'espace */}
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-white font-bold text-[20px] tracking-wide">
            Espace StorePilot
          </h3>
        </div>
        {/* Anneaux orbitaux rotatifs avec Logo intégré au centre */}
        <div className="relative mb-8 flex items-center justify-center w-32 h-32">
          {/* Cercle rotatif extérieur pointillé */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/40 animate-spin"></div>
          {/* Cercle rotatif intérieur avec accent */}
          <div className="absolute inset-2 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          {/* Lueur d'énergie centrale */}
          <div className="absolute inset-4 rounded-full bg-blue-500/20 blur-md animate-pulse"></div>
          {/* Logo officiel mis en valeur */}
          <img
            src={Logo}
            alt="StorePilot"
            className="h-12 object-contain relative z-10 drop-shadow-lg brightness-125"
          />
        </div>

 

        {/* Message dynamique en boucle avec transition douce */}
        <div className="h-12 flex items-center justify-center px-4 text-center">
          <p className="text-slate-300 text-[14px] font-medium transition-all duration-300">
            {loadingMessages[messageIndex]}
          </p>
        </div>
      </div>

      {/* Mention de qualité en pied de page */}
      <div className="absolute bottom-8 text-slate-500 text-[12px] tracking-widest uppercase font-semibold">
        Sécurisé & Connecté
      </div>
    </div>
  );
}
