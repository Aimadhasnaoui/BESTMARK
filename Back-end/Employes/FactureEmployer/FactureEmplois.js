const mongoose = require("mongoose");

const FactureEmploiSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    salaire: { type: Number, required: true, min: 0 },
    mois: { type: Number, required: true, min: 1, max: 12 },
    annee: { type: Number, required: true, min: 2000 },
    avance: { type: Number, default: 0, min: 0 }, // advance paid during the month
    TotalVerser: { type: Number, default: 0, min: 0 }, // total paid for the month (advance included)
    reste: { type: Number, default: 0 }, // salaire - TotalVerser, calculated on validate
  },
  { timestamps: true },
);

// One payslip per employee per month
FactureEmploiSchema.index({ employee: 1, mois: 1, annee: 1 }, { unique: true });

FactureEmploiSchema.pre("validate", function () {
  if (this.TotalVerser < this.avance) {
    this.invalidate(
      "TotalVerser",
      "Le total versé doit inclure l'avance (total versé ≥ avance)",
    );
  }
  if (this.TotalVerser > this.salaire) {
    this.invalidate("TotalVerser", "Le total versé ne peut pas dépasser le salaire");
  }
  this.reste = Math.max(0, this.salaire - this.TotalVerser);
});

module.exports = mongoose.model("FactureEmploi", FactureEmploiSchema);
