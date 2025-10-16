// Datos de productos
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
    description: "Mouse óptico, Wireless 8khz Polling Rate <br><br/>",
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
    description: "Mouse Wireless 4khz Polling Rate",
    price: 110.0,
    category: "mouse",
    image: "./images/LOGITECH.png",
  },
  {
    id: 7,
    name: "Razer Kraken V3 X",
    description: "Auriculares alambricos 7.1",
    price: 49.99,
    category: "auriculares",
    image: "./images/HEADPHONES RAZER.png",
  },
  {
    id: 8,
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

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  initializeTheme();
  renderProducts("all");
  setupEventListeners();
  updateCartCount();
});

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

  // Aplicar todos los filtros
  const filteredProducts = products.filter((product) => {
    // Si no hay filtros o si el filtro es "all", mostrar todos los productos
    if (
      Object.keys(filters).length === 0 ||
      (filters.category && filters.category === "all")
    ) {
      return true;
    }

    // Verificar cada filtro
    for (const [key, value] of Object.entries(filters)) {
      // Si el filtro es "categories" (array de categorías seleccionadas)
      if (key === "categories" && Array.isArray(value) && value.length > 0) {
        if (!value.includes(product.category)) {
          return false;
        }
      }

      // Si el filtro es "category" individual
      if (key === "category" && value !== "all" && product.category !== value) {
        return false;
      }

      // Si el filtro es "priceRange"
      if (key === "priceRange") {
        const [min, max] = value.split("-").map(Number);
        if (max && (product.price < min || product.price > max)) {
          return false;
        }
        if (!max && product.price < min) {
          return false;
        }
      }

      // Si el filtro es "search"
      if (key === "search" && value.trim() !== "") {
        const searchTerm = value.toLowerCase();
        if (
          !product.name.toLowerCase().includes(searchTerm) &&
          !product.description.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      // Si el filtro es "inStock"
      if (key === "inStock" && value && !product.inStock) {
        return false;
      }
    }

    return true;
  });

  // Mostrar mensaje si no hay productos
  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-products">
        <p>No se encontraron productos que coincidan con los filtros seleccionados.</p>
      </div>
    `;
    return;
  }

  // Renderizar productos
  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="product-image">
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

// Funcion para quitar todos los filtros
function clearAllFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  const allButton = document.querySelector('.filter-btn[data-category="all"]');
  if (allButton) {
    allButton.classList.add("active");
  }
  renderProducts({ category: "all" });
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
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
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

// Función para configurar los event listeners
function setupEventListeners() {
  // Botón de tema
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  // Filtros de categoría
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const isAllButton = this.dataset.category === "all";

      // Si se hace click en "todos", desactivar otros filtros y activar solo "todos"
      if (isAllButton) {
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        renderProducts({ category: "all" });
        return;
      }

      // Si se hace click en otro filtro, desactivar "todos" si estaba activo
      const allButton = document.querySelector(
        '.filter-btn[data-category="all"]'
      );
      if (allButton && allButton.classList.contains("active")) {
        allButton.classList.remove("active");
      }

      // Toggle la clase active en el botón clickeado
      this.classList.toggle("active");

      // Obtener todos los botones activos (excluyendo "todos")
      const activeButtons = document.querySelectorAll(
        '.filter-btn.active:not([data-category="all"])'
      );

      // Si no hay botones activos después de toggle, activar "todos" por defecto
      if (activeButtons.length === 0) {
        allButton.classList.add("active");
        renderProducts({ category: "all" });
        return;
      }

      // Recopilar todas las categorías seleccionadas
      const selectedCategories = Array.from(activeButtons).map(
        (btn) => btn.dataset.category
      );

      // Llamar a renderProducts con el array de categorías
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

  // Botón de checkout
  document
    .querySelector(".checkout-btn")
    .addEventListener("click", function () {
      if (cart.length > 0) {
        alert(
          "Gracias por tu compra! Total: $" +
            cart
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toFixed(2)
        );
        cart = [];
        updateCartCount();
        document.getElementById("cartModal").style.display = "none";
      }
    });

  // CTA Button
  document.querySelector(".cta-button").addEventListener("click", function () {
    document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
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

// Agregar animación CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Seleccionar el header
const header = document.querySelector(".header");

// Variable para guardar la posición anterior del scroll
let lastScrollY = window.scrollY;

// Función para manejar el scroll
function handleScroll() {
  const currentScrollY = window.scrollY;

  // Si el scroll es mayor a 100px, hacer el header transparente
  if (currentScrollY > 100) {
    header.classList.add("transparent");
  } else {
    header.classList.remove("transparent");
  }

  // Actualizar la última posición del scroll
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
