import { useState } from "react";
import {
  hardshipApi,
  type UpdateHardshipRequest,
  type UpdateItem,
} from "../api/apiClient";
import { getUiError, type UiError } from "../util/getUiError";

type editModalProps = {
  item: UpdateItem;
  onClose: () => void;
  onSuccess: () => void;
};

export const EditModal = ({ item, onClose, onSuccess }: editModalProps) => {
  const [input, setInput] = useState({
    hardshipId: item.hardshipId,
    name: item.name,
    dateOfBirth: item.dateOfBirth,
    income: item.income,
    expenses: item.expenses,
    reason: item.reason ?? "",
    status: item.status,
  });
  const [error, setError] = useState<UiError | null>(null);

  const nameChanged = item.name !== input.name;
  const dateOfBirthChanged = item.dateOfBirth !== input.dateOfBirth;
  const incomeChanged = item.income.toString() !== input.income.toString();
  const expensesChanged =
    item.expenses.toString() !== input.expenses.toString();
  const reasonChanged = (item.reason ?? null) !== input.reason;

  // ------------------handleInput-----------------------
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------update hardship-----------------------
  const handleSubmit = async () => {
    try {
      setError(null);
      const body: UpdateHardshipRequest = {
        name: input.name,
        dateOfBirth: input.dateOfBirth,
        income: parseFloat(input.income.toFixed(2)),
        expenses: parseFloat(input.expenses.toFixed(2)),
        reason: input.reason.trim() || null,
        status: input.status,
      };
      await hardshipApi.update(input.hardshipId, body);
      // refetch the list
      onSuccess();
      // close the modal
      onClose();
    } catch (e) {
      setError(getUiError(e));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose} // click outside to close
    >
      {/* modal card — stop click propagating to backdrop */}
      <div
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-8">
          {/* page header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl text-gray-900 dark:text-white font-semibold mb-1">
                Update application
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                ID #{item.hardshipId} · {item.name}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg"
            >
              ✕
            </button>
          </div>

          {/* info pannel */}
          {(nameChanged ||
            dateOfBirthChanged ||
            incomeChanged ||
            expensesChanged ||
            reasonChanged) && (
            <div className="flex items-center gap-2 text-xs font-semibold bg-gray-50 dark:bg-gray-700 border border-gray-200 rounded-lg px-2 py-1 mb-6 text-gray-600 dark:text-gray-300">
              <span className="mt-0.5">✏️</span>
              <span>Fields highlighted in blue have unsaved changes.</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 text-xs text-red-700">
              <span>⚠️</span>
              <span>{error.message}</span>
            </div>
          )}

          {/* input form */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {/* full name */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                  Full name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={handleInput}
                  className={`h-9 border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500
          ${
            nameChanged
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white"
              : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          }`}
                  placeholder={input.name}
                ></input>
              </div>

              {/* date of birth */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                  Date of birth <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={input.dateOfBirth}
                  onChange={handleInput}
                  className={`h-9 border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500
          ${
            dateOfBirthChanged
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white"
              : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          }`}
                  placeholder={input.dateOfBirth}
                ></input>
              </div>
            </div>

            {/* input form */}
            <div className="grid grid-cols-2 gap-4">
              {/* Income */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                  Income <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="income"
                  value={input.income}
                  onChange={handleInput}
                  className={`h-9 border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500
          ${
            incomeChanged
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white"
              : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          }`}
                  placeholder={input.income.toString()}
                ></input>
              </div>

              {/* expenses */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                  Expenses<span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="expenses"
                  value={input.expenses}
                  onChange={handleInput}
                  className={`h-9 border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500
          ${
            expensesChanged
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white"
              : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          }`}
                  placeholder={input.expenses.toString()}
                />
              </div>
            </div>

            {/* hardship reason */}
            <div className="flex flex-col gap-1">
              <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                Hardship reason
              </span>
              <textarea
                name="reason"
                rows={3}
                value={input.reason}
                placeholder={input.reason}
                onChange={handleInput}
                className={`border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500
          ${
            reasonChanged
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white"
              : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          }`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-white bg-teal-600 border-gray-200 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
