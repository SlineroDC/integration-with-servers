// Import axios for HTTP requests
import axios from "axios";

// Import alert functions (renamed to English)
import {
  alertProductDeleted,
  alertFieldsRequired,
  alertDuplicateName,
  alertProductRegistered,
  alertPriceGreaterThanZero,
} from './alert'

let products = [];
let editingProductId = null;
// Get elements from index.html
let $productName = document.getElementById("productName");
let $productPrice = document.getElementById("productPrice");
let $productCategory = document.getElementById("productCategory");
let $addProductButton = document.getElementById("addProductButton");
let $productList = document.getElementById("productList");

function fetchProducts(callback) {
  axios.get("http://localhost:3000/products")
    .then(res => {
      products = res.data;
      showProducts();
      if (callback) callback();
    })
    .catch(err => {
      console.error("Error fetching products", err);
    });
}

// Validate positive price and prevent duplicate names on add/edit
$addProductButton.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission and page reload

  let name = $productName.value.trim();
  let price = parseFloat($productPrice.value);
  let category = $productCategory.value.trim();

  // Improved validation for empty fields
  if (!name || isNaN(price) || !category) {
    alertFieldsRequired();
    return;
  }

  if (price <= 0) {
    alertPriceGreaterThanZero();
    return;
  }

  const duplicateName = products.some((e) => e.nombre === name && e.id !== editingProductId);
  if (duplicateName) {
    alertDuplicateName();
    return;
  }

  const newProduct = {
    nombre: name,
    precio: price,
    categoria: category
  };
  // Edit product if editing, otherwise create new
  if (editingProductId) {
    axios.put(`http://localhost:3000/products/${editingProductId}`, newProduct)
      .then(res => {
        const index = products.findIndex(p => p.id === editingProductId);
        products[index] = res.data;
        alertProductRegistered();
        showProducts();
        clearProductFields();
        editingProductId = null;
      })
      .catch(() => {
        console.error("Error editing the product");
      });
  } else {
    axios.post("http://localhost:3000/products", newProduct)
      .then(res => {
        products.push(res.data);
        alertProductRegistered();
        showProducts();
        clearProductFields();
      })
      .catch(() => {
        console.error("Error adding the product");
      });
  }
});

// Function to display delete and edit buttons for products
function showProducts() {
  $productList.innerHTML = "";
  products.forEach((prod) => {
    $productList.innerHTML += `<li>
      name ${prod.nombre} - $${prod.precio} (${prod.categoria})
      <button class="deleteProduct" data-id="${prod.id}">Delete</button>
      <button class="editProduct" data-id="${prod.id}">Edit</button>
    </li>`;
  });
  // If the user clicks delete, this function will be executed
  document.querySelectorAll(".deleteProduct").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      deleteProduct(id);
    });
  });
  // If the user clicks edit, this function will be executed
  document.querySelectorAll(".editProduct").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      editProduct(id);
    });
  });
}

// Delete product and show alert
function deleteProduct(id) {
  axios.delete(`http://localhost:3000/products/${id}`)
    .then(() => {
      products = products.filter(p => p.id != id);
      alertProductDeleted();
      showProducts();
    })
    .catch(() => {
      console.error("Error deleting the product");
    });
}

// This function allows editing name, price, and category
function editProduct(id) {
  const product = products.find(p => p.id == id);
  if (!product) return;

  $productName.value = product.nombre;
  $productPrice.value = product.precio;
  $productCategory.value = product.categoria;
  editingProductId = id;
}

// Clear product fields
function clearProductFields() {
  $productName.value = "";
  $productPrice.value = "";
  $productCategory.value = "";
}

window.addEventListener("DOMContentLoaded", () => fetchProducts());
