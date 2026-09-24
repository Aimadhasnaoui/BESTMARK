// Demo data generator for BESTMARK / StorePilot.
//
//   npm run seed          -> adds demo data to the database
//   npm run seed:reset    -> first EMPTIES the collections below, then adds demo data
//
// Filled: categories, suppliers, products, purchases, sales, deliveries,
// customer requests, stock movements, transactions, payslips.
// Never touched: employees, employee types, permission models (existing employees are
// reused as sellers, buyers and delivery men).
//
// Activity is simulated day by day over the last MONTHS_BACK months so that stock,
// Number_of_sales, stock movements and transactions stay consistent, exactly like the
// controllers would have produced them.
import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { fakerFR as faker } from "@faker-js/faker";
import Employee from "./Employes/Emplye/Employee.js";
import Category from "./Products/Productcategories/Categrories.js";
import Supplier from "./Supplieres/Supplier.js";
import Product from "./Products/Product/Products.js";
import Purchase from "./Purchases/Purchases.js";
import Sale from "./sales/sales.js";
import Delivery from "./Delivery/Delivery.js";
import CustomerRequest from "./Customers/CustomerRequest.js";
import StockMovement from "./stockMovements/StockMovement.js";
import Transaction from "./Transactions/Transaction.js";
import FactureEmploi from "./Employes/FactureEmployer/FactureEmplois.js";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESET = process.argv.includes("--reset");
const MONTHS_BACK = 6;
faker.seed(2026); // same data on every run

// ---------------------------------------------------------------- catalogue
const CATALOG = [
  {
    category: "Épicerie", slug: "epicerie", colors: ["#f59e0b", "#b45309"],
    products: [
      ["Huile d'olive extra vierge 1L", 52, 69], ["Riz basmati 5kg", 78, 99],
      ["Sucre en morceaux 1kg", 9, 12], ["Farine de blé 5kg", 28, 36],
      ["Thé vert Gunpowder 200g", 14, 19], ["Café moulu 250g", 22, 30],
      ["Pâtes spaghetti 500g", 5, 8], ["Lentilles 1kg", 13, 17],
    ],
  },
  {
    category: "Boissons", slug: "boissons", colors: ["#0ea5e9", "#0369a1"],
    products: [
      ["Eau minérale 1,5L (pack de 6)", 18, 24], ["Jus d'orange 1L", 11, 15],
      ["Soda cola 1L", 7, 10], ["Lait demi-écrémé 1L", 6, 8],
      ["Boisson énergisante 250ml", 9, 13],
    ],
  },
  {
    category: "Produits laitiers", slug: "produits-laitiers", colors: ["#a3e635", "#4d7c0f"],
    products: [
      ["Yaourt nature (pack de 4)", 8, 11], ["Fromage en portions x16", 18, 24],
      ["Beurre doux 250g", 16, 21], ["Lben 1L", 6, 8],
    ],
  },
  {
    category: "Hygiène & beauté", slug: "hygiene-beaute", colors: ["#ec4899", "#9d174d"],
    products: [
      ["Shampooing 400ml", 24, 34], ["Savon de Marseille x3", 12, 17],
      ["Dentifrice 75ml", 11, 16], ["Gel douche 500ml", 19, 27],
      ["Déodorant spray 150ml", 21, 29],
    ],
  },
  {
    category: "Entretien", slug: "entretien", colors: ["#14b8a6", "#0f766e"],
    products: [
      ["Lessive en poudre 3kg", 45, 59], ["Liquide vaisselle 750ml", 10, 14],
      ["Eau de Javel 2L", 8, 12], ["Nettoyant sol 1L", 12, 17],
      ["Éponges (lot de 5)", 6, 10],
    ],
  },
  {
    category: "Électroménager", slug: "electromenager", colors: ["#6366f1", "#3730a3"],
    products: [
      ["Bouilloire électrique 1,7L", 120, 179], ["Mixeur plongeant 600W", 190, 269],
      ["Fer à repasser vapeur", 160, 229], ["Grille-pain 2 fentes", 140, 199],
      ["Ventilateur sur pied", 230, 329],
    ],
  },
  {
    category: "Téléphonie & accessoires", slug: "telephonie-accessoires", colors: ["#64748b", "#1e293b"],
    products: [
      ["Chargeur rapide USB-C 25W", 45, 79], ["Écouteurs sans fil", 110, 179],
      ["Câble USB-C 1m", 15, 29], ["Batterie externe 10000mAh", 95, 149],
      ["Coque de protection", 20, 45],
    ],
  },
  {
    category: "Papeterie", slug: "papeterie", colors: ["#f97316", "#9a3412"],
    products: [
      ["Cahier 96 pages", 5, 8], ["Stylos à bille (lot de 10)", 12, 18],
      ["Ramette papier A4 500 feuilles", 38, 52], ["Classeur à levier", 14, 22],
    ],
  },
];

const SUPPLIERS = [
  { company: "Distribution Atlas SARL", city: "Casablanca", categories: ["Épicerie", "Produits laitiers"] },
  { company: "Maghreb Boissons", city: "Fès", categories: ["Boissons"] },
  { company: "Rif Hygiène & Co", city: "Tanger", categories: ["Hygiène & beauté", "Entretien"] },
  { company: "Casa Électro Import", city: "Casablanca", categories: ["Électroménager"] },
  { company: "Souss Mobile Accessoires", city: "Agadir", categories: ["Téléphonie & accessoires"] },
  { company: "Bureau Plus Maroc", city: "Rabat", categories: ["Papeterie"] },
];

const CITIES = ["Casablanca", "Rabat", "Fès", "Marrakech", "Tanger", "Agadir", "Meknès", "Oujda", "Kénitra", "Tétouan"];

// ---------------------------------------------------------------- helpers
const int = (min, max) => faker.number.int({ min, max });
const pick = (list) => faker.helpers.arrayElement(list);
const chance = (p) => faker.number.float({ min: 0, max: 1 }) < p;
const roundTo = (value, step) => Math.round(value / step) * step;
const phone = () => `0${pick(["6", "7"])}${faker.string.numeric(8)}`;
const pad = (n, size = 2) => String(n).padStart(size, "0");
const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const addDays = (d, days) => new Date(d.getTime() + days * 86400000);
const atHour = (day, hMin, hMax) => {
  const d = new Date(day);
  d.setHours(int(hMin, hMax), int(0, 59), int(0, 59), 0);
  return d;
};
const MONTH_NAMES = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

// weighted pick of distinct products that still have stock
const pickProducts = (products, count) => {
  const available = products.filter((p) => p.doc.quantity > 0);
  const chosen = [];
  while (chosen.length < count && available.length > 0) {
    const total = available.reduce((sum, p) => sum + p.demand, 0);
    let r = faker.number.float({ min: 0, max: total });
    const index = available.findIndex((p) => (r -= p.demand) <= 0);
    chosen.push(available.splice(index === -1 ? 0 : index, 1)[0]);
  }
  return chosen;
};

const makeImage = async (name, [c1, c2], filename) => {
  const dir = path.join(__dirname, "uploads", "products");
  fs.mkdirSync(dir, { recursive: true });
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const label = (name.length > 26 ? `${name.slice(0, 25)}…` : name)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="600" height="600" fill="url(#g)"/>
    <text x="300" y="290" font-family="Arial, sans-serif" font-size="160" font-weight="700"
      fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    <text x="300" y="480" font-family="Arial, sans-serif" font-size="34"
      fill="#ffffff" fill-opacity="0.85" text-anchor="middle">${label}</text>
  </svg>`;
  const target = path.join(dir, filename);
  try {
    await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(target);
  } catch {
    // no font rendering available: plain colour square
    await sharp({ create: { width: 600, height: 600, channels: 3, background: c1 } })
      .webp({ quality: 80 })
      .toFile(target);
  }
  const backendUrl = (process.env.BACKEND_URL || "").replace(/\/+$/, "");
  return `${backendUrl}/uploads/products/${filename}`;
};

// ---------------------------------------------------------------- main
const run = async () => {
  if (process.env.envirement !== "development") {
    throw new Error('Seed refusé : envirement doit valoir "development" dans .env');
  }
  await mongoose.connect(`${process.env.DataBase}`);
  console.log("Connecté à MongoDB");

  if (RESET) {
    console.log("--reset : suppression des données existantes (employés, types et permissions conservés)…");
    await Promise.all(
      [Category, Supplier, Product, Purchase, Sale, Delivery, CustomerRequest, StockMovement, Transaction, FactureEmploi]
        .map((Model) => Model.deleteMany({})),
    );
    const dir = path.join(__dirname, "uploads", "products");
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).filter((f) => f.startsWith("seed-")).forEach((f) => fs.unlinkSync(path.join(dir, f)));
    }
  }

  const employees = await Employee.find({ isActive: true }).select("name salary createdAt");
  if (employees.length === 0) {
    throw new Error("Aucun employé actif : créez au moins un employé avant de lancer le seed.");
  }
  console.log(`${employees.length} employé(s) actif(s) réutilisé(s)`);

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - MONTHS_BACK, 1);
  const docs = {
    categories: [], suppliers: [], products: [], purchases: [], sales: [], deliveries: [],
    movements: [], transactions: [], payslips: [], requests: [],
  };
  const seller = () => pick(employees);

  // --- categories (reused when a category with the same name already exists)
  const categoryByName = {};
  for (const entry of CATALOG) {
    const existing = await Category.findOne({ name: new RegExp(`^${entry.category}$`, "i") });
    if (existing) {
      categoryByName[entry.category] = existing;
    } else {
      const doc = new Category({ name: entry.category, slug: entry.slug, createdAt: start, updatedAt: start });
      categoryByName[entry.category] = doc;
      docs.categories.push(doc);
    }
  }

  // --- suppliers
  const supplierByCategory = {};
  for (const s of SUPPLIERS) {
    const domain = s.company.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "") + ".ma";
    const doc = new Supplier({
      name: faker.person.fullName(),
      company: s.company,
      email: `contact@${domain}`,
      phone: `05${faker.string.numeric(8)}`,
      address: `${int(1, 250)} ${pick(["Bd", "Av.", "Rue"])} ${faker.person.lastName()}, ${s.city}`,
      productTypes: s.categories.map((c) => categoryByName[c]._id),
      createdAt: start,
      updatedAt: start,
    });
    s.categories.forEach((c) => (supplierByCategory[c] = doc));
    docs.suppliers.push(doc);
  }

  // --- products (+ initial stock movement, like CreateProduct does)
  const products = [];
  let imageIndex = 0;
  for (const entry of CATALOG) {
    for (const [name, buyingPrice, sellingPrice] of entry.products) {
      const noRestock = chance(0.15); // never re-purchased: will drift to low / out of stock
      const createdAt = addDays(start, -int(1, 5));
      const doc = new Product({
        name,
        description: `${name} — ${entry.category.toLowerCase()}, qualité garantie.`,
        buyingPrice,
        sellingPrice,
        image: await makeImage(name, entry.colors, `seed-${pad(++imageIndex, 3)}.webp`),
        category: categoryByName[entry.category]._id,
        quantity: noRestock ? int(8, 16) : int(20, 45),
        hassupplier: !noRestock,
        supplier: noRestock ? undefined : supplierByCategory[entry.category]._id,
        minStockAlert: pick([5, 5, 5, 3, 8, 10]),
        Number_of_sales: 0,
        createdAt,
        updatedAt: now,
      });
      docs.products.push(doc);
      docs.movements.push(new StockMovement({
        product: doc._id, createdBy: seller()._id, type: "adjustment",
        quantity: doc.quantity, quantityBefore: 0, quantityAfter: doc.quantity,
        referenceModel: "manual", note: "Stock initial à la création du produit",
        createdAt, updatedAt: createdAt,
      }));
      products.push({
        doc,
        noRestock,
        // cheap everyday products sell more often than appliances
        demand: sellingPrice < 30 ? 6 : sellingPrice < 100 ? 3 : 1,
      });
    }
  }

  // --- invoice / purchase numbers that don't collide with existing ones
  const usedInvoices = new Set((await Sale.find({}, "invoiceNumber").lean()).map((s) => s.invoiceNumber));
  const counters = {};
  const nextNumber = (prefix, date) => {
    const key = `${prefix}-${ymd(date)}`;
    let number;
    do {
      counters[key] = (counters[key] || 0) + 1;
      number = `${key}-${pad(counters[key], 3)}`;
    } while (usedInvoices.has(number));
    usedInvoices.add(number);
    return number;
  };

  const addMovement = (product, type, quantity, date, referenceModel, referenceId, createdBy, note) => {
    const before = product.doc.quantity;
    product.doc.quantity = before + quantity;
    docs.movements.push(new StockMovement({
      product: product.doc._id, createdBy, type, quantity,
      quantityBefore: before, quantityAfter: product.doc.quantity,
      referenceModel, referenceId, note, createdAt: date, updatedAt: date,
    }));
  };

  const addTransaction = (fields, date) => {
    docs.transactions.push(new Transaction({ ...fields, date, createdAt: date, updatedAt: date }));
  };

  // --- purchases: restock what is running low, grouped by supplier
  const restock = (day) => {
    for (const supplier of docs.suppliers) {
      const low = products.filter((p) => !p.noRestock
        && String(p.doc.supplier) === String(supplier._id)
        && p.doc.quantity <= p.doc.minStockAlert + 6);
      if (low.length === 0) continue;

      const date = atHour(day, 8, 11);
      const buyer = seller();
      const items = low.map((p) => {
        const quantity = roundTo(int(20, 45), 5);
        return { product: p, quantity, buyingPrice: p.doc.buyingPrice, itemTotal: quantity * p.doc.buyingPrice };
      });
      const totalAmount = items.reduce((sum, i) => sum + i.itemTotal, 0);
      const roll = faker.number.float({ min: 0, max: 1 });
      const paidAmount = roll < 0.7 ? totalAmount : roll < 0.9 ? roundTo(totalAmount * faker.number.float({ min: 0.3, max: 0.8 }), 10) : 0;
      const purchase = new Purchase({
        code: nextNumber("ACH", date),
        supplier: supplier._id,
        createdBy: buyer._id,
        items: items.map((i) => ({ product: i.product.doc._id, quantity: i.quantity, buyingPrice: i.buyingPrice, itemTotal: i.itemTotal })),
        totalAmount,
        paidAmount,
        debts: Math.max(0, totalAmount - paidAmount),
        paymentStatus: paidAmount >= totalAmount ? "paid" : paidAmount > 0 ? "partial" : "unpaid",
        paymentMethod: pick(["transfer", "transfer", "cash", "card"]),
        purchaseDate: date,
        createdAt: date,
        updatedAt: date,
      });
      docs.purchases.push(purchase);
      items.forEach((i) => addMovement(i.product, "purchase", i.quantity, date, "Purchase", purchase._id, buyer._id));
      addTransaction({
        type: "purchase", direction: "out", amount: totalAmount,
        referenceModel: "Purchase", referenceId: purchase._id, performedBy: buyer._id,
        note: `Achat ${purchase.code} : ${items.map((i) => `${i.product.doc.name} x${i.quantity}`).join(", ")} — fournisseur : ${supplier.company}`,
      }, date);
    }
  };

  // --- one sale (+ stock movements, transaction, optional delivery)
  const pendingReturns = [];
  const makeSale = (day) => {
    const lines = pickProducts(products, pick([1, 1, 1, 2, 2, 3, 4]));
    if (lines.length === 0) return;
    const date = atHour(day, 9, 21);
    if (date > now) return;
    const employee = seller();

    const items = lines.map((p) => {
      const quantity = Math.min(p.doc.quantity, p.doc.sellingPrice < 30 ? int(1, 4) : 1);
      return { product: p, quantity, sellingPrice: p.doc.sellingPrice, itemTotal: quantity * p.doc.sellingPrice };
    });
    const subtotal = items.reduce((sum, i) => sum + i.itemTotal, 0);
    const discount = chance(0.12) ? Math.round(subtotal * pick([0.05, 0.1])) : 0;
    const requiresDelivery = chance(0.2);
    const deliveryfees = requiresDelivery ? pick([20, 30, 40, 50]) : 0;
    const totalAmount = subtotal - discount + deliveryfees;
    const roll = faker.number.float({ min: 0, max: 1 });
    const paidAmount = roll < 0.85 ? totalAmount : roll < 0.97 ? roundTo(totalAmount * faker.number.float({ min: 0.3, max: 0.8 }), 5) : 0;
    const customerName = requiresDelivery || chance(0.7) ? faker.person.fullName() : null;
    const customerPhone = customerName && (requiresDelivery || chance(0.5)) ? phone() : null;

    const sale = new Sale({
      invoiceNumber: nextNumber("INV", date),
      servedBy: employee._id,
      items: items.map((i) => ({ product: i.product.doc._id, quantity: i.quantity, sellingPrice: i.sellingPrice, itemTotal: i.itemTotal })),
      subtotal, discount, totalAmount, deliveryfees,
      paymentMethod: pick(["cash", "cash", "cash", "card", "card", "transfer"]),
      paymentStatus: paidAmount >= totalAmount ? "paid" : paidAmount > 0 ? "partial" : "unpaid",
      paidAmount,
      remainAmount: Math.max(0, totalAmount - paidAmount),
      customerName, customerPhone, requiresDelivery,
      saleDate: date, createdAt: date, updatedAt: date,
    });

    items.forEach((i) => {
      addMovement(i.product, "sale", -i.quantity, date, "Sale", sale._id, employee._id);
      i.product.doc.Number_of_sales += i.quantity;
      if (chance(0.01)) {
        pendingReturns.push({ date: addDays(date, int(1, 5)), product: i.product, sale, employee });
      }
    });

    if (paidAmount > 0) {
      addTransaction({
        type: "sale", direction: "in", amount: paidAmount,
        referenceModel: "Sale", referenceId: sale._id, performedBy: employee._id,
        note: `Vente ${sale.invoiceNumber} : ${items.map((i) => `${i.product.doc.name} x${i.quantity}`).join(", ")} — client : ${customerName || "comptoir"}`,
      }, date);
    }

    if (requiresDelivery) {
      const ageDays = (now - date) / 86400000;
      const status = ageDays > 4 ? (chance(0.92) ? "arrived" : "failed")
        : pick(ageDays > 2 ? ["on_route", "arrived"] : ["pending", "preparing", "on_route"]);
      const delivery = new Delivery({
        sale: sale._id,
        status,
        deliveryMan: seller()._id,
        deliveryAddress: {
          street: `${int(1, 200)} ${pick(["Rue", "Av.", "Bd"])} ${faker.person.lastName()}`,
          city: pick(CITIES),
          phone: customerPhone,
          notes: chance(0.3) ? pick(["Appeler avant de livrer", "2e étage, porte gauche", "Livrer après 18h", "Laisser chez le gardien"]) : "",
        },
        deliveryfees,
        estimatedArrival: addDays(date, int(1, 3)),
        actualArrival: status === "arrived"
          ? new Date(Math.min(now, addDays(date, faker.number.float({ min: 0.5, max: 3 }))))
          : undefined,
        createdAt: date,
        updatedAt: date,
      });
      sale.deliveryId = delivery._id;
      docs.deliveries.push(delivery);
    }
    docs.sales.push(sale);
  };

  // --- monthly running costs, recorded as manual "Dépense" transactions
  const expenses = (day) => {
    const d = day.getDate();
    const month = `${MONTH_NAMES[day.getMonth()]} ${day.getFullYear()}`;
    const spend = (amount, note) => addTransaction({
      type: "expense", direction: "out", amount, performedBy: seller()._id, note,
    }, atHour(day, 9, 17));
    if (d === 1) spend(6000, `Loyer du local — ${month}`);
    if (d === 3) spend(399, `Abonnement internet — ${month}`);
    if (d === 5) {
      spend(roundTo(int(700, 1400), 10), `Facture d'électricité — ${month}`);
      spend(roundTo(int(150, 350), 5), `Facture d'eau — ${month}`);
    }
    if (chance(0.08)) {
      spend(roundTo(int(100, 800), 10), pick([
        "Fournitures de bureau", "Produits d'entretien du magasin", "Transport de marchandises",
        "Réparation vitrine réfrigérée", "Sacs et emballages",
      ]));
    }
  };

  // --- payslips (skips employee/month pairs that already exist)
  const existingPayslips = new Set(
    (await FactureEmploi.find({}, "employee mois annee").lean())
      .map((p) => `${p.employee}-${p.mois}-${p.annee}`),
  );
  const payslipsFor = (year, monthIndex, isCurrentMonth) => {
    for (const employee of employees) {
      const salaire = Number(employee.salary) || 0;
      const mois = monthIndex + 1;
      if (!salaire || existingPayslips.has(`${employee._id}-${mois}-${year}`)) continue;

      let avance = 0;
      let TotalVerser = salaire;
      let date = new Date(year, monthIndex + 1, 0, 18, 0, 0); // last day of the month
      if (isCurrentMonth) {
        if (!chance(0.5)) continue; // no advance yet this month
        avance = roundTo(salaire * 0.3, 100);
        TotalVerser = avance;
        date = atHour(new Date(Math.min(now.getTime(), new Date(year, monthIndex, 15).getTime())), 10, 12);
        if (date > now) date = new Date(now.getTime() - 3600000);
      } else {
        const roll = faker.number.float({ min: 0, max: 1 });
        if (roll >= 0.6) avance = roundTo(salaire * 0.3, 100);
        if (roll >= 0.85) TotalVerser = Math.max(avance, salaire - roundTo(int(500, 1500), 100));
      }

      const payslip = new FactureEmploi({
        employee: employee._id, salaire, mois, annee: year, avance, TotalVerser,
        createdAt: date, updatedAt: date,
      });
      docs.payslips.push(payslip);
      addTransaction({
        type: "expense", direction: "out", amount: TotalVerser,
        referenceModel: "FactureEmploi", referenceId: payslip._id, performedBy: seller()._id,
        note: `Paie de ${employee.name} pour ${pad(mois)}/${year} (versé ${TotalVerser} DH sur ${salaire} DH)`,
      }, date);
    }
  };

  // --- day-by-day simulation
  for (let day = new Date(start); day <= now; day = addDays(day, 1)) {
    const dayIndex = Math.round((day - start) / 86400000);
    if (dayIndex % 3 === 0) restock(day);
    expenses(day);

    const weekday = day.getDay();
    const salesToday = int(3, 7) + (weekday === 5 || weekday === 6 ? 3 : 0);
    for (let i = 0; i < salesToday; i++) makeSale(day);

    // customer returns scheduled by earlier sales
    const dueReturns = pendingReturns.filter((r) => r.date < addDays(day, 1) && r.date <= now);
    dueReturns.forEach((r) => pendingReturns.splice(pendingReturns.indexOf(r), 1));
    for (const r of dueReturns) {
      addMovement(r.product, "return", 1, r.date, "manual", undefined, r.employee._id,
        `Retour client — facture ${r.sale.invoiceNumber}`);
      addTransaction({
        type: "return", direction: "out", amount: r.product.doc.sellingPrice,
        referenceModel: "return", performedBy: r.employee._id,
        note: `Remboursement retour client — ${r.product.doc.name} (facture ${r.sale.invoiceNumber})`,
      }, r.date);
    }

    // mid-month inventory: a little breakage / loss
    if (day.getDate() === 15) {
      pickProducts(products, int(1, 2)).filter((p) => p.doc.quantity > 3).forEach((p) => {
        addMovement(p, "adjustment", -int(1, 2), atHour(day, 19, 20), "manual", undefined, seller()._id,
          pick(["Casse constatée lors de l'inventaire", "Produit périmé retiré du rayon", "Écart d'inventaire"]));
      });
    }

    const tomorrow = addDays(day, 1);
    if (tomorrow.getMonth() !== day.getMonth()) payslipsFor(day.getFullYear(), day.getMonth(), false);
  }
  payslipsFor(now.getFullYear(), now.getMonth(), true);

  // --- customer requests: waiting list on low / out-of-stock products + some history
  const lowStock = products.filter((p) => p.doc.quantity <= p.doc.minStockAlert);
  for (const p of lowStock) {
    for (let i = 0; i < int(1, 2); i++) {
      const createdAt = atHour(addDays(now, -int(1, 10)), 9, 19);
      const notified = p.doc.quantity > 0 && chance(0.4);
      docs.requests.push(new CustomerRequest({
        customerName: faker.person.fullName(), customerPhone: phone(),
        product: p.doc._id, quantity: int(1, 3),
        status: notified ? "notified" : "pending",
        notifiedAt: notified
          ? new Date(Math.min(now, addDays(createdAt, faker.number.float({ min: 0.5, max: 2 }))))
          : undefined,
        notes: chance(0.3) ? "Client régulier, prévenir par téléphone" : undefined,
        createdAt, updatedAt: createdAt,
      }));
    }
  }
  for (let i = 0; i < 10; i++) {
    const createdAt = atHour(addDays(now, -int(15, 150)), 9, 19);
    const fulfilled = chance(0.7);
    docs.requests.push(new CustomerRequest({
      customerName: faker.person.fullName(), customerPhone: phone(),
      product: pick(products).doc._id, quantity: int(1, 3),
      status: fulfilled ? "fulfilled" : "cancelled",
      notifiedAt: fulfilled ? addDays(createdAt, int(2, 6)) : undefined,
      createdAt, updatedAt: createdAt,
    }));
  }

  // --- validate everything, then insert (keeps the simulated dates)
  const plan = [
    ["categories", Category], ["suppliers", Supplier], ["products", Product],
    ["purchases", Purchase], ["sales", Sale], ["deliveries", Delivery],
    ["movements", StockMovement], ["transactions", Transaction],
    ["payslips", FactureEmploi], ["requests", CustomerRequest],
  ];
  for (const [key] of plan) await Promise.all(docs[key].map((d) => d.validate()));
  for (const [key, Model] of plan) {
    if (docs[key].length) await Model.collection.insertMany(docs[key].map((d) => d.toObject()));
  }
  await Promise.all(plan.map(([, Model]) => Model.createIndexes()));

  console.log("\nDonnées ajoutées :");
  for (const [key, Model] of plan) console.log(`  ${Model.modelName.padEnd(16)} ${docs[key].length}`);
  console.log(`\nProduits en stock faible ou rupture : ${lowStock.length}`);
};

run()
  .catch((error) => {
    console.error("\nÉchec du seed :", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
