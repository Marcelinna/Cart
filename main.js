const productsItemsList = document.querySelector(".products-items-list");
const basket = document.querySelector(".navbar-basket");
const basketoverlay = document.querySelector(".basket-overlay");
const btnBacktoShop = document.querySelector(".basket-btn-back-to-shop");
const burgerIcon = document.querySelector(".burger-icon");
const navbar = document.querySelector(".nav-items");
const logo = document.querySelector(".logo");

burgerIcon.addEventListener("click", function () {
  logo.classList.toggle("logo-hide");
  navbar.classList.toggle("navbar-show");
});

basket.addEventListener("click", () => {
  basketoverlay.style.visibility = "visible";
});

btnBacktoShop.addEventListener("click", () => {
  basketoverlay.style.visibility = "hidden";
});

const fetchItems = async () => {
  let result = await fetch("products.json");
  let data = await result.json();
  let products = data.items;
  products = products.map((item) => {
    const { title, price } = item.fields;
    const { id } = item.sys;
    const image = item.fields.image.fields.file.url;
    return { title, price, id, image };
  });
  displayProducts(products);
};

function displayProducts(products) {
  let result = "";

  products.forEach((product) => {
    result += ` 
          <div class="product-single-item">
          <div class="product-item-img-contener">
          <img class ="product-item-image"src=${product.image} alt="product" class="product-img"/>
          </div>
          <div>
          <h2 class="product-item-title">${product.title}</h2>
         <h3 class="product-item-price">${product.price} zł</h3>
          <button class="add-bag-btn" data-id=${product.id}>
          <i class="fas fa-shopping-cart"></i>
                Dodaj
         </button>
         </div>
         </div>`;
  });
  productsItemsList.innerHTML = result;

  const addToBasketButton = document.querySelectorAll(".add-bag-btn");
  for (var i = 0; i < addToBasketButton.length; i++) {
    var button = addToBasketButton[i];
    button.addEventListener("click", addToBasket);
  }
}

function addToBasket(event) {
  const button = event.target;
  const productDetail = button.parentElement.parentElement;

  const productTitle = productDetail.querySelector(".product-item-title")
    .innerText;

  const productPrice = productDetail.querySelector(".product-item-price")
    .innerText;

  const productImg = productDetail.querySelector(".product-item-image").src;

  button.innerText = "w koszyku";
  button.disabled = true;

  addProductsToBaset(productTitle, productPrice, productImg);
}

function addProductsToBaset(title, price, img) {
  const basketSummary = document.querySelector(".basket-summary");
  const basketSummaryProduct = document.createElement("div");
  basketSummary.appendChild(basketSummaryProduct);

  const productAdded = `<div class="basket-summary-items">
 <img class="basket-summary-items-img" src=${img} width="100" height="100"/>
 <div class="basket-summary-items-title">${title}</div>
 
 <div class="basket-summary-items-price">${price}</div>
 
 <input class="basket-summary-items-value" type="number" min="1" value="1"/>
 <button class="btn-basket-remove" type="button">USUŃ</button>
 </div>`;

  basketSummaryProduct.innerHTML = productAdded;

  setTotalPrice();
  removeProduct();
}

function setTotalPrice() {
  const basketTotalPrice = document.querySelector(
    ".baskte-summary-total-price"
  );
  const basketSummaryItems = document.querySelectorAll(".basket-summary-items");

  let totalPrice = 0;
  let totalCount = 0;

  for (let i = 0; i < basketSummaryItems.length; i++) {
    const basketSummaryItem = basketSummaryItems[i];
    const basketSummaryItemPrice = basketSummaryItem.querySelector(
      ".basket-summary-items-price"
    ).textContent;

    let basketSummaryItemValue = basketSummaryItem.querySelector(
      ".basket-summary-items-value"
    ).value;

    let basketSummaryItemHandle = basketSummaryItem.querySelector(
      ".basket-summary-items-value"
    );

    basketSummaryItemHandle.addEventListener("change", ChangeValue);

    totalPriceItem =
      parseFloat(basketSummaryItemPrice) * basketSummaryItemValue;

    totalPrice = totalPrice + totalPriceItem;
    totalCount = totalCount + parseInt(basketSummaryItemValue);
  }

  totalPrice = Math.round(totalPrice * 100) / 100;
  basketTotalPrice.innerText = `Suma: ${totalPrice} zł`;

  const basketNavbarIconValue = document.querySelector(".navbar-basket-value");
  basketNavbarIconValue.innerHTML = totalCount;
}

function ChangeValue(event) {
  let input = event.target;

  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }

  basketSummaryItemValue = input.value;
  setTotalPrice();
}

function removeProduct() {
  const removeButtonsfromBasket = document.querySelectorAll(
    ".btn-basket-remove"
  );

  for (let i = 0; i < removeButtonsfromBasket.length; i++) {
    const removeButton = removeButtonsfromBasket[i];
    removeButton.addEventListener("click", () => {
      const removedContent = removeButton.parentElement;
      removedContent.remove();

      const removedProduct = removeButton.parentElement.children[1].innerText;

      const addToBasketButton = document.querySelectorAll(".add-bag-btn");
      for (var i = 0; i < addToBasketButton.length; i++) {
        var button = addToBasketButton[i];

        buttonable = button.parentElement.children[0].innerText;

        if (buttonable.indexOf(removedProduct) >= 0) {
          button.disabled = false;
          button.innerHTML = `<i class="fas fa-shopping-cart"></i>
        Dodaj`;
        }
      }

      setTotalPrice();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchItems();
});
