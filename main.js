//Project HTML Elements
const createBtn = document.getElementById("create");
const productForm = document.getElementById("add-product");
const finalPrice = document.getElementById("final-price");
const price = document.getElementById("price");
const taxes = document.getElementById("taxes");
const discount = document.getElementById("discount");
const tableBody = document.getElementById("tbody");
const deleteAllDiv = document.getElementById("deleteAll");
const formSubmitBtn = document.getElementById("submit");
const searchData = document.getElementById("search");
const resetSearchBtn = document.getElementById("reset-search");

//Project Global Variables
let newProducts, mode, productIndex, searchResults;

//Check if Products exists inLocal Storage
if (localStorage.products) {
  newProducts = JSON.parse(localStorage.products);
} else {
  newProducts = [];
}

// Display and hide create product form
createBtn.onclick = () => {
  createBtn.style.display = "none";
  formSubmitBtn.innerHTML = `Create Product`;
  productForm.style.display = "block";
  mode = "create";
};

//Calculate total Price
function calcFinalPrice() {
  if (price.value) {
    const result = +price.value + +taxes.value - +discount.value;
    finalPrice.value = result;
    finalPrice.style.backgroundColor = "green";
  } else {
    finalPrice.value = null;
    finalPrice.style.backgroundColor = "red";
  }
}

// Create New Product & Save it to Local Storage
productForm.onsubmit = (eve) => {
  eve.preventDefault();
  const formData = new FormData(eve.target);
  let newProduct = Object.fromEntries(formData);
  const lastId =
    newProducts.length > 0 ? newProducts[newProducts.length - 1].id : 0;
  if (mode === "create") {
    newProducts.push({ ...newProduct, id: lastId + 1 });
  }
  if (mode === "update") {
    newProducts[productIndex] = newProduct;
  }
  localStorage.setItem("products", JSON.stringify(newProducts));
  resetFormSubmit();
  displayProducts(newProducts);
};

//display products
function displayProducts(products = []) {
  let tbodyContent = ``;
  products.forEach((product, index) => {
    tbodyContent += `
    <tr>
      <td class="id">${index + 1}</td>
      <td>${product.title}</td>
      <td>${product.totalPrice}</td>
      <td>${product.count}</td>
      <td>${product.category}</td>
      <td><button class="edit" onclick="editProduct(${
        product.id
      })">Edit</button></td>
      <td><button onclick="deleteProduct(${
        product.id
      })" class="delete">Delete</button></td>
      <td><button class="details">Details</button></td>
    </tr>
    <tr class="small-screen">
      <td colspan="5">
        <button class="edit" onclick="editProduct(${product.id})">Edit</button>
        <button onclick="deleteProduct(${
          product.id
        })" class="delete">Delete</button>
        <button class="details">Details</button>
      </td>
    </tr>
    `;
  });
  tableBody.innerHTML = tbodyContent;

  //display delete all button
  if (products.length > 0) {
    deleteAllDiv.innerHTML = `
    <button onclick="deleteAll()" class="deleteAll">Delete All (${products.length})</button>
    `;
  } else {
    deleteAllDiv.innerHTML = "";
  }
}

//delete single product
function deleteProduct(id) {
  newProducts = newProducts.filter((product) => {
    return product.id !== id;
  });
  localStorage.products = JSON.stringify(newProducts);
  displayProducts(newProducts);
}

//delete all function
function deleteAll() {
  localStorage.clear();
  newProducts = [];
  displayProducts(newProducts);
}

//edit product logic
function editProduct(id) {
  mode = "update";
  const productData = newProducts.find((product) => {
    return product.id === id;
  });
  const formData = new FormData(productForm);
  for (const key of formData.keys()) {
    productForm.elements[key].value = productData[key];
  }
  calcFinalPrice();
  formSubmitBtn.innerHTML = `Update Product`;
  createBtn.style.display = "none";
  productForm.style.display = "block";
  scroll({ top: 0, behavior: "smooth" });
}

// reset form data & close product form & cancel form submit
function resetFormSubmit() {
  productForm.reset();
  finalPrice.style.backgroundColor = "#111";
  productForm.style.display = "none";
  createBtn.style.display = "block";
}

//search function
function searchProducts(by) {
  // searchResults = [];
  if (searchData.value) {
    searchResults = newProducts.filter((product) => {
      return product[by].toLowerCase().includes(searchData.value.toLowerCase());
    });
    resetSearchBtn.style.display = "block";
    displayProducts(searchResults);
  }
}

//Reset Search Results
function resetSearchResults() {
  searchResults = [];
  resetSearchBtn.style.display = "none";
  searchData.value = "";
  displayProducts(newProducts);
}

displayProducts(newProducts);
