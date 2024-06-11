document.addEventListener("DOMContentLoaded", function () {
    var menuToggle = document.querySelector(".navbar-toggler");
    var sidebarMenu = document.getElementById("sidebarMenu");

    menuToggle.addEventListener("click", function () {
        sidebarMenu.classList.toggle("show");
    });
});
