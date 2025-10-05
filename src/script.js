const dropdownMenu = document.querySelector(".dropdown-menu");
const testimonials = document.querySelectorAll(".testimonial");
const dots = document.querySelectorAll(".dots");
//const dropdownToggle = document.querySelector(".nav-toggle");

//Menu Toggle

// window.addEventListener("DOMContentLoaded", () => {
const dropdownToggle = document.querySelector(".nav-toggle");
// if(dropdownToggle){
dropdownToggle.addEventListener("click", (e) => {
 // alert("clicked");
  e.preventDefault();
  setTimeout(() => {
    dropdownMenu.classList.toggle("open");
  }, 300);
});
// }
// });


//Testimonial
let currentIndex = 0;

dots.forEach((dot, index) => {
  dot.setAttribute('data-index', index);
});

function showSlides(index){
   testimonials.forEach((testimonial, i) => {
    testimonial.classList.remove("fade"); 
    if (i === index) {
      testimonial.classList.add("active", "fade");
    } else {
      testimonial.classList.remove("active");
    }
  });
}


document.addEventListener("DOMContentLoaded", function () {
  const prevButton = document.getElementById("prev");
  prevButton?.addEventListener("click", function () {
     currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  showSlides(currentIndex);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const nextButton = document.getElementById("next");
  if (nextButton) {
      nextButton.addEventListener("click", function(){
      currentIndex = (currentIndex + 1 ) % testimonials.length;
      showSlides(currentIndex);
    });
  }
});
