import React from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import BudgetCharts from "./BudgetCharts";

const BudgetDashboard = () => {
  return (
    <div className="bg-base-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Budget Tracker
        </h1>

        {/* Transaction Form */}
        <section>
          <TransactionForm />
        </section>

        {/* Charts */}
        <section>
          <BudgetCharts />
        </section>

        {/* Transaction List */}
        <section>
          <TransactionList />
        </section>
      </div>
    </div>
  );
};

export default BudgetDashboard;
