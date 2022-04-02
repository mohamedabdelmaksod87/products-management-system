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

//Project Global Variables
let newProducts, mode, productIndex;

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
  console.log(mode);
  const formData = new FormData(eve.target);
  let newProduct = Object.fromEntries(formData);
  if (mode === "create") {
    newProducts.push(newProduct);
  }
  if (mode === "update") {
    newProducts[productIndex] = newProduct;
  }
  localStorage.setItem("products", JSON.stringify(newProducts));
  resetFormSubmit();
  displayProducts();
};

//display products
function displayProducts() {
  let tbodyContent = ``;
  newProducts.forEach((product, index) => {
    tbodyContent += `
    <tr>
      <td class="id">${index + 1}</td>
      <td>${product.title}</td>
      <td>${product.totalPrice}</td>
      <td>${product.count}</td>
      <td>${product.category}</td>
      <td><button class="edit" onclick="editProduct(${index})">Edit</button></td>
      <td><button onclick="deleteProduct(${index})" class="delete">Delete</button></td>
      <td><button class="details">Details</button></td>
    </tr>
    <tr class="small-screen">
      <td colspan="5">
        <button class="edit">Edit</button>
        <button onclick="deleteProduct(${index})" class="delete">Delete</button>
        <button class="details">Details</button>
      </td>
    </tr>
    `;
  });
  tableBody.innerHTML = tbodyContent;

  //display delete all button
  if (newProducts.length > 0) {
    deleteAllDiv.innerHTML = `
    <button onclick="deleteAll()" class="deleteAll">Delete All (${newProducts.length})</button>
    `;
  } else {
    deleteAllDiv.innerHTML = "";
  }
}

//delete single product
function deleteProduct(index) {
  newProducts.splice(index, 1);
  localStorage.products = JSON.stringify(newProducts);
  displayProducts();
}

//delete all function
function deleteAll() {
  localStorage.clear();
  newProducts = [];
  displayProducts();
}

//edit product logic
function editProduct(index) {
  mode = "update";
  productIndex = index;
  let productData = newProducts[index];
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

displayProducts();
