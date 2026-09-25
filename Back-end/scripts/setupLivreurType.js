/**
 * One-time setup: creates (or updates) the "Livreur" EmployeeType with the
 * "Gestion des Livraisons" permission.
 *
 *   node scripts/setupLivreurType.js
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import EmployeeType from "../Employes/typeemplois/EmployeeType.js";

dotenv.config();

await mongoose.connect(process.env.DataBase);
console.log("✅ Connected to database");

const LIVREUR_TYPE = {
  name: "Livreur",
  permissions: [
    {
      model: "Gestion des Livraisons",
      // "Consulter pour Utilisateur" = scoped read (own deliveries only).
      // "Consulter" is the full manager read — livreurs must NOT have it.
      actions: ["Consulter pour Utilisateur", "Modifier"],
    },
  ],
};

const existing = await EmployeeType.findOne({ name: "Livreur" });

if (existing) {
  // Make sure the Gestion des Livraisons entry is present/up-to-date
  const entryIndex = existing.permissions.findIndex(
    (p) => p.model === "Gestion des Livraisons",
  );
  const desiredActions = ["Consulter pour Utilisateur", "Modifier"];
  if (entryIndex === -1) {
    existing.permissions.push({ model: "Gestion des Livraisons", actions: desiredActions });
    await existing.save();
    console.log(`🔄 Added "Gestion des Livraisons" to "Livreur" type (id: ${existing._id})`);
  } else {
    // Replace actions to ensure correct set (e.g. remove old "Consulter")
    existing.permissions[entryIndex].actions = desiredActions;
    await existing.save();
    console.log(`🔄 Updated "Gestion des Livraisons" actions on "Livreur" type (id: ${existing._id})`);
  }
} else {
  const created = await EmployeeType.create(LIVREUR_TYPE);
  console.log(`🆕 Created "Livreur" EmployeeType (id: ${created._id})`);
}

await mongoose.disconnect();
console.log("✅ Done");
