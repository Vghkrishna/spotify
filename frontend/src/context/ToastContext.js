import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
    duration: 3000,
  });

  const showToast = useCallback(
    (message, type = "success", duration = 3000) => {
      setToast({
        isVisible: true,
        message,
        type,
        duration,
      });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const showSuccessToast = useCallback(
    (message, duration = 3000) => {
      showToast(message, "success", duration);
    },
    [showToast]
  );

  const showErrorToast = useCallback(
    (message, duration = 3000) => {
      showToast(message, "error", duration);
    },
    [showToast]
  );

  const showWarningToast = useCallback(
    (message, duration = 3000) => {
      showToast(message, "warning", duration);
    },
    [showToast]
  );

  const showInfoToast = useCallback(
    (message, duration = 3000) => {
      showToast(message, "info", duration);
    },
    [showToast]
  );

  const value = {
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
};
