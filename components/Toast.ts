import Swal from 'sweetalert2';

// Define the types for the parameters
type ToastType = 'success' | 'error' | 'info' | 'warning';

export const toast = (message: string, type: ToastType): void => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon: type, // success, error, info, warning
    title: message,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
};
