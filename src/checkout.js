import { getCartItem } from "./main";
  
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const zip = document.getElementById("zip");
  const cardNumber = document.getElementById("cardNumber");
  const expiry = document.getElementById("expiry");
  const cvv = document.getElementById("cvv");

const firstNameError = document.getElementById("firstNameError");
const lastNameError = document.getElementById("lastNameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const zipErr = document.getElementById("zipError");
const cardError = document.getElementById("cardError");
const expiryError = document.getElementById("expiryError");
const cvvError = document.getElementById("cvvError");


// Run only in checkout page
window.addEventListener("beforeunload", () => {
  const buyPlant = sessionStorage.getItem("buyNowPlant");
  if (buyPlant) {
    const product = JSON.parse(buyPlant);

    // ✅ Push it into localStorage cart
    const cart = getCartItem();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += product.quantity;
    } else {
      cart.push(product);
    }

    saveCartItem(cart);

    // ✅ Clear sessionStorage
    sessionStorage.removeItem("buyNowPlant");
  }
});

cardNumber.addEventListener("input", function(e) {
  let newCardval = e.target.value;
  let cardValue = newCardval.replace(/\D/g, "");
  cardValue = cardValue.substring(0, 16);
  newCardval = cardValue.replace(/(.{4})/g, "$1 ").trim();
  e.target.value = newCardval;
});

cvv.addEventListener("input", function(e){

  let cvvVal = e.target.value.replace(/\D/g, "");

  if(cvvVal.length > 3){
    cvvError.textContent = "Cvv should contain 3 digits!";
  }

});

expiry.addEventListener("input", function(e) {
  let cardDate = e.target.value.replace(/\D/g, "");
  if( cardDate.length > 4) {
    cardDate = cardDate.slice(0, 4);
  }
  if( cardDate.length >= 3) {
    cardDate = cardDate.slice(0, 2) + '/' + cardDate.slice(2);
  }
  e.target.value = cardDate;

  const [mm, yy] = cardDate.split("/");
  expiryError.textContent = "";
// console.log(mm,yy);

    const month = parseInt(mm.substring(0, 2), 10);
    const year = parseInt(yy, 10);

      if(!mm || !yy || mm.length !== 2 || yy.length !== 2){
        expiryError.textContent = "Expiry must be in MM/YY format";
        return false;
    }

    if(month < 1 || month > 12){
      expiryError.textContent = "Month is invalid!";
    }
    
    const currYear = new Date().getFullYear() % 100;
    const currMonth = new Date().getMonth() + 1;
    if(year <  currYear || (year === currYear && month < currMonth) ){
       expiryError.textContent = "Card Expired";
      return false;
    }
    return true;
  });



document.getElementById("checkoutForm").addEventListener("submit", function(e) {
  e.preventDefault();
  let valid = true;

  // reset
  [firstNameError,lastNameError,emailError,phoneError,cardError,expiryError,cvvError].forEach(el => el.textContent = "");
  [firstName,lastName,email,phone,cardNumber,expiry,cvv].forEach(el => el.classList.remove("error-border"));


  if(!firstName.value.trim()){
    firstNameError.textContent = "First name is required!";
    firstName.classList.add("error-border");

    valid = false;
  }
    if(!lastName.value.trim()){
    lastNameError.textContent = "Last name is required!";
    lastName.classList.add("error-border");
    valid = false;
  }

const emailValue = email.value.trim();

if(!emailValue){
  emailError.textContent = "Email is required";
  valid = false;
}
console.log(emailValue);

if(!/^[A-Za-z0-9._%+-]+@[A-Za-z][A-Za-z0-9.-]*\.[A-Za-z]{2,}$/.test(emailValue)){
 emailError.textContent = "Enter a valid Email";
 valid = false;
}

 const phoneValue = phone.value.trim();

  if(!phoneValue){
    phoneError.textContent = "Phone number is required!";
    valid = false;
  
  }
  if (!/^\d{10}$/.test(phoneValue)) {
    phoneError.classList.add("error-border");
    phoneError.textContent = "Enter a valid 10-digit phone number!";
    valid = false;
  }

  const zipVal = +zip.value.trim();
  console.log(typeof(zipVal));
  if(!/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(zipVal)){
    zipErr.textContent = "Enter a Zipcode with 7 digit";
    valid = false;
  }

  const cardNum = cardNumber.value.trim();
  console.log("card num",cardNum);
  if(!cardNum){
    cardError.textContent = "Card Number is required";
    valid = false;
  }
  
  if(valid){
    showThankyouModal();
  }

});


function addValidError(inputEl, errorEl, message){

  inputEl.addEventListener("input", () => {
      if(inputEl.value.trim()){
        errorEl.textContent="";
        inputEl.classList.remove("error-border");
      }else{
         errorEl.textContent=message;
         inputEl.classList.add("error-border");
      }
  });
}

// Attach to each input
addValidError(firstName, firstNameError, "First name is required!");
addValidError(lastName, lastNameError, "Last name is required!");
addValidError(email, emailError, "Email is required!");
addValidError(phone, phoneError, "Phone number is required!");
addValidError(cardNumber, cardError, "Card number is required!");
addValidError(expiry, expiryError, "Expiry date is required!");
addValidError(cvv, cvvError, "CVV is required!");


function showFinalCart(){
  const finalItems = getCartItem();
  console.log("final items",finalItems);
  const checkoutCartTable = document.querySelector(".cart-item_summary");
  const tableItems = 
      `
        <table class="summary-table mt-5">
        <thead style="border-bottom: 1px solid #000;">
          <th align="left">Plant Name </th>
          <th></th>
          <th class="px-2">Qty</th>
          <th>Price</th>
        </thead>  
        
          <tbody>
          ${finalItems.map((item) =>
             ` <tr style="border-bottom: 1px solid #ddd;">
                <td class="check-pd_image ">
                  <img class="w-25 m-5 ml-0 rounded" src="${item.image}" alt="${item.common_name}">
                </td>
                <td class="check-pd_name"><span class="mr-3 font-medium">${item.common_name}</span></td>
                <td class="check-pd_quantity" align="center"><span class="mr-3">${item.quantity}</span></td>
                <td class="check-pd_price"><span class="text-green font-bold">${+item.price * item.quantity}/- <span></td>
                 
              </tr>
              
              `
              ).join("")}
            </tbody>    
          </table> ` 
  

  checkoutCartTable.innerHTML = tableItems;

}

showFinalCart();

function showThankyouModal(){
  const modal = document.getElementById("thankYouModal");

  modal.classList.remove("hidden");

  document.getElementById("closeModalBtn").addEventListener("click", ()=>{
     modal.classList.add("hidden");
     document.getElementById("checkoutForm").reset();
     localStorage.removeItem(cart);
     sessionStorage.removeItem("buyNowPlant");
  });
}
