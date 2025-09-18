// Datos de productos
const products = [
    {
        id: 1,
        name: "Teclado Mecánico RGB",
        description: "Teclado mecánico con switches azules y retroiluminación RGB",
        price: 89.99,
        category: "teclados",
        icon: "⌨️"
    },
    {
        id: 2,
        name: "Mouse Gaming Pro",
        description: "Mouse óptico con 12000 DPI y 7 botones programables",
        price: 45.99,
        category: "mouse",
        icon: "🖱️"
    },
    {
        id: 3,
        name: "Auriculares Gaming",
        description: "Auriculares con sonido 7.1 y micrófono noise-cancelling",
        price: 79.99,
        category: "auriculares",
        icon: "🎧"
    },
    {
        id: 4,
        name: "Monitor 27\" 144Hz",
        description: "Monitor gaming de 27 pulgadas con 144Hz y 1ms de respuesta",
        price: 299.99,
        category: "monitores",
        icon: "🖥️"
    },
    {
        id: 5,
        name: "Teclado Inalámbrico",
        description: "Teclado compacto inalámbrico con batería de larga duración",
        price: 39.99,
        category: "teclados",
        icon: "⌨️"
    },
    {
        id: 6,
        name: "Mouse Inalámbrico",
        description: "Mouse ergonómico inalámbrico con diseño ambidiestro",
        price: 29.99,
        category: "mouse",
        icon: "🖱️"
    },
    {
        id: 7,
        name: "Auriculares Bluetooth",
        description: "Auriculares inalámbricos con cancelación de ruido activa",
        price: 129.99,
        category: "auriculares",
        icon: "🎧"
    },
    {
        id: 8,
        name: "Monitor 24\" 75Hz",
        description: "Monitor Full HD de 24 pulgadas ideal para oficina",
        price: 149.99,
        category: "monitores",
        icon: "🖥️"
    }
];

// Variables globales
let cart = [];
let currentTheme = localStorage.getItem('theme') || 'light';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    renderProducts('all');
    setupEventListeners();
    updateCartCount();
});

// Función para inicializar el tema
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

// Función para cambiar el tema
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

// Función para actualizar el icono del tema
function updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    if (currentTheme === 'light') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Función para renderizar productos
function renderProducts(category) {
    const productsGrid = document.getElementById('productsGrid');
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.icon}
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
    `).join('');
}

// Función para agregar productos al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification('Producto agregado al carrito');
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Función para mostrar el carrito
function showCart() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--secondary-color);">El carrito está vacío</p>';
        cartTotal.textContent = '0';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.icon}</div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }
    
    cartModal.style.display = 'block';
}

// Función para eliminar productos del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    showCart();
}

// Función para configurar los event listeners
function setupEventListeners() {
    // Botón de tema
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Filtros de categoría
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderProducts(this.dataset.category);
        });
    });
    
    // Carrito
    document.querySelector('.cart').addEventListener('click', showCart);
    document.getElementById('closeCart').addEventListener('click', function() {
        document.getElementById('cartModal').style.display = 'none';
    });
    
    // Cerrar carrito al hacer clic fuera
    document.getElementById('cartModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    // Botón de checkout
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length > 0) {
            alert('Gracias por tu compra! Total: $' + cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2));
            cart = [];
            updateCartCount();
            document.getElementById('cartModal').style.display = 'none';
        }
    });
    
    // CTA Button
    document.querySelector('.cta-button').addEventListener('click', function() {
        document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
    });
}

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
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
const style = document.createElement('style');
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