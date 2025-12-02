# 💰 Expense Splitter — React + TypeScript (Production-Ready)

A clean, responsive, and fully functional group expense management application built using React + TypeScript, featuring shared state management, real-time balance calculations, debt simplification, toast notifications, and a production-quality UI/UX.

This application helps groups (friends, roommates, travel groups, teams) record expenses and instantly see who owes whom.


### Live : https://expense-splitter-challenge.vercel.app/


### ✨ Features
### 👥 People Management

- **Add people to the group**

- **Remove people with data-integrity checks**

- **Toast notifications for feedback**

- **Validations to prevent accidental actions**

### 💸 Expense Management

### Add expenses with:

- **Description**

- **Amount**

- **Date**

- **Paid by**

- **Split between**

- **Equal or custom splits**

- **Delete expenses**

- **Real-time UI updates after every mutation**

- **Production-style toast messages using react-hot-toast**

### 📊 Live Balance Calculation

### Total group spending

### Per-person:

- **Total paid**

- **Total owed**

- **Net balance**

‘- **Owes’ vs ‘Is owed’ UI states**

- **Zero balance detection (Settled Up)**

### 🔄 Debt Simplification

- **Minimizes number of transactions**

- **Shows suggested settlements (who pays whom)**

- **Integer-based calculations to avoid floating-point errors**

### 🎨 Modern UI & UX

- **Fully responsive**

- **Modern card-based layout**

- **Smooth hover / elevation states**

- **Clean forms with validations**

- **Expandable expense items**

- **Subtle micro-interactions**

### 💾 Centralized State Management

- **Custom reducer + context API**

- **Predictable, testable state updates**

- **Actions, selectors & utilities for clean architecture**

### 🧪 Unit Tests

- **Vitest test environment**

- **Component-level and function-level tests**

- **Utility logic thoroughly validated**

### 🛠️ Tech Stack

### Frontend

- **React**

- **TypeScript**

- **Vite**

- **CSS + Tailwind-like utility classes**

- **State Management**

- **Custom reducer + React Context**

- **Clean action definitions & selectors**

- **Utilities**

- **Custom calculation engine:**

- **calculateTotals.ts**

- **simplifyDebts.ts**

- **format.ts**

- **Notifications**

- **react-hot-toast — production-grade toast notifications**

- **Testing**

- **Vitest**

- **React Testing Library**

### 📁 Project Structure

src/
├── components/
│   ├── PeopleManager.tsx
│   ├── ExpenseForm.tsx
│   ├── ExpenseList.tsx
│   └── BalanceView.tsx
│
├── state/
│   ├── actions.ts
│   ├── reducer.ts
│   ├── selectors.ts
│   └── index.tsx
│
├── utils/
│   ├── calcBalances.ts
│   ├── simplifyDebts.ts
│   └── format.ts
│
├── App.tsx
├── main.tsx
└── initialData.ts




### 🚀 Getting Started
- **1️⃣ Install dependencies**
- **npm install**

### 2️⃣ Start development server
- **npm run dev**

### 3️⃣ Run unit tests
- **npm test**

### 🧩 Core Logic Overview
- **✔ calculateTotals.ts**

- **Uses integer-based cents to avoid floating-point issues**

### Handles:

- **Equal split**

- **Custom split**

- **Missing or partial custom amounts**

- **Remaining differences assigned deterministically**

### Produces:

- **Per-person paid, owed, net**

- **Group totals**

- **✔ simplifyDebts.ts**

- **Converts net balances into minimal transactions**

- **Greedy algorithm matching debtors → creditors**

- **Ensures no unmatched amounts remain**

### 🛡️ Data Integrity Rules

- **People cannot be removed if referenced in an expense**

- **Expenses require at least one participant**

- **Custom split amounts must match total (or require confirmation)**

- **Every action validated with toast messages**



### 📦 Production Build
- **npm run build**

