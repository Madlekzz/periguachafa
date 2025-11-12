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

  // Simular elementos de Stripe para tarjeta
  createCardElement() {
    const element = document.createElement("div");
    element.innerHTML = `
      <div class="stripe-card-element">
        <div class="card-input">
          <input type="text" placeholder="Número de tarjeta" maxlength="16" class="card-number">
          <div class="card-details">
            <input type="text" placeholder="MM/AA" maxlength="5" class="card-expiry">
            <input type="text" placeholder="CVC" maxlength="3" class="card-cvc">
          </div>
        </div>
        <div class="card-logos">
          <span>💳</span>
          <span>🔒</span>
        </div>
      </div>
    `;
    return element;
  },
};

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  initializeTheme();
  initializeCarousel();
  renderProducts("all");
  setupEventListeners();
  updateCartCount();

  // Inicializar Stripe simulado
  StripeSimulator.initialize();
});

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
        <div id="cardElement"></div>
        <div class="payment-actions">
          <button id="payButton" class="pay-button">
            <i class="fas fa-lock"></i>
            Pagar $${totalAmount.toFixed(2)}
          </button>
          <button class="cancel-button" onclick="closeCheckout()">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `;

  // Inicializar elemento de tarjeta simulado
  const cardElement = document.getElementById("cardElement");
  cardElement.appendChild(StripeSimulator.createCardElement());

  // Configurar evento de pago
  document
    .getElementById("payButton")
    .addEventListener("click", processPayment);

  checkoutModal.style.display = "block";
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

    // Simular procesamiento de pago
    const paymentResult = await StripeSimulator.processPayment({}, totalAmount);

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
    <div class="modal-content" style="background: var(--card-bg); padding: 2rem; border-radius: 10px; max-width: 500px; width: 90%;">
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

// Función para cerrar checkout
function closeCheckout() {
  document.getElementById("checkoutModal").style.display = "none";
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

  // Botón de checkout (modificado para usar Stripe)
  document
    .querySelector(".checkout-btn")
    .addEventListener("click", showStripeCheckout);

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

// Agregar estilos CSS para el checkout
const checkoutStyles = document.createElement("style");
checkoutStyles.textContent = `
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
`;
document.head.appendChild(checkoutStyles);

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
