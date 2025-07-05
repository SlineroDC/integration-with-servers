// Import SweetAlert2 for interactive alerts
import Swal from "sweetalert2";

// Toast configuration (not used in current alerts, but ready for future use)
const toast = Swal.mixin({
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

// Show success alert when a product is registered
export function alertProductRegistered(message){
    Swal.fire({
      title: "Your product was successfully registered",
      icon: "success",
      draggable: true
      });
  }
  
// Show error alert when fields are incomplete
export function alertFieldsRequired(message){
    Swal.fire({
      title: "Please complete all fields",
      icon: "error",
      draggable: true
      });
  }

// Show error alert when product name is duplicated
export function alertDuplicateName(message){
    Swal.fire({
      title: "The product name is already registered",
      icon: "error",
      draggable: true
      });
  }

// Show success alert when a product is deleted
export function alertProductDeleted(message){
    Swal.fire({
      title: "Your product was successfully deleted",
      icon: "success",
      draggable: true
      });
  }

// Show error alert when price is not greater than zero
export function alertPriceGreaterThanZero(message){
    Swal.fire({
      title: "The product price must be greater than zero",
      icon: "error",
      draggable: true
      });
  }

// Clear product form fields
export function clearProductFields() {
    // These variables must be defined in the importing file
    $productName.value = "";
    $productPrice.value = "";
    $productCategory.value = "";
  }

