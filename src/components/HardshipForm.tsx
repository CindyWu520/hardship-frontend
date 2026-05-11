import { useState, useMemo } from "react";

const initialInput = {
  fullName: "",
  dateOfBirth: "", // convert to local Date automatically "YYYY-MM-DD"
  annualIncome: "", // float will lose precision on number
  annualExpenses: "",
  hardshipReason: "",
};

export const HardshipForm = () => {
  const [input, setInput] = useState(initialInput);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // calculate netIncome and expense ratio
  const { netIncome, expenseRatio } = useMemo(() => {
    const income = parseFloat(input.annualIncome);
    const expenses = parseFloat(input.annualExpenses);

    if (income > 0 && expenses > 0) {
      return {
        netIncome: income - expenses,
        expenseRatio: ((expenses / income) * 100).toFixed(1),
      };
    }
    return { netIncome: null, expenseRatio: null };
  }, [input.annualIncome, input.annualExpenses]);

  // clear all the input
  const clearInput = () => {
    setInput(initialInput);
  };

  const handleSubmit = async () => {
    try {
      const income = parseFloat(input.annualIncome);
      const expenses = parseFloat(input.annualExpenses);

      // validation
      if (!input.fullName || !input.dateOfBirth || !income || !expenses) {
        throw new Error("Please fill in all required fileds");
      }

      setError(null);
      //   console.log(API);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/hardship`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: input.fullName,
            dateOfBirth: input.dateOfBirth,
            income: parseFloat(income.toFixed(2)),
            expenses: parseFloat(expenses.toFixed(2)),
            reason: input.hardshipReason.trim() || null,
          }),
        },
      );
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "😢Failed to submit application due to unexpected error");
        return;
      }
      clearInput();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000); // hide after 5 seconds
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Page Header*/}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
          Submit Hardship Application
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Complete all required fields. Applications are reviewed within 5–7
          business days.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 mb-6 text-sm text-gray-600 dark:text-gray-300">
        <span className="mt-0.5">ℹ️</span>
        <span>
          All fields marked with <span className="text-red-500">*</span> are
          required. Income and expenses should reflect your current annual
          figures.
        </span>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-700">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Personal Information card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
          <span className="text-teal-600">👤</span>Personal Information
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={input.fullName}
              onChange={handleInput}
              placeholder="John Doe"
              className="h-9 border border-gray-200 dark:border-gray-600 rounded-lg px-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Date of birth<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={input.dateOfBirth}
              onChange={handleInput}
              className="h-9 border border-gray-200 dark:border-gray-600 rounded-lg px-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            ></input>
          </div>
        </div>
      </div>

      {/* Financial Detailed Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
          <span>💵</span>Financial details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Annual income */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Annual income <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                $
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                name="annualIncome"
                value={input.annualIncome}
                onChange={handleInput}
                placeholder="0.00"
                className="h-9 w-full border border-gray-200 dark:border-gray-600 rounded-lg pl-6 pr-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* annual expense */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Annual expenses <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                $
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                name="annualExpenses"
                value={input.annualExpenses}
                onChange={handleInput}
                placeholder="0.00"
                className="h-9 w-full border border-gray-200 dark:border-gray-600 rounded-lg pl-6 pr-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Net income summary */}
        {netIncome !== null && (
          <div className="flex items-center gap-6 mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {/* allign vertical */}
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Net income</p>
              <p className="text-base font-semibold text-teal-600">
                ${netIncome}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-0.5">Expense ratio</p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                ${expenseRatio}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reason pannel*/}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
          <span>💬</span>Reason for application
        </h2>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Hardship reason
          </label>
          <textarea
            name="hardshipReason"
            value={input.hardshipReason}
            onChange={handleInput}
            rows={3}
            placeholder="Describe your hardship situation..."
            className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">
            Provide as much detail as possible to help us review your
            application accurately.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={clearInput}
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Clear form
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span>✈️</span>Submit application
        </button>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mb-6 text-sm text-teal-700">
          <span>"😊Application submitted successfully"</span>
        </div>
      )}
    </div>
  );
};
