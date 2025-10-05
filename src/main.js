import "./style.css";

const listItem = document.getElementById("plant-list");
const indoorPlantList = document.getElementById("i-list");
const cartQuantity = document.getElementById("cart-count");
const subTotal = document.getElementById("subtotal");
const cartTable = document.getElementById("cartTable");
const cTable = document.querySelector(".cart-table");
const totalAmount = document.getElementById("totalAmount");

// const apiKey = "sk-MKTr6852654ce854c11060";

const validCoupons = {
  "PLANT10": 10,  
  "GREEN20": 20,   
  "FOREST50": 50,   
};

function showPlantList(data, domElement) {
  if (!domElement) return;

  data.forEach((plant) => {
    const li = document.createElement("li");
    li.classList.add("plant-listItem");

    const plantImg = plant.default_image?.original_url || "placeholder.jpg";
    const plantName = plant.common_name || "Unnamed Plant";
    const plantPrice = plant.price.slice(1);
    
    li.setAttribute("data-id", plant.id);
    li.setAttribute("data-name", plantName);
    li.setAttribute("data-image", plantImg);
    li.setAttribute("data-price",+plantPrice || 100);
  console.log(plant.price)

    li.innerHTML = `
      <img src="${plantImg}" alt="${plantName}">
      <a href="/product-details.html?id=${plant.id}"><h4 class="text-center plant-name mt-2">${plantName}</h4></a> 
      <p class="text-center plant-price py-3 color-[var(--primary-color)]">${plant.price}</p>
      <button class="add-to-cart mt-6 btn-global">Add to Cart</button>
    `;

    domElement.appendChild(li);
  });
}

async function fetchAPI() {
  try {
    // const response = await fetch(`https://perenual.com/api/v2/species-list?key=${apiKey}`);
    const response = await fetch("/src/data/species-list.json");
    const result = await response.json();
    if(indoorPlantList){
        indoorPlantList.innerHTML="";
    }
    
    // console.log("local rsult:", result);
    showPlantList(result.data || [], indoorPlantList);
  } catch (err) {
    console.error("Error fetching plant data:", err);
  }
}

//fetch Indoor/Outdoor plants

async function fetchIndoorOutdoorAPI(flag) {
  try {
    const response = await fetch("/src/data/species-list.json");
    const result = await response.json();
    const filteredData = result.data.filter((plant) => plant.indoor === flag);
    indoorPlantList.innerHTML="";
    showPlantList(filteredData || [], indoorPlantList);
  } catch (err) {
    console.error("Error fetching indoor plant data:", err);
  }
}


fetchAPI();

async function fetchBothIndoorOutdoor() {
  //  const indoor = await fetch(`https://perenual.com/api/v2/species-list?key=${apiKey}&indoor=1`);
  //  const indoorData = await indoor.json();
  //  const outdoor = await fetch(`https://perenual.com/api/v2/species-list?key=${apiKey}&indoor=0`);
  //  const outdoorData = await outdoor.json();
   const response = await fetch("/src/data/species-list.json");
    const result = await response.json();
     indoorPlantList.innerHTML = ""; 
    const bothData = result.data.filter((plant) => plant.indoor === 1 || plant.indoor === 0);
   showPlantList(bothData, indoorPlantList);
}


// fetchIndoorOutdoor();
document.getElementById("filtering")?.addEventListener('click', handleClick);

function handleClick() {
  const indoorCheckbox = document.getElementById("indoor-filter");
  const outdoorCheckbox = document.getElementById("outdoor-filter");

  const indoorChecked = indoorCheckbox.checked;
  const outdoorChecked = outdoorCheckbox.checked;

  const indoorLabel = document.querySelector("label[for='indoor-filter']");
  const outdoorLabel = document.querySelector("label[for='outdoor-filter']");

  // Add/remove active class from labels based on checkbox state
  indoorLabel.classList.toggle("active", indoorChecked);
  outdoorLabel.classList.toggle("active", outdoorChecked);

  // ✅ Prioritize BOTH filter first
  if (indoorChecked && outdoorChecked) {
    fetchBothIndoorOutdoor();
  } else if (indoorChecked) {
    fetchIndoorOutdoorAPI(1);
  } else if (outdoorChecked) {
    fetchIndoorOutdoorAPI(0);
  } else {
    fetchAPI(); // Default all plants
  }
}

// async function fetchIndoorAPI() {
//   try {
//     const response = await fetch(`https://perenual.com/api/v2/species-list?key=${apiKey}&indoor=1`);
//     const result = await response.json();
//     showPlantList(result.data || [], indoorPlantList);
//   } catch (err) {
//     console.error("Error fetching indoor plant data:", err);
//   }
// }


//Product Listing

function saveCartItem(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function getCartItem() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

export function updateCartCount() {

  const cart = getCartItem();
   const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartQuantity) cartQuantity.textContent = total;
}

export function addedToCart(product) {
  const cart = getCartItem();
  const ifExist = cart.find((item) => item.id === product.id);

  const qty = product.quantity || 1;
//console.log("hello",product.price);
  if (ifExist) {
    ifExist.quantity += qty;
  } else {
   // product.quantity = qty;
    cart.push(product);
  }

  saveCartItem(cart);
  updateCartCount();
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const plantDiv = e.target.closest(".plant-listItem");
    if (!plantDiv) return;

     const id = parseInt(plantDiv.dataset.id);
     console.log("ID", id);
    
    if (isNaN(id)) {
      console.warn("Invalid plant ID:", plantDiv.dataset.id);
      return;
    }

   // console.log("Clicked plant:", id, "Price:", price); // check here

    const newPlant = {
      id,
      common_name: plantDiv.dataset.name,
      image: plantDiv.dataset.image,
      quantity: 1, // initialize quantity
      price:  plantDiv.dataset.price
    };

    addedToCart(newPlant);
    renderCart();
  }
});


// export async function renderCart() {
//   const cart = getCartItem();
//   if (!cartTable || !totalPrice) return;

//   cartTable.innerHTML = "";
//   let total = 0;

//     try {
//       const res = await fetch("./src/data/species-list.json");
//       const result = await res.json();
//       const productList = result.data;
//       console.log("cart", cart);
//       for (const item of cart) {
//       const product = productList.find(p => p.id === item.id);
//       if (!product) {
//       console.error(`Product with id ${item.id} not found.`);
//       continue;
//     }

//       const imageUrl = product.default_image?.original_url || item.image || "placeholder.jpg";
//       const name = item.common_name || product.common_name || "Unnamed Plant";
//       const priceStr = product.price  || 10;
//       const price = parseInt(priceStr.replace(/[^\d]/g, ""), 10);
      
//       const subtotal = price * item.quantity;
//       console.log(item.quantity);
//       total += subtotal;
//       // console.log("subtotal", price.slice(0));
//       const tr = document.createElement("tr");
//       tr.dataset.id = item.id;
//       tr.innerHTML = `
//        <td>
//           <button class="remove-btn" data-id="${item.id}">&times;</button>
//         </td>
//         <td class="product-td"><img src="${imageUrl}" alt="${name}">
//         <span class="plant-name">${name}</span></td>
//         <td data-price="${price}"> ${priceStr}/- </td>
//         <td>
//          <div class="quantity-container">
//             <button class="decrement">-</button>
//             <span class="item-quantity">${item.quantity}</span>
//             <button class="increment">+</button>
//          </div>  
//         </td>
//         <td>${subtotal}/-</td>
       
//       `;
     
     
//     const cartHead = document.getElementById("cartTHead");
//     console.log(typeof(cart.length));
//         if (cart.length === 0) {
//           alert("empty cart");
//         }else if(cartHead) {
//           cartHead.style.display = "none";
//           tr.innerHTML = `
           
//               <td colspan="5" class="text-center py-4 text-gray-500 empty-cart">
//                 📪 Sorry, the cart is empty!!!
//               </td>
          
//           `;
//           totalPrice.textContent = "0";
//            cartTable.appendChild(tr);
//           return;
//         } else {
//             if (cartHead) cartHead.style.display = ""; 
//           }
//       }
//     } catch (err) {
//       console.error("Error rendering cart item:", err);
//     }
//   }

  //totalPrice.textContent = total;


// Increase and Decrese quantity


export async function renderCart() {
  const cart = getCartItem();
  if (!cartTable || !subTotal) return;

  cartTable.innerHTML = "";
  let total = 0;

  //    const cartHead = document.getElementById("cartTHead");
  // if (cartHead) cartHead.remove();

  if (cart.length === 0) {
    cTable.innerHTML = `
      <div class="empty-cart-message text-center py-8 text-gray-500">
        📪 Sorry, your cart is empty!!!
      </div>
    `;

   subTotal.textContent = 0;
    return;
  }

  try {
    const res = await fetch("/src/data/species-list.json");
    const result = await res.json();
    const productList = result.data;

    for (const item of cart) {
      const product = productList.find(p => p.id === item.id);
      if (!product) {
        console.error(`Product with id ${item.id} not found.`);
        continue;
      }

      const imageUrl = product.default_image?.original_url || item.image || "placeholder.jpg";
      const name = item.common_name || product.common_name || "Unnamed Plant";
      const priceStr = product.price || "10";
      const price = parseInt(priceStr.replace(/[^\d]/g, ""), 10);
      const subtotal = price * item.quantity;
      total += subtotal;

      const tr = document.createElement("tr");
      tr.dataset.id = item.id;
      tr.innerHTML = `
        <td>
          <button class="remove-btn" data-id="${item.id}">&times;</button>
        </td>
        <td class="product-td"><img src="${imageUrl}" alt="${name}">
          <span class="plant-name">${name}</span></td>
        <td data-price="${price}">${priceStr}/-</td>
        <td>
          <div class="quantity-container">
            <button class="decrement">-</button>
            <span class="item-quantity">${item.quantity}</span>
            <button class="increment">+</button>
          </div>
        </td>
        <td>${subtotal}/-</td>
      `;
      cartTable.appendChild(tr);
      
     
    }

     subTotal.textContent = `${total}/-`;
  } catch (err) {
    console.error("Error rendering cart item:", err);
  }
}


cartTable?.addEventListener("click", function(e){
  e.preventDefault();
  if(!e.target.classList.contains("increment") && !e.target.classList.contains("decrement")) return;

  const row = e.target.closest("tr");
  const id = parseInt(row.dataset.id);
  const cart = getCartItem();
  console.log("cart", cart);
  const item = cart.find(i => i.id === id);
  if (!item) return;
  if(e.target.classList.contains("increment")){
    item.quantity++;
  }else if(e.target.classList.contains("decrement") && item.quantity > 1){
    item.quantity--;
  }
    localStorage.setItem("cart", JSON.stringify(item.quantity > 0 ? cart : cart.filter(i => i.id !== id)));
  renderCart();
  updateCartTotal();
});

function cleanInvalidCartItems() {
  const cart = getCartItem();
  const validCart = cart.filter(item => item.id !== null && !isNaN(item.id));
  saveCartItem(validCart);
}

function removeCart(deleteitemID) {
  const updatedCart = getCartItem().filter(item => String(item.id) !== String(deleteitemID));
  saveCartItem(updatedCart);
  renderCart();
  updateCartCount();
  cleanInvalidCartItems();
}


if (cartTable) {
  cartTable.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-btn")) {
       e.preventDefault();
      const itemId = e.target.dataset.id;
      removeCart(itemId);
      alert("Removed from cart");
      
    }
  });
}

// Proceed checkout button
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.querySelector("#proceed-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("buyNowPlant");
      window.location.href="checkout.html";
    });
  }
});


// Cart calculation only 

function checkoutItems() {
   const isCheckout = /checkout\.html$/i.test(location.pathname);
   if(isCheckout){
      const buyPlant = sessionStorage.getItem("buyNowPlant");
    if (buyPlant) {
      return [JSON.parse(buyPlant)];
    }
   }


  return getCartItem();
}

const couponMsg = document.getElementById("couponMessage"); 
const shipping = document.getElementById("shipping");
const coupDisc = document.getElementById("coupDisc");

function updateCartTotal() {
  let cartItems = checkoutItems();
  console.log("Cart items:", cartItems);

  let subtotal = 0;
  const shippingAmt = 100;

  // Reset coupon discount display
  if (coupDisc) {
    coupDisc.textContent = "-0/-";
  }

  //  subtotal
  cartItems.forEach(item => {
    const price = parseFloat(item.price) || 0;   // safer than parseInt
    const qty = Number(item.quantity) || 0;
    subtotal += price * qty;
  });

  console.log("Subtotal:", subtotal);

  // coupon logic
  let appliedCoupon = localStorage.getItem("appliedCoupon");
  let discountPercent = 0;

  if (appliedCoupon === "PLANT10" && subtotal >= 500) {
    discountPercent = 10;
  } else if (appliedCoupon === "GREEN20" && subtotal >= 1500) {
    discountPercent = 20;
  } else if (appliedCoupon === "FOREST50" && subtotal >= 2500) {
    discountPercent = 50;
  }

  const discountValue = (discountPercent / 100) * subtotal;
  const discountedTotal = subtotal - discountValue;

  // calculate final total with shipping
  const shippingCharge = discountedTotal > 2000 ? 0 : shippingAmt;
  const finalTotal = discountedTotal + shippingCharge;

  // update DOM
  if (subTotal) subTotal.textContent = `₹${subtotal.toFixed(2)}`;
  if (coupDisc) coupDisc.textContent = `-₹${discountValue.toFixed(2)}`;
  if (shipping) shipping.textContent = `₹${shippingCharge}`;
  if (totalAmount) totalAmount.textContent = `₹${finalTotal.toFixed(2)}`;

  console.log("Discount:", discountValue);
  console.log("Final Total:", finalTotal);
}


let currentDiscount = 0;
let curentCoupon = null;
let discount = 0;
let couponCode = "";
document.getElementById("apply-cupon")?.addEventListener("click", function(){
const cuponInput = document.getElementById("couponInput")?.value.trim().toUpperCase();
 let cartItems = getCartItem() || [];
 let total = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  subTotal.textContent = `${total}/-`;
 
if (!cuponInput) {
  couponMsg.textContent = "Enter a coupon to get discount％";
  localStorage.removeItem("appliedCoupon");
  return;
}
 if (total < 500) {
  couponMsg.textContent = "🚫 Minimum amount required is ₹500.";
  localStorage.removeItem("appliedCoupon");
  return;
}
if (cuponInput === "GREEN20") {
    if (total >= 1500) {
      discount = 20;
      couponCode = "GREEN20";
      localStorage.setItem("appliedCoupon", couponCode);
      couponMsg.textContent = "✅ 20% discount applied with GREEN20";
    } else {
      discount = 0;
      couponCode = null;
      couponMsg.textContent = "⚠️ Please add items worth more than ₹1500 to use GREEN20.";
      localStorage.removeItem("appliedCoupon");
    }
  }
  else if (cuponInput === "FOREST50") {
    if (total >= 2500) {
      discount = 50;
      couponCode = "FOREST50";
      localStorage.setItem("appliedCoupon", couponCode);
      couponMsg.textContent = "✅ 50% discount applied with FOREST50";
    } else {
      discount = 0;
      couponCode = null;
      couponMsg.textContent = "⚠️ Please add items worth more than ₹2500 to use FOREST50.";
      localStorage.removeItem("appliedCoupon");
    }
  }
  else if (validCoupons[cuponInput]) {
    discount = validCoupons[cuponInput];
    couponCode = cuponInput;
    localStorage.setItem("appliedCoupon", couponCode);
    couponMsg.textContent = `✅ ${discount}% discount applied with ${couponCode}`;
  }
  else {
    discount = 0;
    couponCode = null;
    couponMsg.textContent = "🚫 Invalid coupon code!!";
    localStorage.removeItem("appliedCoupon");
  }

updateCartTotal();
  
});

function loadStoredCoupon() {
  const savedCoupon = localStorage.getItem("appliedCoupon");
  const couponInput = document.getElementById("couponInput");
  const couponMessage = document.getElementById("couponMessage");

  if (!couponInput || !couponMessage) return; // avoid error if not yet rendered
  if (savedCoupon && validCoupons.hasOwnProperty(savedCoupon)) {
    curentCoupon = savedCoupon;
    currentDiscount = validCoupons[savedCoupon];
    document.getElementById("couponInput").value = savedCoupon;
    document.getElementById("couponMessage").textContent = `✅ ${currentDiscount}% off applied using ${savedCoupon}`;
    if (couponInput) couponInput.value = savedCoupon;
    // if (couponMessage) {
    //   couponMessage.textContent = `✅ ${currentDiscount}% off applied using ${savedCoupon}`;
    // }
  } else {
    currentDiscount = 0;
    curentCoupon = null;
  }

  updateCartTotal();
}


document.addEventListener("DOMContentLoaded", () => {
    if (couponMsg) {
    couponMsg.textContent = ""; 
  }
  updateCartCount();
  renderCart();
  cleanInvalidCartItems();
  loadStoredCoupon();
  updateCartTotal();
});

window.addEventListener("pageshow", (e) => {
  // whether cached or not, refresh UI
  renderCart();
  updateCartTotal();
  updateCartCount();
});
