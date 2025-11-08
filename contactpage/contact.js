// Contact Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize contact page functionality
  initContactPage();
});

function initContactPage() {
  // Add contact page class to body for back-to-top button
  document.body.classList.add("contact-page");

  // Initialize contact form
  initContactForm();

  // Add content to global search
  addContactContentToSearch();
}

function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    // Validate form
    if (validateForm(formData)) {
      // Simulate form submission
      simulateFormSubmission(formData);
    }
  });
}

function validateForm(formData) {
  const formMessage = document.getElementById("formMessage");

  // Reset message
  formMessage.className = "form-message";
  formMessage.style.display = "none";

  // Basic validation
  if (!formData.name.trim()) {
    showFormMessage("Please enter your name.", "error");
    return false;
  }

  if (!formData.email.trim() || !isValidEmail(formData.email)) {
    showFormMessage("Please enter a valid email address.", "error");
    return false;
  }

  if (!formData.subject) {
    showFormMessage("Please select a subject.", "error");
    return false;
  }

  if (!formData.message.trim()) {
    showFormMessage("Please enter your message.", "error");
    return false;
  }

  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFormMessage(message, type) {
  const formMessage = document.getElementById("formMessage");
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = "block";

  // Scroll to message
  formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
}

function simulateFormSubmission(formData) {
  const submitBtn = document.querySelector(".submit-btn");
  const originalText = submitBtn.innerHTML;

  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    // In a real application, you would send the data to your server here
    console.log("Form submitted:", formData);

    // Show success message
    showFormMessage(
      "Thank you for your message! We'll get back to you soon.",
      "success"
    );

    // Reset form
    document.getElementById("contactForm").reset();

    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // You would typically send the data to your server like this:
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //   showFormMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
    //   document.getElementById('contactForm').reset();
    //   submitBtn.innerHTML = originalText;
    //   submitBtn.disabled = false;
    // })
    // .catch(error => {
    //   showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    //   submitBtn.innerHTML = originalText;
    //   submitBtn.disabled = false;
    // });
  }, 2000);
}

function addContactContentToSearch() {
  // Add contact page content to global search
  if (window.addContentToSearch) {
    const contactContent = {
      title: "Contact Us - The Beat Report",
      description:
        "Get in touch with The Beat Report for music submissions, event coverage, advertising, and partnerships.",
      url: "contact.html",
      category: "pages",
    };

    window.addContentToSearch("pages", [contactContent]);
  }
}

// FAQ Accordion (optional enhancement)
function initFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector("h3");
    const answer = item.querySelector("p");

    // Initially hide answers
    answer.style.display = "none";

    question.style.cursor = "pointer";
    question.addEventListener("click", () => {
      const isVisible = answer.style.display === "block";
      answer.style.display = isVisible ? "none" : "block";
      item.style.transform = isVisible ? "translateY(0)" : "translateY(-5px)";
    });
  });
}
