//Project Html elements
const createBtn = document.getElementById("create");
const createForm = document.getElementById("add-product");
const finalPrice = document.getElementById("final-price");
const price = document.getElementById("price");
const taxes = document.getElementById("taxes");
const discount = document.getElementById("discount");
const tableBody = document.getElementById("tbody");
const deleteAllDiv = document.getElementById("deleteAll");

// Display and hide create product form
createBtn.onclick = () => {
  createBtn.style.display = "none";
  createForm.style.display = "block";
};

//Check if Products exists inLocal Storage
let newProducts;
if (localStorage.products) {
  newProducts = JSON.parse(localStorage.products);
} else {
  newProducts = [];
}

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
createForm.onsubmit = (eve) => {
  eve.preventDefault();
  const formData = new FormData(eve.target);
  let newProduct = Object.fromEntries(formData);
  newProducts.push(newProduct);
  localStorage.setItem("products", JSON.stringify(newProducts));
  // reset form data & close new product form
  createForm.reset();
  finalPrice.style.backgroundColor = "#111";
  createForm.style.display = "none";
  createBtn.style.display = "block";
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
      <td><button class="edit">Edit</button></td>
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

displayProducts();
