console.log("contact.js loaded successfully");

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactPage);
} else {
  initContactPage();
}

function initContactPage() {
  console.log("Initializing contact page...");

  document.body.classList.add("contact-page");

  initGSAPAnimations();

  initContactForm();

  addRealTimeValidation();

  console.log("✓ Contact page initialized");
}

function initGSAPAnimations() {
  console.log("Initializing GSAP animations...");

  if (typeof gsap === "undefined") {
    console.error("GSAP not loaded! Make sure to include GSAP in your HTML");
    return;
  }

  const heroAnimation = gsap.timeline();
  heroAnimation
    .from(".contact-hero h1", {
      duration: 1,
      y: 100,
      opacity: 0,
      ease: "power3.out",
    })
    .from(
      ".contact-hero p",
      {
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: "power2.out",
      },
      "-=0.3"
    );

  gsap.from(".contact-method", {
    duration: 0.8,
    x: -50,
    opacity: 0,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".contact-info-card",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.from(".contact-form-section", {
    duration: 1,
    x: 100,
    opacity: 0,
    ease: "elastic.out(1, 0.5)",
    scrollTrigger: {
      trigger: ".contact-form-section",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.from(".faq-item", {
    duration: 0.8,
    rotationY: -90,
    opacity: 0,
    stagger: 0.15,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".faq-section",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.to(".social-icon", {
    duration: 1.5,
    scale: 1.1,
    opacity: 0.8,
    repeat: -1,
    yoyo: true,
    stagger: 0.2,
    ease: "sine.inOut",
  });

  console.log("GSAP animations initialized");
}

function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) {
    console.error("Contact form not found!");
    return;
  }

  console.log("✓ Contact form found");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted!");

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value.trim();

    console.log("Form data:", { name, email, subject, message });

    if (!validateForm(name, email, subject, message)) {
      return;
    }

    submitToFormspree(contactForm);
  });

  console.log("Form event listener added");
}

function validateForm(name, email, subject, message) {
  clearMessage();

  if (!name) {
    showMessage("Please enter your name", "error");
    return false;
  }

  if (!email) {
    showMessage("Please enter your email", "error");
    return false;
  }

  if (!isValidEmail(email)) {
    showMessage("Please enter a valid email address", "error");
    return false;
  }

  if (!subject) {
    showMessage("Please select a subject", "error");
    return false;
  }

  if (!message) {
    showMessage("Please enter your message", "error");
    return false;
  }

  if (message.length < 10) {
    showMessage(
      "Please write a more detailed message (at least 10 characters)",
      "error"
    );
    return false;
  }

  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showMessage(message, type) {
  const formMessage = document.getElementById("formMessage");
  if (!formMessage) {
    console.error("Form message element not found");
    return;
  }

  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = "block";

  gsap.fromTo(
    formMessage,
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
  );

  formMessage.scrollIntoView({ behavior: "smooth", block: "center" });

  console.log(`Message shown: ${message} (${type})`);
}

function clearMessage() {
  const formMessage = document.getElementById("formMessage");
  if (formMessage) {
    formMessage.style.display = "none";
    formMessage.className = "form-message";
  }
}

function submitToFormspree(form) {
  const submitBtn = document.querySelector(".submit-btn");
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  gsap.to(submitBtn, {
    duration: 0.6,
    scale: 0.95,
    backgroundColor: "#7d3c98",
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });

  console.log("Submitting to Formspree...");

  const formData = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      gsap.killTweensOf(submitBtn);

      if (response.ok) {
        console.log("Form submitted successfully!");

        gsap.to(submitBtn, {
          duration: 0.3,
          scale: 1,
          backgroundColor: "#27ae60",
          ease: "back.out(1.7)",
        });

        showMessage(
          "Thank you for your message! We'll get back to you soon.",
          "success"
        );
        form.reset();

        setTimeout(() => {
          gsap.to(submitBtn, {
            duration: 0.5,
            backgroundColor: "#8e44ad",
            ease: "power2.out",
          });
        }, 2000);
      } else {
        response.json().then((data) => {
          if (data.error) {
            throw new Error(data.error);
          } else {
            throw new Error("Form submission failed");
          }
        });
      }
    })
    .catch((error) => {
      gsap.killTweensOf(submitBtn);

      console.error("Form submission error:", error);

      gsap.to(submitBtn, {
        duration: 0.3,
        scale: 1,
        backgroundColor: "#e74c3c",
        ease: "back.out(1.7)",
      });

      showMessage(
        "Sorry, there was an error sending your message. Please try again later or email us directly at timothychilezi@gmail.com",
        "error"
      );

      setTimeout(() => {
        gsap.to(submitBtn, {
          duration: 0.5,
          backgroundColor: "#8e44ad",
          ease: "power2.out",
        });
      }, 2000);
    })
    .finally(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
}

function addRealTimeValidation() {
  const inputs = document.querySelectorAll(
    "#contactForm input, #contactForm select, #contactForm textarea"
  );

  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      gsap.to(this, {
        duration: 0.3,
        scale: 1.02,
        borderColor: "#8e44ad",
        ease: "power2.out",
      });
    });

    input.addEventListener("blur", function () {
      gsap.to(this, {
        duration: 0.3,
        scale: 1,
        borderColor: "#ddd",
        ease: "power2.out",
      });
      validateField(this);
    });

    input.addEventListener("input", function () {
      clearFieldError(this);
    });
  });

  console.log("✓ Real-time validation added");
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;

  switch (field.id) {
    case "name":
      if (!value) {
        showFieldError(field, "Name is required");
        isValid = false;
      }
      break;

    case "email":
      if (!value) {
        showFieldError(field, "Email is required");
        isValid = false;
      } else if (!isValidEmail(value)) {
        showFieldError(field, "Please enter a valid email address");
        isValid = false;
      }
      break;

    case "subject":
      if (!value) {
        showFieldError(field, "Please select a subject");
        isValid = false;
      }
      break;

    case "message":
      if (!value) {
        showFieldError(field, "Message is required");
        isValid = false;
      } else if (value.length < 10) {
        showFieldError(field, "Message should be at least 10 characters");
        isValid = false;
      }
      break;
  }

  if (isValid) {
    clearFieldError(field);

    gsap.to(field, {
      duration: 0.3,
      borderColor: "#27ae60",
      ease: "power2.out",
    });
  }

  return isValid;
}

function showFieldError(field, message) {
  clearFieldError(field);

  gsap.to(field, {
    duration: 0.1,
    x: -10,
    repeat: 5,
    yoyo: true,
    ease: "power1.inOut",
    onComplete: function () {
      gsap.to(field, { duration: 0.1, x: 0 });
    },
  });

  field.style.borderColor = "#dc3545";

  let errorElement = document.createElement("div");
  errorElement.className = "field-error";
  errorElement.style.color = "#dc3545";
  errorElement.style.fontSize = "0.85rem";
  errorElement.style.marginTop = "5px";
  errorElement.textContent = message;

  gsap.fromTo(
    errorElement,
    { y: -10, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
  );

  field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
  field.style.borderColor = "#ddd";
  const existingError = field.parentNode.querySelector(".field-error");
  if (existingError) {
    gsap.to(existingError, {
      duration: 0.2,
      opacity: 0,
      y: -10,
      onComplete: function () {
        if (existingError.parentNode) {
          existingError.remove();
        }
      },
    });
  }
}

window.contactFunctions = {
  initContactPage: initContactPage,
  initGSAPAnimations: initGSAPAnimations,
  initContactForm: initContactForm,
  validateForm: validateForm,
  submitToFormspree: submitToFormspree,
};

console.log("contact.js setup complete");
