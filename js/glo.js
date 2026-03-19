function loadHTML(id, file) {
    fetch(file)
      .then(response => response.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;
      });
  }
  
  loadHTML("header", "../pages/header.html");
  loadHTML("footer", "../pages/footer.html");