document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".section-link");
  const sections = document.querySelectorAll("section");

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = e.target.getAttribute("data-target");

      // Remove active class from all sections and links
      sections.forEach(section => section.classList.remove("active"));
      links.forEach(link => link.classList.remove("active"));

      // Add active class to clicked link and target section
      document.getElementById(targetId).classList.add("active");
      e.target.classList.add("active");
    });
  });
});