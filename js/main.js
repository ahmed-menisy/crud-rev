// ------------- Start Global -------------
var btnAdd = document.getElementById("addProduct");
var btnUpdate = document.getElementById("updateProduct");
var inputs = document.querySelectorAll(".form-control:not(input[type=search])");
var searchInput = document.getElementById("search");
var products = [];
var curentIndexUpdate;
// ------------- End Global -------------
// ------------- Start When Start -------------
(function () {
   if (getLocal() != null) {
      products = getLocal();
      displayData();
   }
})();
// ------------- End When Start -------------
// ------------- Start Events -------------
// Add Product
btnAdd.addEventListener("click", function () {
   addProduct(); // to add product
   displayData(); // to dislay procut after add
   reset(); // to reset form
   setLocal();
   btnAdd.setAttribute("disabled", true);
});
// Update Product
btnUpdate.addEventListener("click", function () {
   updateProduct(); // to update product
   displayData(); // to show data after update
   btnAdd.classList.remove("d-none"); // to show button add
   btnUpdate.classList.add("d-none"); // to hidde button update
   reset(); // to reset form
   setLocal(); // to set data in local storage after update
});
// Search In Products
searchInput.addEventListener("input", search);
// ------------- End Events -------------
// ------------- Start Action -------------
// Add Product
function addProduct() {
   var product = {
      productName: inputs[0].value,
      productPrice: inputs[1].value,
      productCategory: inputs[2].value,
      productDescription: inputs[3].value,
   };
   products.push(product); // to add single product to array products
   console.log(product);
}
// Display product

function displayData(shearchOrDisplay = true) {
   // to display data if search or defult dislay
   var tableData = ``;
   for (var i = 0; i < products.length; i++) {
      if (
         shearchOrDisplay
            ? true
            : products[i].productName
                 .toLowerCase()
                 .includes(searchInput.value.toLowerCase())
      ) {
         // get curent product name then replace curent input value to span and insert curent input value in side
         //  لجلب اسم المنتج الحالي ثم استبدال الجزء الموجود في البحث من داخل اسم المنتج   ب ال الاسبان واضافة بداخلها القيمه الموجوده بالبحث
         var nameOrNameColor = products[i].productName
            .toLowerCase()
            .replace(
               searchInput.value.toLowerCase(),
               `<span class="bg-danger bg-opacity-50">${searchInput.value.toLowerCase()}</span>`
            );
         tableData += `
         <tr>
                           <td>${i + 1}</td>
                           <td>${nameOrNameColor}</td>
                           <td>${products[i].productPrice}</td>
                           <td>${products[i].productCategory}</td>
                           <td class="col-4">${
                              products[i].productDescription
                           }</td>
                           <td >
                            <div class="d-flex align-items-center gap-1">
                            <button
                            title="Update Product"
                            aria-label="To Update Procuct"
                            id="update"
                            onclick="getUpdateInfo(${i})"
                         >
                            <i
                               class="fa-solid fa-pen-to-square fa-lg text-warning"
                            ></i>
                         </button>
                         <button
                            title="Delete Product"
                            aria-label="To Delete Procuct"
                            id="delete"
                           onclick="deleteProduct(${i})"
                         >
                            <i
                               class="fa-solid fa-trash-can fa-lg text-danger"
                            ></i>
                         </button>
                            </div>
                           </td>
                        </tr>
         `;
      }
   }
   document.getElementById("row").innerHTML = tableData;
}
// Delete Product
function deleteProduct(index) {
   products.splice(index, 1); //to remove product in array
   displayData(); // to display data after delete in array
   setLocal(); // to change data in local storage
}
// Get Update Info
function getUpdateInfo(index) {
   curentIndexUpdate = index;
   btnAdd.classList.add("d-none"); // to hidde button add
   btnUpdate.classList.remove("d-none"); // to show button update
   var curentProduct = products[index];
   for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = Object.values(curentProduct)[i];
   }
}
// Update Product
function updateProduct() {
   var product = {
      productName: inputs[0].value,
      productPrice: inputs[1].value,
      productCategory: inputs[2].value,
      productDescription: inputs[3].value,
   };
   products.splice(curentIndexUpdate, 1, product);
   console.log(products);
}
// Search In Products
function search() {
   console.log(this.value);
   displayData(false);
}
// Reset
function reset() {
   inputs.forEach((input) => {
      input.value = ``;
      input.classList.remove("is-valid");
   });
}
// Set Local
function setLocal() {
   localStorage.setItem("productsCurd", JSON.stringify(products));
}
// Get Local
function getLocal() {
   return JSON.parse(localStorage.getItem("productsCurd"));
}
// ------------- End Action -------------
// ------------- Start Validation -------------
var validation = {
   productName: /^[\p{L}'][\p{L}\s]{1,20}$/iu,
   productPrice: /^[0-9]+$/,
   productCategory: /^[\p{L}][\p{L}\s]{1,20}$/iu,
   productDescription: /^[\p{L}][\p{L}\s]{1,20}$/iu,
   validationCheck: function (index, regexStyle) {
      return regexStyle.test(inputs[index].value)
         ? (inputs[index].classList.add("is-valid"),
           inputs[index].nextElementSibling.classList.add("d-none"),
           inputs[index].classList.remove("is-invalid"),
           true)
         : (inputs[index].classList.add("is-invalid"),
           inputs[index].nextElementSibling.classList.remove("d-none"),
           inputs[index].classList.remove("is-valid"),
           false);
   },
};
["click", "keyup"].forEach((ev) => {
   document.forms[0].addEventListener(ev, (e) => {
      e.preventDefault();
      if (
         validation.validationCheck(0, validation.productName) &&
         validation.validationCheck(1, validation.productPrice) &&
         validation.validationCheck(2, validation.productCategory) &&
         validation.validationCheck(3, validation.productDescription)
      ) {
         btnAdd.removeAttribute("disabled");
      } else {
         btnAdd.setAttribute("disabled", true);
      }
   });
});
