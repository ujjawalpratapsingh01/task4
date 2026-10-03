(function () {
  "use strict";

  
  const DEMO_EMAIL = "admin@stackCRM.com";
  const DEMO_PASSWORD = "admin12345";
  
  
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  const panelLogin = document.getElementById("panel-login");
  const panelRegister = document.getElementById("panel-register");
  const demoBox = document.getElementById("demo-box");
  const notification = document.getElementById("notification");
  const autoFillBtn = document.getElementById("auto-fill");
  const forgotBtn = document.getElementById("forgot-password");

  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  const loginBtn = document.getElementById("login-btn");

  
  function showNotification(message, type = "info") {
    notification.textContent = message;
    notification.className = "notification " + type;
    notification.hidden = false;
  }

  function hideNotification() {
    notification.hidden = true;
    notification.textContent = "";
    notification.className = "notification";
  }

  function setFieldError(input, errorEl, message) {
    if (message) {
      input.classList.add("invalid");
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      input.classList.remove("invalid");
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function setLoading(button, isLoading) {
    const text = button.querySelector(".btn-text");
    const spinner = button.querySelector(".btn-spinner");
    button.disabled = isLoading;
    if (isLoading) {
      text.textContent = "Authenticating...";
      spinner.hidden = false;
    } else {
      text.textContent = "Login";
      spinner.hidden = true;
    }
  }

  
  function switchTab(mode) {
    hideNotification();
    const isLogin = mode === "login";
    tabLogin.classList.toggle("active", isLogin);
    tabRegister.classList.toggle("active", !isLogin);
    panelLogin.classList.toggle("active", isLogin);
    panelRegister.classList.toggle("active", !isLogin);
    panelLogin.hidden = !isLogin;
    panelRegister.hidden = isLogin;
    demoBox.hidden = !isLogin;
  }

  tabLogin.addEventListener("click", () => switchTab("login"));
  tabRegister.addEventListener("click", () => switchTab("register"));

  
  function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    if (!toggle || !input) return;

    toggle.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      toggle.querySelector(".eye-open").hidden = isPassword;
      toggle.querySelector(".eye-closed").hidden = !isPassword;
    });
  }

  setupPasswordToggle("toggle-login-password", "login-password");

  autoFillBtn.addEventListener("click", () => {
    loginEmail.value = DEMO_EMAIL;
    loginPassword.value = DEMO_PASSWORD;
    hideNotification();
    setFieldError(loginEmail, document.getElementById("login-email-error"), "");
    setFieldError(loginPassword, document.getElementById("login-password-error"), "");
  });

  
  forgotBtn.addEventListener("click", () => {
    showNotification("Password reset functionality is available in the production version.", "info");
  });

  
  panelLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    hideNotification();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    let valid = true;

    if (!email || !isValidEmail(email)) {
      setFieldError(loginEmail, document.getElementById("login-email-error"), "Please enter a valid email.");
      valid = false;
    }
    if (!password || password.length < 6) {
      setFieldError(loginPassword, document.getElementById("login-password-error"), "Valid password is required.");
      valid = false;
    }

    if (!valid) return;

    setLoading(loginBtn, true);

    setTimeout(() => {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        showNotification("Login successful! Redirecting to Dashboard...", "success");
        setTimeout(() => {
          // YEH LINE TOKEN SAVE KARTI HAI JISSE DASHBOARD REDIRECT NAHI HOTA
          localStorage.setItem('nexora_auth', 'true');
          window.location.href = "dashboard.html";
        }, 1200);
      } else {
        setLoading(loginBtn, false);
        showNotification("Invalid email or password.", "error");
      }
    }, 900);
  });
})();