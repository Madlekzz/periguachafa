// Datos de productos (con imágenes locales)
const products = [
  {
    id: 1,
    name: "Epomaker 68HE Lite",
    description: "Teclado magnetico Hall Effect con iluminación RGB",
    price: 42.5,
    category: "teclados",
    image: "./images/teclado 2.png",
  },
  {
    id: 2,
    name: "Razer Viper V3 PRO",
    description: "Mouse óptico, Wireless 8khz Polling Rate<br><br/>",
    price: 169.99,
    category: "mouse",
    image: "./images/mouse.png",
  },
  {
    id: 3,
    name: "HyperX Cloud Alpha",
    description: "Auriculares con sonido 7.1 y micrófono noise-cancelling",
    price: 120.0,
    category: "auriculares",
    image: "./images/HEADPHONES.png",
  },
  {
    id: 4,
    name: "Zowie XL2586",
    description: "Monitor gaming de 27 pulgadas Fast-TN 600hz Refresh Rate",
    price: 1200.0,
    category: "monitores",
    image: "./images/monitor.png",
  },
  {
    id: 5,
    name: "SteelSeries Apex 3 pro",
    description: "Teclado magnetico Hall Effect con iluminación RGB",
    price: 149.99,
    category: "teclados",
    image: "./images/teclado 1.png",
  },
  {
    id: 6,
    name: "Logitech G Pro Superlight",
    description: "Mouse Wireless 4khz Polling Rate<br><br/>",
    price: 110.0,
    category: "mouse",
    image: "./images/LOGITECH.png",
  },
  {
    id: 7,
    name: "Razer Kraken V3 X",
    description: "Auriculares alambricos 7.1<br><br/>",
    price: 49.99,
    category: "auriculares",
    image: "./images/HEADPHONES RAZER.png",
  },
  {
    id: 8,
    name: "JEMIP WARPEN GAMING 24.5",
    description: "Monitor Full HD de 24 pulgadas ideal para videojuegos",
    price: 149.99,
    category: "monitores",
    image: "./images/MONITOR JEMIP.png",
  },
];

const bestSellers = [
  {
    id: 1,
    name: "Razer Viper V3 PRO",
    description: "Mouse óptico, Wireless 8khz Polling Rate",
    price: 169.99,
    category: "mouse",
    image: "./images/mouse.png",
  },
  {
    id: 2,
    name: "HyperX Cloud Alpha",
    description: "Auriculares con sonido 7.1 y micrófono noise-cancelling",
    price: 120.0,
    category: "auriculares",
    image: "./images/HEADPHONES.png",
  },
  {
    id: 3,
    name: "Zowie XL2586",
    description: "Monitor gaming de 27 pulgadas Fast-TN 600hz Refresh Rate",
    price: 1200.0,
    category: "monitores",
    image: "./images/monitor.png",
  },
  {
    id: 4,
    name: "Logitech G Pro Superlight",
    description: "Mouse Wireless 4khz Polling Rate",
    price: 110.0,
    category: "mouse",
    image: "./images/LOGITECH.png",
  },
  {
    id: 5,
    name: "Razer Kraken V3 X ",
    description: "Auriculares alambricos 7.1",
    price: 49.99,
    category: "auriculares",
    image: "./images/HEADPHONES RAZER.png",
  },
  {
    id: 6,
    name: "JEMIP WARPEN GAMING 24.5 Pulgadas 180hz",
    description: "Monitor Full HD de 24 pulgadas ideal para videojuegos",
    price: 149.99,
    category: "monitores",
    image: "./images/MONITOR JEMIP.png",
  },
];

// Variables globales
let cart = [];
let currentTheme = localStorage.getItem("theme") || "light";
let currentSlide = 0;
let carouselInterval;

// Simulación de Stripe
const StripeSimulator = {
  // Simular inicialización de Stripe
  async initialize() {
    console.log("Stripe inicializado (simulación)");
    return true;
  },

  // Simular creación de sesión de pago
  async createCheckoutSession(cartItems) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const session = {
          id: `cs_sim_${Date.now()}`,
          url: "#checkout-modal",
          amount: cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ),
        };
        resolve(session);
      }, 1000);
    });
  },

  // Simular procesamiento de pago
  async processPayment(paymentMethod, amount) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular éxito del pago (80% de probabilidad)
        const success = Math.random() > 0.2;

        if (success) {
          resolve({
            id: `pi_sim_${Date.now()}`,
            status: "succeeded",
            amount: amount,
            receipt_url: "#receipt",
          });
        } else {
          reject(
            new Error(
              "El pago fue rechazado. Por favor, intenta con otro método de pago."
            )
          );
        }
      }, 2000);
    });
  },
};

// Sistema de Autenticación con localStorage
const AuthSystem = {
  // Obtener usuario actual
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  },

  // Verificar si hay usuario logueado
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  // Registrar nuevo usuario
  register(email, password, name) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Verificar si el usuario ya existe
    if (users.find((user) => user.email === email)) {
      throw new Error("El usuario ya existe");
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // En una app real esto debería estar encriptado
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return newUser;
  },

  // Iniciar sesión
  login(email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Email o contraseña incorrectos");
    }

    // Guardar usuario actual
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem("currentUser");
  },

  // Obtener todos los usuarios (para debugging)
  getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  },
};

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  initializeTheme();
  initializeCarousel();
  renderProducts("all");
  setupEventListeners();
  updateCartCount();
  initializeAuth();

  // Inicializar Stripe simulado
  StripeSimulator.initialize();
});

// Función para inicializar autenticación
function initializeAuth() {
  createAuthButton();
  updateAuthUI();
}

// Función para inicializar el carousel
function initializeCarousel() {
  const carouselContainer = document.getElementById("carouselContainer");
  const carouselDots = document.getElementById("carouselDots");

  bestSellers.forEach((product, index) => {
    const slide = document.createElement("div");
    slide.className = `carousel-slide ${index === 0 ? "active" : ""}`;
    slide.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="carousel-content">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
      </div>
    `;
    carouselContainer.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = `carousel-dot ${index === 0 ? "active" : ""}`;
    dot.addEventListener("click", () => goToSlide(index));
    carouselDots.appendChild(dot);
  });

  startCarousel();
}

// Función para ir a un slide específico
function goToSlide(slideIndex) {
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dot");

  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  slides[slideIndex].classList.add("active");
  dots[slideIndex].classList.add("active");

  currentSlide = slideIndex;
  resetCarousel();
}

// Función para ir al siguiente slide
function nextSlide() {
  const nextSlideIndex = (currentSlide + 1) % bestSellers.length;
  goToSlide(nextSlideIndex);
}

// Función para ir al slide anterior
function prevSlide() {
  const prevSlideIndex =
    (currentSlide - 1 + bestSellers.length) % bestSellers.length;
  goToSlide(prevSlideIndex);
}

// Función para iniciar la rotación automática
function startCarousel() {
  carouselInterval = setInterval(nextSlide, 5000);
}

// Función para reiniciar el carousel
function resetCarousel() {
  clearInterval(carouselInterval);
  startCarousel();
}

// Función para inicializar el tema
function initializeTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon();
}

// Función para cambiar el tema
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  updateThemeIcon();
}

// Función para actualizar el icono del tema
function updateThemeIcon() {
  const themeIcon = document.getElementById("themeIcon");
  if (currentTheme === "light") {
    themeIcon.className = "fas fa-sun";
  } else {
    themeIcon.className = "fas fa-moon";
  }
}

// Función para renderizar productos
function renderProducts(filters = {}) {
  const productsGrid = document.getElementById("productsGrid");

  const filteredProducts = products.filter((product) => {
    if (
      Object.keys(filters).length === 0 ||
      (filters.category && filters.category === "all")
    ) {
      return true;
    }

    for (const [key, value] of Object.entries(filters)) {
      if (key === "categories" && Array.isArray(value) && value.length > 0) {
        if (!value.includes(product.category)) {
          return false;
        }
      }

      if (key === "category" && value !== "all" && product.category !== value) {
        return false;
      }

      if (key === "priceRange") {
        const [min, max] = value.split("-").map(Number);
        if (max && (product.price < min || product.price > max)) {
          return false;
        }
        if (!max && product.price < min) {
          return false;
        }
      }

      if (key === "search" && value.trim() !== "") {
        const searchTerm = value.toLowerCase();
        if (
          !product.name.toLowerCase().includes(searchTerm) &&
          !product.description.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      if (key === "inStock" && value && !product.inStock) {
        return false;
      }
    }

    return true;
  });

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-products">
        <p>No se encontraron productos que coincidan con los filtros seleccionados.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
              Agregar al carrito
            </button>
          </div>
        </div>
      `
    )
    .join("");
}

// Función para agregar productos al carrito
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCartCount();
  showNotification("Producto agregado al carrito");
}

// Función para actualizar el contador del carrito
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Función para mostrar el carrito
function showCart() {
  const cartModal = document.getElementById("cartModal");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p style="text-align: center; color: var(--secondary-color);">El carrito está vacío</p>';
    cartTotal.textContent = "0";
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `
      )
      .join("");

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cartTotal.textContent = total.toFixed(2);
  }

  cartModal.style.display = "block";
}

// Función para eliminar productos del carrito
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartCount();
  showCart();
}

// Función para mostrar el checkout de Stripe
async function showStripeCheckout() {
  if (cart.length === 0) {
    showNotification("El carrito está vacío");
    return;
  }

  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutContent = document.getElementById("checkoutContent");
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Crear interfaz de checkout
  checkoutContent.innerHTML = `
    <div class="checkout-header">
      <h2>Finalizar Compra</h2>
      <button class="close-checkout" onclick="closeCheckout()">&times;</button>
    </div>
    
    <div class="checkout-body">
      <div class="order-summary">
        <h3>Resumen del Pedido</h3>
        ${cart
          .map(
            (item) => `
          <div class="checkout-item">
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `
          )
          .join("")}
        <div class="checkout-total">
          <strong>Total: $${totalAmount.toFixed(2)}</strong>
        </div>
      </div>

      <div class="payment-section">
        <h3>Información de Pago</h3>
        <form id="paymentForm">
          <div class="stripe-card-element">
            <div class="card-input">
              <div class="form-group">
                <label for="cardNumber">Número de Tarjeta</label>
                <input 
                  type="text" 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456" 
                  maxlength="19"
                  class="card-number"
                  oninput="formatCardNumber(this)"
                >
                <div class="validation-message" id="cardNumberError"></div>
              </div>
              
              <div class="card-details">
                <div class="form-group">
                  <label for="cardExpiry">Fecha de Vencimiento (MM/AA)</label>
                  <input 
                    type="text" 
                    id="cardExpiry" 
                    placeholder="MM/AA" 
                    maxlength="5"
                    class="card-expiry"
                    oninput="formatExpiryDate(this)"
                  >
                  <div class="validation-message" id="cardExpiryError"></div>
                </div>
                
                <div class="form-group">
                  <label for="cardCvc">CVC</label>
                  <input 
                    type="text" 
                    id="cardCvc" 
                    placeholder="123" 
                    maxlength="4"
                    class="card-cvc"
                    oninput="validateCvc(this)"
                  >
                  <div class="validation-message" id="cardCvcError"></div>
                </div>
              </div>
            </div>
            <div class="card-logos">
              <span>💳</span>
              <span>🔒</span>
            </div>
          </div>

          <div class="payment-actions">
            <button type="submit" id="payButton" class="pay-button">
              <i class="fas fa-lock"></i>
              Pagar $${totalAmount.toFixed(2)}
            </button>
            <button type="button" class="cancel-button" onclick="closeCheckout()">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Configurar evento del formulario
  document
    .getElementById("paymentForm")
    .addEventListener("submit", handlePaymentSubmit);

  checkoutModal.style.display = "block";

  // Enfocar el primer campo
  setTimeout(() => {
    document.getElementById("cardNumber").focus();
  }, 300);
}

// Función para formatear número de tarjeta
function formatCardNumber(input) {
  let value = input.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  let formattedValue = "";

  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formattedValue += " ";
    }
    formattedValue += value[i];
  }

  input.value = formattedValue;
  validateCardNumber(input);
}

// Función para validar número de tarjeta
function validateCardNumber(input) {
  const value = input.value.replace(/\s+/g, "");
  const errorElement = document.getElementById("cardNumberError");

  // Validar que solo contenga números y tenga longitud válida
  if (!/^\d+$/.test(value)) {
    errorElement.textContent =
      "El número de tarjeta solo puede contener números";
    input.classList.add("error");
    return false;
  }

  // Validar longitud (generalmente 16 dígitos, pero algunas tienen 15)
  if (value.length < 15 || value.length > 16) {
    errorElement.textContent =
      "El número de tarjeta debe tener 15 o 16 dígitos";
    input.classList.add("error");
    return false;
  }

  // Validar con algoritmo de Luhn
  if (!luhnCheck(value)) {
    errorElement.textContent = "El número de tarjeta no es válido";
    input.classList.add("error");
    return false;
  }

  errorElement.textContent = "";
  input.classList.remove("error");
  input.classList.add("valid");
  return true;
}

// Algoritmo de Luhn para validar tarjetas
function luhnCheck(cardNumber) {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Función para formatear fecha de vencimiento
function formatExpiryDate(input) {
  let value = input.value.replace(/\D/g, "");

  if (value.length >= 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4);
  }

  input.value = value;
  validateExpiryDate(input);
}

// Función para validar fecha de vencimiento
function validateExpiryDate(input) {
  const value = input.value;
  const errorElement = document.getElementById("cardExpiryError");

  if (!/^\d{2}\/\d{2}$/.test(value)) {
    errorElement.textContent = "Formato debe ser MM/AA";
    input.classList.add("error");
    return false;
  }

  const [month, year] = value.split("/").map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  // Validar mes
  if (month < 1 || month > 12) {
    errorElement.textContent = "Mes debe estar entre 01 y 12";
    input.classList.add("error");
    return false;
  }

  // Validar que no sea una fecha pasada
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    errorElement.textContent = "La tarjeta ha expirado";
    input.classList.add("error");
    return false;
  }

  // Validar que no sea más de 10 años en el futuro
  if (year > currentYear + 10) {
    errorElement.textContent = "Fecha de vencimiento no válida";
    input.classList.add("error");
    return false;
  }

  errorElement.textContent = "";
  input.classList.remove("error");
  input.classList.add("valid");
  return true;
}

// Función para validar CVC
function validateCvc(input) {
  const value = input.value;
  const errorElement = document.getElementById("cardCvcError");

  // Validar que solo contenga números
  if (!/^\d+$/.test(value)) {
    errorElement.textContent = "El CVC solo puede contener números";
    input.classList.add("error");
    return false;
  }

  // Validar longitud (3 o 4 dígitos)
  if (value.length < 3 || value.length > 4) {
    errorElement.textContent = "El CVC debe tener 3 o 4 dígitos";
    input.classList.add("error");
    return false;
  }

  errorElement.textContent = "";
  input.classList.remove("error");
  input.classList.add("valid");
  return true;
}

// Función para manejar el envío del formulario de pago
async function handlePaymentSubmit(event) {
  event.preventDefault();

  const cardNumber = document.getElementById("cardNumber");
  const cardExpiry = document.getElementById("cardExpiry");
  const cardCvc = document.getElementById("cardCvc");

  // Validar todos los campos
  const isCardNumberValid = validateCardNumber(cardNumber);
  const isExpiryValid = validateExpiryDate(cardExpiry);
  const isCvcValid = validateCvc(cardCvc);

  if (!isCardNumberValid || !isExpiryValid || !isCvcValid) {
    showNotification("Por favor, corrige los errores en el formulario");
    return;
  }

  await processPayment();
}

// Función para procesar el pago
async function processPayment() {
  const payButton = document.getElementById("payButton");
  const originalText = payButton.innerHTML;

  try {
    // Mostrar loading
    payButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Procesando pago...';
    payButton.disabled = true;

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Obtener datos de la tarjeta para simular mejor
    const cardNumber = document
      .getElementById("cardNumber")
      .value.replace(/\s/g, "");
    const cardLast4 = cardNumber.slice(-4);

    // Simular procesamiento de pago
    const paymentResult = await StripeSimulator.processPayment(
      {
        last4: cardLast4,
        brand: getCardBrand(cardNumber),
      },
      totalAmount
    );

    // Pago exitoso
    showNotification("¡Pago exitoso! Tu pedido ha sido procesado.");
    closeCheckout();

    // Limpiar carrito
    cart = [];
    updateCartCount();
    document.getElementById("cartModal").style.display = "none";

    // Mostrar recibo
    setTimeout(() => {
      showReceipt(paymentResult);
    }, 1000);
  } catch (error) {
    showNotification(error.message);
    payButton.innerHTML = originalText;
    payButton.disabled = false;
  }
}

// Función para determinar la marca de la tarjeta
function getCardBrand(cardNumber) {
  const firstDigit = cardNumber[0];
  const firstTwoDigits = cardNumber.substring(0, 2);

  if (firstDigit === "4") return "Visa";
  if (firstTwoDigits >= "51" && firstTwoDigits <= "55") return "MasterCard";
  if (firstTwoDigits === "34" || firstTwoDigits === "37")
    return "American Express";
  if (firstTwoDigits === "36" || firstTwoDigits === "38") return "Diners Club";
  if (firstTwoDigits === "35") return "JCB";
  if (firstTwoDigits === "60" || firstTwoDigits === "65") return "Discover";

  return "Unknown";
}

// Función para cerrar checkout y limpiar validaciones
function closeCheckout() {
  document.getElementById("checkoutModal").style.display = "none";

  // Limpiar mensajes de error
  const errorMessages = document.querySelectorAll(".validation-message");
  errorMessages.forEach((msg) => (msg.textContent = ""));

  const inputs = document.querySelectorAll(
    ".card-number, .card-expiry, .card-cvc"
  );
  inputs.forEach((input) => {
    input.classList.remove("error", "valid");
    input.value = "";
  });
}

// Función para mostrar recibo
function showReceipt(paymentResult) {
  const receiptModal = document.createElement("div");
  receiptModal.className = "modal";
  receiptModal.style.cssText = `
    display: flex;
    position: fixed;
    z-index: 4000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    align-items: center;
    justify-content: center;
  `;

  receiptModal.innerHTML = `
    <div class="modal-content" style="background: black; padding: 2rem; border-radius: 10px; max-width: 500px; width: 90%; border: 1px solid var(--primary-color);">
      <div style="text-align: center; margin-bottom: 2rem;">
        <div style="font-size: 3rem; color: #28a745; margin-bottom: 1rem;">✅</div>
        <h2 style="color: var(--text-color); margin-bottom: 1rem;">¡Pago Completado!</h2>
        <p style="color: var(--secondary-color);">Tu pedido ha sido procesado exitosamente</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>ID de transacción:</span>
          <span style="font-family: monospace;">${paymentResult.id}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>Total pagado:</span>
          <span style="font-weight: bold;">$${paymentResult.amount.toFixed(
            2
          )}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Estado:</span>
          <span style="color: #28a745;">${paymentResult.status}</span>
        </div>
      </div>
      
      <button onclick="this.closest('.modal').remove()" 
              style="width: 100%; padding: 1rem; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">
        Continuar Comprando
      </button>
    </div>
  `;

  document.body.appendChild(receiptModal);
}

// Función para configurar los event listeners
function setupEventListeners() {
  // Botón de tema
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  // Filtros de categoría
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const isAllButton = this.dataset.category === "all";

      if (isAllButton) {
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        renderProducts({ category: "all" });
        return;
      }

      const allButton = document.querySelector(
        '.filter-btn[data-category="all"]'
      );
      if (allButton && allButton.classList.contains("active")) {
        allButton.classList.remove("active");
      }

      this.classList.toggle("active");

      const activeButtons = document.querySelectorAll(
        '.filter-btn.active:not([data-category="all"])'
      );

      if (activeButtons.length === 0) {
        allButton.classList.add("active");
        renderProducts({ category: "all" });
        return;
      }

      const selectedCategories = Array.from(activeButtons).map(
        (btn) => btn.dataset.category
      );
      renderProducts({ categories: selectedCategories });
    });
  });

  // Carrito
  document.querySelector(".cart").addEventListener("click", showCart);
  document.getElementById("closeCart").addEventListener("click", function () {
    document.getElementById("cartModal").style.display = "none";
  });

  // Cerrar carrito al hacer clic fuera
  document.getElementById("cartModal").addEventListener("click", function (e) {
    if (e.target === this) {
      this.style.display = "none";
    }
  });

  // Botón de checkout - CORREGIDO
  document
    .querySelector(".checkout-btn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Cerrar el modal del carrito primero
      document.getElementById("cartModal").style.display = "none";

      // Verificar autenticación y mostrar checkout
      if (!requireAuth()) return;
      showStripeCheckout();
    });

  // Cerrar checkout modal
  document
    .getElementById("checkoutModal")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        closeCheckout();
      }
    });

  // Botones del carousel
  document.getElementById("prevBtn").addEventListener("click", prevSlide);
  document.getElementById("nextBtn").addEventListener("click", nextSlide);

  // Pausar carousel al pasar el mouse
  document
    .querySelector(".hero-carousel")
    .addEventListener("mouseenter", () => {
      clearInterval(carouselInterval);
    });

  // Reanudar carousel al quitar el mouse
  document
    .querySelector(".hero-carousel")
    .addEventListener("mouseleave", () => {
      startCarousel();
    });
}

// Función para mostrar notificaciones
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: var(--primary-color);
      color: white;
      padding: 1rem 2rem;
      border-radius: 5px;
      z-index: 3000;
      animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Seleccionar el header
const header = document.querySelector(".header");
let lastScrollY = window.scrollY;

// Función para manejar el scroll
function handleScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 100) {
    header.classList.add("transparent");
  } else {
    header.classList.remove("transparent");
  }

  lastScrollY = currentScrollY;
}

// Escuchar el evento de scroll
window.addEventListener("scroll", handleScroll);

// También aplicar el estilo al cargar si ya está scrolleado
window.addEventListener("load", () => {
  if (window.scrollY > 100) {
    header.classList.add("transparent");
  }
});

// Funciones de autenticación
function showAuthModal(mode = "login") {
  const authModal = document.getElementById("authModal") || createAuthModal();
  const authContent = document.getElementById("authContent");

  authContent.innerHTML = `
        <div class="auth-header">
            <h2>${mode === "login" ? "Iniciar Sesión" : "Registrarse"}</h2>
            <button class="close-auth" onclick="closeAuthModal()">&times;</button>
        </div>
        
        <div class="auth-body">
            <form id="authForm" class="auth-form">
                ${
                  mode === "register"
                    ? `
                <div class="form-group">
                    <label for="authName">Nombre completo</label>
                    <input type="text" id="authName" required>
                    <div class="validation-message" id="authNameError"></div>
                </div>
                `
                    : ""
                }
                
                <div class="form-group">
                    <label for="authEmail">Email</label>
                    <input type="email" id="authEmail" required>
                    <div class="validation-message" id="authEmailError"></div>
                </div>
                
                <div class="form-group">
                    <label for="authPassword">Contraseña</label>
                    <input type="password" id="authPassword" required minlength="6">
                    <div class="validation-message" id="authPasswordError"></div>
                </div>

                <div class="auth-actions">
                    <button type="submit" class="auth-submit-btn">
                        ${mode === "login" ? "Iniciar Sesión" : "Registrarse"}
                    </button>
                    <button type="button" class="auth-switch-btn" onclick="switchAuthMode('${
                      mode === "login" ? "register" : "login"
                    }')">
                        ${
                          mode === "login"
                            ? "¿No tienes cuenta? Regístrate"
                            : "¿Ya tienes cuenta? Inicia Sesión"
                        }
                    </button>
                </div>
            </form>
        </div>
    `;

  // Configurar evento del formulario
  document.getElementById("authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    handleAuthSubmit(mode);
  });

  authModal.style.display = "block";

  // Enfocar el primer campo
  setTimeout(() => {
    const firstInput = document.getElementById(
      mode === "register" ? "authName" : "authEmail"
    );
    firstInput.focus();
  }, 300);
}

// Función para crear el modal de auth si no existe
function createAuthModal() {
  const authModal = document.createElement("div");
  authModal.id = "authModal";
  authModal.className = "auth-modal";
  authModal.innerHTML = `
        <div class="auth-content">
            <div id="authContent"></div>
        </div>
    `;
  document.body.appendChild(authModal);
  return authModal;
}

// Función para manejar el envío del formulario de auth
async function handleAuthSubmit(mode) {
  const submitBtn = document.querySelector(".auth-submit-btn");
  const originalText = submitBtn.innerHTML;

  try {
    // Mostrar loading
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;

    const email = document.getElementById("authEmail").value;
    const password = document.getElementById("authPassword").value;

    let user;

    if (mode === "register") {
      const name = document.getElementById("authName").value;
      user = AuthSystem.register(email, password, name);
      showNotification("¡Registro exitoso! Bienvenido/a " + name);
    } else {
      user = AuthSystem.login(email, password);
      showNotification("¡Bienvenido de nuevo, " + user.name + "!");
    }

    closeAuthModal();
    updateAuthUI();
  } catch (error) {
    showNotification(error.message);
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// Función para cambiar entre login y registro
function switchAuthMode(newMode) {
  showAuthModal(newMode);
}

// Función para cerrar modal de auth
function closeAuthModal() {
  const authModal = document.getElementById("authModal");
  if (authModal) {
    authModal.style.display = "none";
  }

  // Limpiar formulario
  const form = document.getElementById("authForm");
  if (form) form.reset();
}

// Función para actualizar la UI según el estado de autenticación
function updateAuthUI() {
  const user = AuthSystem.getCurrentUser();
  const authButton = document.getElementById("authButton");

  if (!authButton) {
    createAuthButton();
    return;
  }

  if (user) {
    authButton.innerHTML = `
            <i class="fas fa-user"></i>
            ${user.name}
            <div class="auth-dropdown">
                <button onclick="handleLogout()">Cerrar Sesión</button>
            </div>
        `;
    authButton.classList.add("logged-in");
  } else {
    authButton.innerHTML = '<i class="fas fa-user"></i> Iniciar Sesión';
    authButton.classList.remove("logged-in");
  }
}

// Función para crear el botón de auth en el header
function createAuthButton() {
  const headerActions = document.querySelector(".header-actions");
  if (!headerActions) return;

  const authButton = document.createElement("div");
  authButton.id = "authButton";
  authButton.className = "auth-button";
  authButton.innerHTML = '<i class="fas fa-user"></i> Iniciar Sesión';
  authButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!AuthSystem.isLoggedIn()) {
      showAuthModal();
    }
  });

  // Insertar antes del carrito
  const cart = headerActions.querySelector(".cart");
  if (cart) {
    headerActions.insertBefore(authButton, cart);
  } else {
    headerActions.appendChild(authButton);
  }

  updateAuthUI();
}

// Función para manejar logout
function handleLogout() {
  AuthSystem.logout();
  showNotification("Sesión cerrada correctamente");
  updateAuthUI();
}

// Verificar autenticación requerida para checkout
function requireAuth() {
  if (!AuthSystem.isLoggedIn()) {
    showNotification("Por favor, inicia sesión para continuar con la compra");
    showAuthModal();
    return false;
  }
  return true;
}

// Agregar estilos CSS
const authStyles = document.createElement("style");
authStyles.textContent = `
    .auth-modal {
        display: none;
        position: fixed;
        z-index: 3500;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
    }

    .auth-content {
        background: var(--card-bg);
        margin: 5% auto;
        padding: 0;
        border-radius: 15px;
        width: 90%;
        max-width: 400px;
        border: 1px solid var(--border-color);
        backdrop-filter: blur(20px);
    }

    .auth-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid var(--border-color);
    }

    .auth-header h2 {
        margin: 0;
        color: var(--text-color);
    }

    .close-auth {
        background: none;
        border: none;
        font-size: 2rem;
        color: var(--secondary-color);
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .auth-body {
        padding: 2rem;
    }

    .auth-form .form-group {
        margin-bottom: 1.5rem;
        text-align: left;
    }

    .auth-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-color);
        font-size: 0.9rem;
    }

    .auth-form input {
        width: 100%;
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--border-color);
        border-radius: 5px;
        color: var(--text-color);
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .auth-form input:focus {
        border-color: var(--primary-color);
        outline: none;
        box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
    }

    .auth-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;
    }

    .auth-submit-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.1rem;
        transition: all 0.3s ease;
    }

    .auth-submit-btn:hover:not(:disabled) {
        background: var(--primary-color-dark);
        transform: translateY(-2px);
    }

    .auth-submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .auth-switch-btn {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        border: 1px solid var(--border-color);
        padding: 0.8rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }

    .auth-switch-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .auth-button {
        position: relative;
        cursor: pointer;
        font-size: 1rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 25px;
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }

    .auth-button:hover {
        background: rgba(var(--primary-color-rgb), 0.2);
        border: 1px solid rgba(var(--primary-color-rgb), 0.4);
        transform: translateY(-2px);
    }

    .auth-button.logged-in {
        background: rgba(var(--primary-color-rgb), 0.25);
        border: 1px solid rgba(var(--primary-color-rgb), 0.4);
    }

    .auth-dropdown {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 0.5rem;
        margin-top: 0.5rem;
        min-width: 150px;
        backdrop-filter: blur(15px);
    }

    .auth-button:hover .auth-dropdown {
        display: block;
    }

    .auth-dropdown button {
        width: 100%;
        background: none;
        border: none;
        color: var(--text-color);
        padding: 0.5rem 1rem;
        text-align: left;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.3s ease;
    }

    .auth-dropdown button:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .validation-message {
        font-size: 0.8rem;
        margin-top: 0.25rem;
        min-height: 1rem;
        color: #dc3545;
        font-weight: 500;
    }

    .checkout-modal {
        display: none;
        position: fixed;
        z-index: 3500;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
    }

    .checkout-content {
        background: var(--card-bg);
        margin: 2% auto;
        padding: 0;
        border-radius: 15px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        border: 1px solid var(--border-color);
    }

    .checkout-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid var(--border-color);
    }

    .checkout-header h2 {
        margin: 0;
        color: var(--text-color);
    }

    .close-checkout {
        background: none;
        border: none;
        font-size: 2rem;
        color: var(--secondary-color);
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .checkout-body {
        padding: 2rem;
    }

    .order-summary {
        background: rgba(255,255,255,0.05);
        padding: 1.5rem;
        border-radius: 10px;
        margin-bottom: 2rem;
    }

    .checkout-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .checkout-total {
        display: flex;
        justify-content: space-between;
        padding-top: 1rem;
        margin-top: 1rem;
        border-top: 2px solid var(--primary-color);
        font-size: 1.2rem;
    }

    .payment-section h3 {
        margin-bottom: 1rem;
        color: var(--text-color);
    }

    .stripe-card-element {
        background: rgba(255,255,255,0.1);
        padding: 1.5rem;
        border-radius: 10px;
        border: 1px solid var(--border-color);
        margin-bottom: 1.5rem;
    }

    .card-input input {
        width: 100%;
        padding: 0.75rem;
        margin-bottom: 1rem;
        background: rgba(255,255,255,0.1);
        border: 1px solid var(--border-color);
        border-radius: 5px;
        color: var(--text-color);
        font-size: 1rem;
    }

    .card-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .card-logos {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
        font-size: 1.5rem;
    }

    .payment-actions {
        display: flex;
        gap: 1rem;
    }

    .pay-button {
        flex: 2;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.1rem;
        transition: all 0.3s ease;
    }

    .pay-button:hover:not(:disabled) {
        background: var(--primary-color-dark);
        transform: translateY(-2px);
    }

    .pay-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .cancel-button {
        flex: 1;
        background: rgba(255,255,255,0.1);
        color: var(--text-color);
        border: 1px solid var(--border-color);
        padding: 1rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.1rem;
        transition: all 0.3s ease;
    }

    .cancel-button:hover {
        background: rgba(255,255,255,0.2);
    }

    .form-group {
        margin-bottom: 1.5rem;
        text-align: left;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-color);
        font-size: 0.9rem;
    }

    .card-input input {
        width: 100%;
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--border-color);
        border-radius: 5px;
        color: var(--text-color);
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .card-input input:focus {
        border-color: var(--primary-color);
        outline: none;
        box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
    }

    .card-input input.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
    }

    .card-input input.valid {
        border-color: #28a745;
        box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
    }

    .validation-message {
        font-size: 0.8rem;
        margin-top: 0.25rem;
        min-height: 1rem;
    }

    .validation-message:not(:empty) {
        color: #dc3545;
        font-weight: 500;
    }
`;
document.head.appendChild(authStyles);

// Agregar modal de checkout al HTML si no existe
if (!document.getElementById("checkoutModal")) {
  const checkoutModal = document.createElement("div");
  checkoutModal.id = "checkoutModal";
  checkoutModal.className = "checkout-modal";
  checkoutModal.innerHTML = `
    <div class="checkout-content">
      <div id="checkoutContent"></div>
    </div>
  `;
  document.body.appendChild(checkoutModal);
}

// Sistema de Historial de Compras
const PurchaseHistory = {
  // Obtener historial de compras del usuario actual
  getPurchaseHistory() {
    const user = AuthSystem.getCurrentUser();
    if (!user) return [];

    const userPurchases =
      JSON.parse(localStorage.getItem("userPurchases")) || {};
    return userPurchases[user.id] || [];
  },

  // Agregar una compra al historial del usuario
  addPurchase(purchaseData) {
    const user = AuthSystem.getCurrentUser();
    if (!user) return null;

    const userPurchases =
      JSON.parse(localStorage.getItem("userPurchases")) || {};

    const purchase = {
      id: `purchase_${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString(),
      items: purchaseData.items,
      total: purchaseData.total,
      paymentMethod: purchaseData.paymentMethod,
      status: "completed",
      shippingAddress: purchaseData.shippingAddress || {},
    };

    if (!userPurchases[user.id]) {
      userPurchases[user.id] = [];
    }

    userPurchases[user.id].unshift(purchase); // Agregar al inicio del array
    localStorage.setItem("userPurchases", JSON.stringify(userPurchases));

    return purchase;
  },

  // Obtener una compra específica por ID
  getPurchaseById(purchaseId) {
    const user = AuthSystem.getCurrentUser();
    if (!user) return null;

    const userPurchases =
      JSON.parse(localStorage.getItem("userPurchases")) || {};
    const purchases = userPurchases[user.id] || [];

    return purchases.find((purchase) => purchase.id === purchaseId);
  },

  // Obtener estadísticas del usuario
  getUserStats() {
    const purchases = this.getPurchaseHistory();

    return {
      totalPurchases: purchases.length,
      totalSpent: purchases.reduce((sum, purchase) => sum + purchase.total, 0),
      lastPurchase: purchases.length > 0 ? purchases[0].date : null,
      favoriteCategory: this.getFavoriteCategory(purchases),
    };
  },

  // Obtener categoría favorita del usuario
  getFavoriteCategory(purchases) {
    if (purchases.length === 0) return "Ninguna";

    const categoryCount = {};
    purchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        categoryCount[item.category] =
          (categoryCount[item.category] || 0) + item.quantity;
      });
    });

    const favorite = Object.entries(categoryCount).reduce(
      (max, [category, count]) => {
        return count > max.count ? { category, count } : max;
      },
      { category: "", count: 0 }
    );

    return favorite.category || "Ninguna";
  },
};

// Modificar la función processPayment para guardar el historial
async function processPayment() {
  const payButton = document.getElementById("payButton");
  const originalText = payButton.innerHTML;

  try {
    // Mostrar loading
    payButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Procesando pago...';
    payButton.disabled = true;

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Obtener datos de la tarjeta para simular mejor
    const cardNumber = document
      .getElementById("cardNumber")
      .value.replace(/\s/g, "");
    const cardLast4 = cardNumber.slice(-4);

    // Simular procesamiento de pago
    const paymentResult = await StripeSimulator.processPayment(
      {
        last4: cardLast4,
        brand: getCardBrand(cardNumber),
      },
      totalAmount
    );

    // Guardar en el historial de compras
    const purchaseData = {
      items: [...cart], // Copia del carrito
      total: totalAmount,
      paymentMethod: {
        brand: getCardBrand(cardNumber),
        last4: cardLast4,
      },
      shippingAddress: {
        // En una aplicación real, estos datos vendrían de un formulario
        name: AuthSystem.getCurrentUser().name,
        email: AuthSystem.getCurrentUser().email,
      },
    };

    const purchase = PurchaseHistory.addPurchase(purchaseData);

    // Pago exitoso
    showNotification("¡Pago exitoso! Tu pedido ha sido procesado.");
    closeCheckout();

    // Limpiar carrito
    cart = [];
    updateCartCount();
    document.getElementById("cartModal").style.display = "none";

    // Mostrar recibo
    setTimeout(() => {
      showReceipt(paymentResult, purchase);
    }, 1000);
  } catch (error) {
    showNotification(error.message);
    payButton.innerHTML = originalText;
    payButton.disabled = false;
  }
}

// Modificar showReceipt para incluir información de la compra
function showReceipt(paymentResult, purchase) {
  const receiptModal = document.createElement("div");
  receiptModal.className = "modal";
  receiptModal.style.cssText = `
    display: flex;
    position: fixed;
    z-index: 4000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    align-items: center;
    justify-content: center;
  `;

  receiptModal.innerHTML = `
    <div class="modal-content" style="background: var(--card-bg); padding: 2rem; border-radius: 10px; max-width: 500px; width: 90%; border: 1px solid var(--border-color);">
      <div style="text-align: center; margin-bottom: 2rem;">
        <div style="font-size: 3rem; color: #28a745; margin-bottom: 1rem;">✅</div>
        <h2 style="color: var(--text-color); margin-bottom: 1rem;">¡Pago Completado!</h2>
        <p style="color: var(--secondary-color);">Tu pedido ha sido procesado exitosamente</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>ID de transacción:</span>
          <span style="font-family: monospace;">${paymentResult.id}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>ID de compra:</span>
          <span style="font-family: monospace;">${purchase.id}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>Total pagado:</span>
          <span style="font-weight: bold;">$${paymentResult.amount.toFixed(
            2
          )}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Estado:</span>
          <span style="color: #28a745;">${paymentResult.status}</span>
        </div>
      </div>
      
      <div style="display: flex; gap: 1rem;">
        <button onclick="this.closest('.modal').remove()" 
                style="flex: 1; padding: 1rem; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">
          Continuar Comprando
        </button>
        <button onclick="showPurchaseHistory(); this.closest('.modal').remove()" 
                style="flex: 1; padding: 1rem; background: rgba(255,255,255,0.1); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; cursor: pointer; font-size: 1rem;">
          Ver Historial
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(receiptModal);
}

// Función para mostrar el perfil e historial de compras
function showUserProfile() {
  const user = AuthSystem.getCurrentUser();
  if (!user) return;

  const profileModal =
    document.getElementById("profileModal") || createProfileModal();
  const profileContent = document.getElementById("profileContent");

  const purchaseHistory = PurchaseHistory.getPurchaseHistory();
  const userStats = PurchaseHistory.getUserStats();

  profileContent.innerHTML = `
    <div class="profile-header">
      <h2>Mi Perfil</h2>
      <button class="close-profile" onclick="closeProfileModal()">&times;</button>
    </div>
    
    <div class="profile-body">
      <div class="user-info-section">
        <div class="user-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="user-details">
          <h3>${user.name}</h3>
          <p>${user.email}</p>
          <p class="member-since">Miembro desde: ${new Date(
            user.createdAt
          ).toLocaleDateString()}</p>
        </div>
      </div>

      <div class="stats-section">
        <h3>Estadísticas de Compras</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🛒</div>
            <div class="stat-info">
              <div class="stat-number">${userStats.totalPurchases}</div>
              <div class="stat-label">Compras Totales</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <div class="stat-number">$${userStats.totalSpent.toFixed(2)}</div>
              <div class="stat-label">Total Gastado</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-info">
              <div class="stat-number">${userStats.favoriteCategory}</div>
              <div class="stat-label">Categoría Favorita</div>
            </div>
          </div>
        </div>
      </div>

      <div class="purchase-history-section">
        <div class="section-header">
          <h3>Historial de Compras</h3>
          <span class="purchase-count">${purchaseHistory.length} compras</span>
        </div>
        
        ${
          purchaseHistory.length === 0
            ? `
          <div class="no-purchases">
            <i class="fas fa-shopping-bag"></i>
            <p>Aún no has realizado ninguna compra</p>
            <button class="start-shopping-btn" onclick="closeProfileModal()">Comenzar a Comprar</button>
          </div>
        `
            : `
          <div class="purchases-list">
            ${purchaseHistory
              .map(
                (purchase) => `
              <div class="purchase-item" onclick="showPurchaseDetails('${
                purchase.id
              }')">
                <div class="purchase-header">
                  <div class="purchase-id">Orden #${purchase.id.slice(-8)}</div>
                  <div class="purchase-date">${new Date(
                    purchase.date
                  ).toLocaleDateString()}</div>
                </div>
                <div class="purchase-details">
                  <div class="purchase-items">
                    ${purchase.items
                      .slice(0, 2)
                      .map(
                        (item) => `
                      <span class="item-name">${item.name} x${item.quantity}</span>
                    `
                      )
                      .join("")}
                    ${
                      purchase.items.length > 2
                        ? `<span class="more-items">+${
                            purchase.items.length - 2
                          } más</span>`
                        : ""
                    }
                  </div>
                  <div class="purchase-total">$${purchase.total.toFixed(
                    2
                  )}</div>
                </div>
                <div class="purchase-status ${purchase.status}">
                  <i class="fas fa-check-circle"></i>
                  ${purchase.status}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        `
        }
      </div>
    </div>
  `;

  profileModal.style.display = "block";
}

// Función para mostrar detalles específicos de una compra
function showPurchaseDetails(purchaseId) {
  const purchase = PurchaseHistory.getPurchaseById(purchaseId);
  if (!purchase) return;

  const detailsModal = document.createElement("div");
  detailsModal.className = "modal";
  detailsModal.style.cssText = `
    display: flex;
    position: fixed;
    z-index: 4000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    align-items: center;
    justify-content: center;
  `;

  detailsModal.innerHTML = `
    <div class="modal-content" style="background: var(--card-bg); padding: 2rem; border-radius: 10px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; border: 1px solid var(--border-color);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="color: var(--text-color); margin: 0;">Detalles de la Compra</h2>
        <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; color: var(--secondary-color); cursor: pointer;">&times;</button>
      </div>
      
      <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <strong>ID de Compra:</strong>
            <div style="font-family: monospace; font-size: 0.9rem;">${
              purchase.id
            }</div>
          </div>
          <div>
            <strong>Fecha:</strong>
            <div>${new Date(purchase.date).toLocaleString()}</div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <strong>Estado:</strong>
            <div style="color: #28a745;"><i class="fas fa-check-circle"></i> ${
              purchase.status
            }</div>
          </div>
          <div>
            <strong>Método de Pago:</strong>
            <div>${purchase.paymentMethod.brand} •••• ${
    purchase.paymentMethod.last4
  }</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: var(--text-color); margin-bottom: 1rem;">Productos Comprados</h3>
        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden;">
          ${purchase.items
            .map(
              (item) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <img src="${item.image}" alt="${
                item.name
              }" style="width: 50px; height: 50px; object-fit: contain; border-radius: 5px;">
                <div>
                  <div style="font-weight: bold;">${item.name}</div>
                  <div style="font-size: 0.9rem; color: var(--secondary-color);">Cantidad: ${
                    item.quantity
                  }</div>
                </div>
              </div>
              <div style="font-weight: bold;">$${(
                item.price * item.quantity
              ).toFixed(2)}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 2px solid var(--primary-color);">
        <strong style="font-size: 1.2rem;">Total:</strong>
        <strong style="font-size: 1.2rem;">$${purchase.total.toFixed(
          2
        )}</strong>
      </div>

      <button onclick="this.closest('.modal').remove()" 
              style="width: 100%; padding: 1rem; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; margin-top: 1.5rem;">
        Cerrar
      </button>
    </div>
  `;

  document.body.appendChild(detailsModal);
}

// Función para crear el modal de perfil
function createProfileModal() {
  const profileModal = document.createElement("div");
  profileModal.id = "profileModal";
  profileModal.className = "profile-modal";
  profileModal.innerHTML = `
    <div class="profile-content">
      <div id="profileContent"></div>
    </div>
  `;
  document.body.appendChild(profileModal);
  return profileModal;
}

// Función para cerrar el modal de perfil
function closeProfileModal() {
  const profileModal = document.getElementById("profileModal");
  if (profileModal) {
    profileModal.style.display = "none";
  }
}

// Modificar updateAuthUI para incluir el botón de perfil
function updateAuthUI() {
  const user = AuthSystem.getCurrentUser();
  const authButton = document.getElementById("authButton");

  if (!authButton) {
    createAuthButton();
    return;
  }

  if (user) {
    authButton.innerHTML = `
      <i class="fas fa-user"></i>
      ${user.name}
      <div class="auth-dropdown">
        <button onclick="showUserProfile()"><i class="fas fa-user-circle"></i> Mi Perfil</button>
        <button onclick="showPurchaseHistory()"><i class="fas fa-history"></i> Historial</button>
        <button onclick="handleLogout()"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</button>
      </div>
    `;
    authButton.classList.add("logged-in");
  } else {
    authButton.innerHTML = '<i class="fas fa-user"></i> Iniciar Sesión';
    authButton.classList.remove("logged-in");
  }
}

// Función para mostrar solo el historial de compras
function showPurchaseHistory() {
  closeProfileModal(); // Cerrar perfil si está abierto
  showUserProfile(); // Abrir perfil que incluye el historial
}

// Agregar estilos CSS para el perfil e historial
const profileStyles = document.createElement("style");
profileStyles.textContent = `
  .profile-modal {
    display: none;
    position: fixed;
    z-index: 3500;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    backdrop-filter: blur(5px);
  }

  .profile-content {
    background: var(--card-bg);
    margin: 2% auto;
    padding: 0;
    border-radius: 15px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    backdrop-filter: blur(20px);
  }

  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border-color);
  }

  .profile-header h2 {
    margin: 0;
    color: var(--text-color);
  }

  .close-profile {
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--secondary-color);
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-body {
    padding: 2rem;
  }

  .user-info-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
  }

  .user-avatar {
    font-size: 4rem;
    color: var(--primary-color);
  }

  .user-details h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-color);
    font-size: 1.5rem;
  }

  .user-details p {
    margin: 0.25rem 0;
    color: var(--secondary-color);
  }

  .member-since {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .stats-section {
    margin-bottom: 2rem;
  }

  .stats-section h3 {
    margin-bottom: 1rem;
    color: var(--text-color);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    font-size: 2rem;
    opacity: 0.8;
  }

  .stat-number {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-color);
  }

  .stat-label {
    font-size: 0.9rem;
    color: var(--secondary-color);
  }

  .purchase-history-section {
    margin-top: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .section-header h3 {
    margin: 0;
    color: var(--text-color);
  }

  .purchase-count {
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .no-purchases {
    text-align: center;
    padding: 3rem;
    color: var(--secondary-color);
  }

  .no-purchases i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .start-shopping-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1rem;
  }

  .purchases-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .purchase-item {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .purchase-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    border-color: var(--primary-color);
  }

  .purchase-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .purchase-id {
    font-weight: bold;
    color: var(--text-color);
  }

  .purchase-date {
    color: var(--secondary-color);
    font-size: 0.9rem;
  }

  .purchase-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .purchase-items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .item-name {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 15px;
    font-size: 0.8rem;
  }

  .more-items {
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 15px;
    font-size: 0.8rem;
  }

  .purchase-total {
    font-weight: bold;
    color: var(--text-color);
    font-size: 1.1rem;
  }

  .purchase-status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .purchase-status.completed {
    background: rgba(40, 167, 69, 0.2);
    color: #28a745;
    border: 1px solid rgba(40, 167, 69, 0.3);
  }

  .auth-dropdown button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    background: none;
    border: none;
    color: var(--text-color);
    padding: 0.5rem 1rem;
    text-align: left;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  .auth-dropdown button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    .profile-content {
      margin: 5% auto;
      width: 95%;
    }

    .user-info-section {
      flex-direction: column;
      text-align: center;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .purchase-details {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .purchase-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
`;
document.head.appendChild(profileStyles);
