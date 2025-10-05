import { updateCartCount } from './main.js';
import { renderCart } from './main.js';
import { addedToCart } from './main.js';

const queryString = window.location.search;
const fetchURL = new URLSearchParams(queryString);
const imgContainer = document.querySelector(".product-img");
const thumbnailImg = document.querySelector(".thumbnail-images");
const plantId = parseInt(fetchURL.get("id")); 


//console.log("Plant ID from URL:", plantId);

function formatName(str) {
  return str.split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ✅ Fetch plant details if ID is present
if (plantId) {
  async function fetchPlantDetails() {
    try {
      const detailsURL = await fetch("./src/data/species-list.json");
      const response = await detailsURL.json();
      const plant = response.data.find(p => p.id === plantId);

      if (!plant) {
        console.error("Plant not found with ID:", plantId);
        return;
      }

      console.log("Product details:", plant);

      const img = document.createElement("img");
      img.src = plant.default_image.original_url;
      imgContainer.appendChild(img);
 
      if (Array.isArray(plant.other_images) && plant.other_images.length > 0) {
        plant.other_images.forEach(url => {
          console.log("url", url);
            const thumbImg = document.createElement("img");
            thumbImg.src = url;
            thumbnailImg.appendChild(thumbImg);
           
        });
      }
    

      const updatedName = formatName(plant.common_name);
      const scname = plant.scientific_name;
      document.querySelector(".singleplant-name").textContent = updatedName;
      document.querySelector(".scientific-name").innerHTML = `Scientific name: <span>${scname}</span>`;

      document.querySelector(".sunlight-cond").innerHTML =
        `<span>${plant.sunlight[0]}</span>, <span>${plant.sunlight[1]}</span>`;

    } catch (err) {
      console.error("Error fetching plant details", err);
    }
  }

  fetchPlantDetails();
}

// ✅ DOM loaded section
document.addEventListener("DOMContentLoaded", function () {
  const increaseBtn = document.querySelector(".increment");
  const decreaseBtn = document.querySelector(".decrement");
  const quantityVal = document.querySelector("#plant-quantity");
  const addToCart = document.querySelector(".add-to-cart");
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabPanels = document.querySelectorAll(".tab-panel");

  increaseBtn.addEventListener("click", function () {
    let value = parseInt(quantityVal.value) || 1;
    quantityVal.value = value + 1;
  });

  decreaseBtn.addEventListener("click", function () {
    let value = parseInt(quantityVal.value) || 1;
    if (value > 1) quantityVal.value = value - 1;
  });

  // ✅ Handle Add to Cart click
document.addEventListener("click", (e) => {
   
    let quantity = parseInt(quantityVal.value);

    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
      const plantdetails = e.target.closest(".plant-details");
    if(!plantdetails) return;
    const plantName = plantdetails.querySelector(".singleplant-name")?.textContent.trim();;
        const plantPriceTxt = plantdetails.querySelector(".plant-price")?.textContent.trim();
        const price = parseFloat(plantPriceTxt.replace(/[^\d.]/g, ""));
        quantity = parseInt(document.getElementById("plant-quantity")?.value) || 1;
   
          const newPlant = {
          id: plantId,
          name: plantName,   
          quantity,
          price            
        };
if (e.target.classList.contains("add-to-cart")) {
    addedToCart(newPlant); 
    alert("Item added to cart");

    renderCart(); 
}
  else if(e.target.classList.contains("buy-now")) {
  
    
        const buyNowPlant = {
            id: plantId,
          name: plantName,   
          quantity,
          price   
        };

        sessionStorage.setItem("buyNowPlant", JSON.stringify(buyNowPlant));
        window.location.href="checkout.html";
     }
  
  });

  // window.addEventListener("beforeunload", () => {
  //     sessionStorage.removeItem("buyNowPlant");
  // });


  // ✅ Load description and additional info
  function plantDesc(plantId) {
    fetch("./src/data/species-list.json")
      .then(res => res.json())
      .then(detailsData => {
        const plant = detailsData.data.find(pl => pl.id === plantId);
        if (!plant) return;

        const description = document.querySelector('#description');
        const additiondesc = document.querySelector('#add-info');

        if (description) description.textContent = plant.description || "No description available";
        if (additiondesc) additiondesc.textContent = plant.additional_information || "No additional information available";
      })
      .catch(err => {
        console.error("Failed to fetch or parse species-list.json", err);
      });
  }

  if (plantId) {
    plantDesc(plantId);
  } else {
    console.warn("No plant ID found in the URL");
  }

  // ✅ Tab functionality
  tabLinks.forEach(link => {
    link.addEventListener("click", function () {
      const selectedTab = this.getAttribute("data-tab");

      tabLinks.forEach(link => link.classList.remove('active'));
      this.classList.add("active");

      tabPanels.forEach(panel => panel.classList.remove('active'));
      const activeTabPanel = document.querySelector(`#${selectedTab}`);
      if (activeTabPanel) activeTabPanel.classList.add('active');
    });
  });
});

document.addEventListener("click", (e) =>{
  if(e.target.closest(".thumbnail-images img")){
    const thumbImg = e.target;
  const mainImg = document.querySelector(".product-img img");

  if(!mainImg){
    return;
  }
  mainImg.classList.add("fade-out");

  setTimeout(()=>{
    mainImg.src = thumbImg.src;
    mainImg.classList.remove("fade-out");
  }, 100)
 
}
});

// document.addEventListener("click", (e) => {
//   if (e.target.closest(".thumbnail-images img")) {
//     const clickedImg = e.target;
//     console.log("Clicked thumbnail:", clickedImg.src);

//     const mainImage = document.querySelector(".product-img img");
//     if (!mainImage) {
//       //console.error("Main image not found!");
//       return;
//     }

//     mainImage.src = clickedImg.src;
//   }
// });
