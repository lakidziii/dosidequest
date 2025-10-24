import { useState } from 'react';
import { AlertButton, AlertType } from '../components/CustomAlert';

interface AlertConfig {
  title: string;
  message: string;
  type: AlertType;
  buttons: AlertButton[];
}

export function useCustomAlert() {
  const [visible, setVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    title: '',
    message: '',
    type: 'info',
    buttons: [],
  });

  const showAlert = (
    title: string,
    message: string,
    type: AlertType,
    buttons: AlertButton[] = [{ text: 'OK' }]
  ) => {
    setAlertConfig({ title, message, type, buttons });
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
  };

  const showSuccess = (
    title: string,
    message: string,
    buttons?: AlertButton[]
  ) => {
    showAlert(title, message, 'success', buttons);
  };

  const showError = (
    title: string,
    message: string,
    buttons?: AlertButton[]
  ) => {
    showAlert(title, message, 'error', buttons);
  };

  const showWarning = (
    title: string,
    message: string,
    buttons?: AlertButton[]
  ) => {
    showAlert(title, message, 'warning', buttons);
  };

  const showInfo = (
    title: string,
    message: string,
    buttons?: AlertButton[]
  ) => {
    showAlert(title, message, 'info', buttons);
  };

  return {
    visible,
    alertConfig,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}