document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM cargado - iniciando aplicación');
    initializeApp();
});

async function initializeApp() {
    try {
        await loadComponents();
        await loadProducts();
        setupEventListeners();
        createStarfield();
    } catch (error) {
        console.error('❌ Error inicializando app:', error);
    }
}

async function loadComponents() {
    try {
        const components = [
            { id: 'header-container', file: 'header.html' },
            { id: 'sidebar-container', file: 'sidebar.html' },
            { id: 'footer-container', file: 'footer.html' }
        ];

        for (const component of components) {
            const response = await fetch(`components/${component.file}`);
            if (response.ok) {
                document.getElementById(component.id).innerHTML = await response.text();
            }
        }

        setupLogout();
        setupNavigation();
    } catch (error) {
        console.warn('⚠️ Algunos componentes no se cargaron:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        renderProducts(await response.json());
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        const container = document.getElementById('products-template-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ Error cargando productos</h3>
                    <p><strong>${error.message}</strong></p>
                </div>
            `;
        }
    }
}

function renderProducts(products) {
    const container = document.getElementById('products-template-container');
    const template = document.getElementById('product-template');
    
    if (!container || !template) {
        console.error('❌ No se encuentra el container o template');
        return;
    }
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const clone = template.content.cloneNode(true);
        const article = clone.querySelector('.product-card');
        
        article.setAttribute('data-category', product.type);
        article.querySelector('.product-img').src = product.image;
        article.querySelector('.product-img').alt = product.name;
        article.querySelector('.product-title').textContent = product.name;
        article.querySelector('.product-description').textContent = product.description;
        article.querySelector('.product-price').textContent = product.price;
        article.querySelector('.product-category').textContent = product.type;
        
        container.appendChild(clone);
    });
}

function setupEventListeners() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterProducts(e.target.dataset.filter);
        }
        
        if (e.target.classList.contains('add-to-cart')) {
            const productName = e.target.closest('.product-card').querySelector('.product-title').textContent;
            alert(`🌌 ¡Felicidades! \nHas adquirido: ${productName}\n\nRecibirás los documentos en tu correo cósmico.`);
        }
    });
}

function filterProducts(filter) {
    document.querySelectorAll('.product-card').forEach(product => {
        product.style.display = filter === 'all' ? 'block' : product.getAttribute('data-category') === filter ? 'block' : 'none';
    });
}

function setupNavigation() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-item')) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
}

function setupLogout() {
    document.addEventListener('click', (e) => {
        if (e.target.id === 'logoutBtn' && confirm('¿Salir del portal galáctico?')) {
            window.location.href = 'login.html';
        }
    });
}

function createStarfield() {
    const body = document.body;
    const starCount = 50;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: fixed; width: ${Math.random() * 3}px; height: ${Math.random() * 3}px;
            background: white; border-radius: 50%; left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh; opacity: ${Math.random() * 0.7 + 0.3};
            z-index: -1; animation: twinkle ${Math.random() * 3 + 2}s infinite alternate;
        `;
        body.appendChild(star);
    }
    
    if (!document.querySelector('#starfield-style')) {
        const style = document.createElement('style');
        style.id = 'starfield-style';
        style.textContent = `@keyframes twinkle { 0% { opacity: 0.3; } 100% { opacity: 0.8; } }`;
        document.head.appendChild(style);
    }
}