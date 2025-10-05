
function loadLayout() {
  // Load Header
  // fetch('header.html')
  //   .then(res => res.text())
  //   .then(data => {
  //     document.getElementById('header').innerHTML = data;
  //   });

  // Load Footer
  fetch('footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    });
}

document.addEventListener('DOMContentLoaded', loadLayout);
 