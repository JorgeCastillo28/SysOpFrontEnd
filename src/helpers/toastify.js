// CONFIGURACIÓN PARA MOSTRAR ALERTS CON MENSAJES
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const options = {
  "theme": "dark",
  "position": toast.POSITION.TOP_CENTER,
  "autoClose": 3000,
  "closeOnClick": true,
  "type": "default",
  "dangerouslyHTMLString": true
};

const toastify = {
  success: (message) => {
    options["type"] = "success";
    toast(message, options);
  },

  error: (message) => {
    options["type"] = "error";
    toast(message, options);
  },

  info: (message) => {
    options["type"] = "info";
    toast(message, options);
  },

  warning: (message) => {
    options["type"] = "warning";
    toast(message, options);
  }
};

export default toastify;