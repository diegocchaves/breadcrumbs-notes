"use client";
import {
  IoIosCloseCircleOutline,
  IoIosCheckmarkCircleOutline,
} from "react-icons/io";

import { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-md px-4 py-2 text-sm shadow-md transition
              ${
                toast.type === "success"
                  ? "bg-green-200 text-green-700 border border-green-700 flex items-center gap-2"
                  : toast.type === "error"
                    ? "bg-red-200 text-red-700 border border-red-700 flex items-center gap-2"
                    : "bg-gray-200 text-gray-800 border border-gray-800 flex items-center gap-2"
              }`}
          >
            {toast.type === "success" && (
              <IoIosCheckmarkCircleOutline
                size={20}
                className="text-green-700"
              />
            )}
            {toast.type === "error" && (
              <IoIosCloseCircleOutline size={20} className="text-red-700 " />
            )}
            <span> {toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
