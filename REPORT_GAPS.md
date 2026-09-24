# BESTMARK report vs. StorePilot code: gaps to close

Things `BESTMARK_Rapport_Mission_Professionnelle.pdf` describes that the code doesn't do (yet). Items the report itself calls "future work" (multi-store, mobile app, online storefront, notifications) are left out.

Status: ✅ done · ⬜ to do

---

## 0. Corrections to make in the report (not the code)

- ✅ Access control is already implemented, through `PermissionModels` + `Back-end/Midelwars/RequirePermission.js` and the front-end `RequirePermission`, not the `role` enum. Rewrite ch. II.6, VII.4, XII and XV.2, which still say it is "à venir".
- ✅ `.env.example` already exists in `Back-end/` and `Front-end/`. Remove the "absent" remarks (VII.6, XI.1, XII, XV.2).
- ⬜ Routes the report doesn't list: `/dashboard`, `/finance-report`, `/products/:id`, `/profile`, `/api/permission-models`, `/api/products/low-stock`.
-✅ Wrong text copied from another project:
  - III.1: `Filter.jsx` → `ProductFilters.jsx` (plus `ProductsStatic.jsx` for the stock-status cards).
  - III.1: `AddMemberModal-like` → `Products/Actions/Add.jsx`.
  - III.5: `Sur CheckinPage/SalesPage` → `Sur SalesPage, … (AddSlle.jsx)`.
  - VIII.4 table: `Filter.jsx` → `ProductFilters.jsx`.
  - XV.2: `{ MemberId: 1, CheckIn: -1 }` → `{ product: 1, createdAt: -1 }` on StockMovement and `{ saleDate: -1 }` on Sale.
- ✅ Once sections 1 and 2 are done, update the coverage table in ch. XII (rate limiting now active, CORS in env).

## 1. Security and config (report XV.2, "Haute" priority)

- ✅ **a. Rate limiting.** In `Back-end/Index.js`: 1000 req / 15 min on `/api`, and 10 failed attempts / 15 min on `POST /api/auth/login`.
- ✅ **b. CORS origin from env.** `origin: process.env.CLIENT_URL || "http://localhost:5173"`, and `CLIENT_URL=` added to `Back-end/.env.example`.
- ✅ **c. Global error handler** (`Back-end/Midelwars/ErrorHandlers.js`):
  - one response per error (the "headers already sent" bug is fixed);
  - `envirement=development` spelling fixed in the code, `.env` and `.env.example`;
  - `CastError` and duplicate key (11000) → 400;
  - known errors get the right code in dev mode too;
  - all responses are `{ status, message }`.

## 2. Business rules the report says are automatic

- ✅ **a. `Number_of_sales` incremented** in `CreateSale` (`Back-end/sales/Controller.js`).
- ✅ **b. Deleting a sale restores stock** and decrements `Number_of_sales` (`DeleteSale`, all in one transaction). `SalesPage.jsx` refreshes products, stock, transactions and deliveries after the delete.
- ⬜ **b2. (optional) Recount script for `Number_of_sales`.** A one-time script that recomputes the counter from existing sales, because sales made before 2a were never counted.
- ✅ **c. Block selling more than the stock.** `CreateSale` returns 400 "Stock insuffisant pour …" and the whole sale is rolled back. In the sale form, out-of-stock products are disabled in the search, the available stock is shown, and the quantity field is capped at it.
- ⬜ **d. Compute totals on the server** (report IX.2). Today only the front end computes them. Add `pre("validate")` hooks:
  - `sales/sales.js`:
    - `itemTotal = quantity * sellingPrice`
    - `subtotal`
    - `totalAmount = subtotal - discount + (deliveryfees || 0)`
    - `remainAmount = max(0, total - paid)`
    - `paymentStatus`: paid / partial / unpaid (leave `refunded` alone)
  - `Purchases/Purchases.js`: `itemTotal`, `debts = max(0, total - paid)`, `paymentStatus`.
  - ✅ Fixed the `itemTotal` comments: Sale now says sellingPrice, and both drop the false "calculated on save". Remove "(not computed yet …)" once the hooks exist.
- ✅ **e. `CustomerRequest.notifiedAt` set by the server.** Set on the first switch to "notified", cleared when the request goes back to "pending", and ignored if sent by the client. Shown in a "Date de notification" column in `CustomersTable.jsx`.
- ✅ **f. Wrong refs.** `Transaction.performedBy` now uses `ref: "Employee"`. The transaction endpoints populate the name, manual transactions record the logged-in employee, and the transactions table has an "Effectué par" column.

## 3. Expenses module: removed ✅

The `Expense` / `ExpenseType` module was backend-only and never used, so it was removed:
- deleted `Back-end/expenses/`, `Front-end/src/Servises/Expenses.js` and `ExpenseTypes.js`;
- removed the `/api/expenses` and `/api/expense-types` routes from `Index.js`.

Expenses are recorded as manual transactions (type "Dépense") on `/finance`.

- ✅ **Report still to update later:** III.9 (Expense/ExpenseType paragraph), VI (`expenses/` folder), VII.2 (the two endpoints), VII.3.4 (Expense / ExpenseType models), X.1 (ExpenseType → Expense relation), XII ("Dépenses et types de dépense: Implémenté"). The report also says "seize collections"; it is now 14.

## 4. Payroll (FactureEmploi): done ✅

Meaning of the fields: `avance` = advance paid during the month, `TotalVerser` = total paid for the month (advance included), `reste = salaire - TotalVerser`.

- ✅ **Model** `Employes/FactureEmployer/FactureEmplois.js`:
  - timestamps and a unique index `{ employee, mois, annee }`;
  - `reste` computed on validate;
  - rejects `TotalVerser < avance` and `TotalVerser > salaire`;
  - month limited to 1–12.
- ✅ **API** `/api/payslips` (permission "Employés"):
  - CRUD plus `GET /employee/:id`;
  - one payslip per employee per month (400 otherwise);
  - create/update keeps an `expense / out` Transaction (`referenceModel: "FactureEmploi"`, amount = `TotalVerser`) in sync, and delete removes it;
  - a payslip's transaction can't be deleted from `/finance` while the payslip exists.
- ✅ **Frontend:** "Bulletins de paie" button (receipt icon) on each employee row, shown to users with "Ajouter" on Employés. It opens a dialog with:
  - an add form (month, year, salary pre-filled, advance, total paid, remaining calculated live);
  - the employee's history, with "Solder" (pays the rest) and delete.

## 5. MongoDB indexes (report X.2, XV.2): done ✅

- ✅ `stockMovements/StockMovement.js`: `index({ product: 1, createdAt: -1 })`
- ✅ `sales/sales.js`: `index({ saleDate: -1 })` and `index({ createdAt: -1 })`. The second is used by the daily invoice counter.
- ✅ `Transactions/Transaction.js`: `index({ date: -1 })` and `index({ referenceId: 1 })`.
- ✅ `Employes/FactureEmployer/FactureEmplois.js`: unique `index({ employee: 1, mois: 1, annee: 1 })` (added with section 4).

Mongoose creates them automatically when the server starts (`autoIndex`, on by default).

## 6. Automated tests (report V.4, XV.2: Jest + Vitest)

- ⬜ **Backend setup:**
  - Dev deps: `jest`, `supertest`, `mongodb-memory-server`. Use `MongoMemoryReplSet`, because `transactional()` needs a replica set.
  - Split `Index.js` into `app.js` (exports `app`) and `Index.js` (connects to the database and listens).
  - Script: `"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"`.
- ⬜ **Backend tests:**
  - Login: success, wrong password, inactive account.
  - Protect: no token or an invalid token → 401.
  - Sale with partial payment: checks `remainAmount`/`paymentStatus`, the stock decrease, the StockMovement and the `in` Transaction.
  - Delete a sale → the stock is restored.
  - Purchase: stock increase, StockMovement and the `out` Transaction.
- ⬜ **Frontend:**
  - Dev deps: `vitest`, `@testing-library/react`, `jsdom`; script `"test": "vitest"`.
  - Move the remain/status calculation from `Sales/Actions/AddSlle.jsx` / `PaymentPart.jsx` into a pure function in `src/lib/` and test it.

---

## How to verify
1. `cd Back-end && npm test` and `cd Front-end && npx vitest run` pass.
2. Sale with partial payment → `Number_of_sales` goes up, stock goes down, and a StockMovement and a Transaction are created. Delete it → stock is restored.
3. Sell more than the stock → 400.
4. Add a "Dépense" transaction in `/finance` → it appears in the finance report.
5. Add a payslip → it appears in the history and as an `out` transaction.
6. Set a customer request to "notified" → `notifiedAt` is shown.
7. 11 bad logins → 429.
8. POST a sale with a missing field → one 400 response, no crash in the server log.
9. `db.stockmovements.getIndexes()` shows the compound index.
