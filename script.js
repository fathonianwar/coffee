// script.js (Kode LENGKAP yang DIPERBAIKI)

// --- Konfigurasi Menu ---
const MENU_ITEMS = [
    { id: 1, name: "Espresso Shot", price: 25000, category: "Kopi", image: "img/Espresso Shot.jpg" },
    { id: 2, name: "Caffè Latte", price: 35000, category: "Kopi", image: "img/Caffè Latte.jpg" },
    { id: 3, name: "Caramel Macchiato", price: 40000, category: "Kopi", image: "img/Caramel Macchiato.jpg" },
    { id: 4, name: "Matcha Latte", price: 38000, category: "Non Coffee", image: "img/Matcha Latte.jpg" },
    { id: 5, name: "Red Velvet", price: 38000, category: "Non Coffee", image: "img/Red Velvet.jpg" },
    { id: 6, name: "Chocolate Frap", price: 42000, category: "Non Coffee", image: "img/Chocolate Frap.jpg" },
    { id: 7, name: "Croissant Original", price: 28000, category: "Makanan", image: "img/Croissant Original.jpg" },
    { id: 8, name: "Tuna Sandwich", price: 45000, category: "Makanan", image: "img/Tuna Sandwich.jpg" },
    // Tambahkan lebih banyak item menu di sini
];

// --- Variabel Keranjang ---
let cart = [];

// --- Fungsi Helper LocalStorage ---
const getCartFromStorage = () => {
    const storedCart = localStorage.getItem('coffeeVilleCart');
    return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartToStorage = () => {
    localStorage.setItem('coffeeVilleCart', JSON.stringify(cart));
};

// --- Fungsi Inisialisasi ---
document.addEventListener('DOMContentLoaded', () => {
    cart = getCartFromStorage();
    
    // ==============================================
    // !!! LOGIKA HAMBURGER MENU DIPERBAIKI !!!
    // ==============================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Mengubah ikon menjadi X saat menu terbuka
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times'); // Ikon 'X'
            
            // Tutup keranjang jika menu dibuka
            document.getElementById('cart-popup')?.classList.remove('open'); 
        });
        
        // Tutup menu saat link diklik
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    // ==============================================

    // Inisialisasi Pop-up Keranjang (jika ada)
    if (document.getElementById('cart-popup')) {
        setupCartPopup();
        renderCart();
    }

    // Inisialisasi Menu Page (jika di menu.html)
    if (document.getElementById('menu-grid')) {
        renderMenu(MENU_ITEMS);
        setupMenuControls();
    }
    
    // Inisialisasi Order Page (jika di order.html)
    if (document.getElementById('order-form')) {
        renderOrderSummary();
        setupOrderForm();
    }
    
    // Inisialisasi Payment/Invoice Page (jika di payment.html)
    if (document.getElementById('invoice-detail-container')) {
        renderInvoiceDetails();
    }
});

// --- Logika Keranjang (CRUD) ---

const addToCart = (itemId) => {
    const item = MENU_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    const existingItem = cart.find(i => i.id === itemId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    saveCartToStorage();
    renderCart();
    alert(`${item.name} ditambahkan ke keranjang!`);
};

const updateCartItemQuantity = (itemId, change) => {
    const itemIndex = cart.findIndex(i => i.id === itemId);
    
    if (itemIndex > -1) {
        cart[itemIndex].qty += change;

        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1); // Hapus jika qty = 0
        }
        
        saveCartToStorage();
        renderCart();
        
        // Refresh Order Summary jika di halaman order.html
        if (document.getElementById('order-form')) {
            renderOrderSummary();
        }
    }
};


// --- Render Keranjang Pop-up ---
const setupCartPopup = () => {
    const cartIcon = document.querySelector('.cart-icon');
    const cartPopup = document.getElementById('cart-popup');
    const closeBtn = document.getElementById('cart-close-btn');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

    cartIcon.addEventListener('click', () => {
        cartPopup.classList.toggle('open');
        
        // Tutup hamburger menu jika keranjang dibuka
        const navLinks = document.getElementById('nav-links');
        const menuToggle = document.getElementById('menu-toggle');
        if(navLinks && menuToggle) {
             navLinks.classList.remove('active');
             const icon = menuToggle.querySelector('i');
             icon.classList.remove('fa-times');
             icon.classList.add('fa-bars');
        }
    });

    closeBtn.addEventListener('click', () => {
        cartPopup.classList.remove('open');
    });
    
    cartCheckoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = 'order.html';
        } else {
            alert('Keranjang Anda kosong! Silakan tambahkan menu.');
        }
    });
};


const renderCart = () => {
    const cartList = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('cart-total');
    const countElement = document.querySelector('.cart-icon-count');
    
    if (!cartList || !totalElement) return;

    cartList.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<p style="text-align: center; color: #777;">Keranjang kosong.</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            itemCount += item.qty;

            const cartItemHTML = `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <strong>${item.name}</strong>
                        <span>Rp ${item.price.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="item-quantity">
                        <button onclick="updateCartItemQuantity(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
                    </div>
                    <span>Rp ${itemTotal.toLocaleString('id-ID')}</span>
                </div>
            `;
            cartList.innerHTML += cartItemHTML;
        });
    }

    totalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    countElement.textContent = itemCount;
};

// --- Render Menu Page ---
const renderMenu = (itemsToRender) => {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = ''; // Kosongkan grid

    itemsToRender.forEach(item => {
        const cardHTML = `
            <div class="product-card" data-category="${item.category}">
                <img src="${item.image}" alt="${item.name}">
                <div class="product-info">
                    <h4>${item.name}</h4>
                    <p>Rp ${item.price.toLocaleString('id-ID')}</p>
                    <button class="btn btn-primary" onclick="addToCart(${item.id})">Tambah ke Keranjang</button>
                </div>
            </div>
        `;
        menuGrid.innerHTML += cardHTML;
    });
};

const setupMenuControls = () => {
    const searchInput = document.getElementById('search-menu');
    const filterButtons = document.querySelectorAll('.category-filter button');
    
    let activeCategory = 'Semua';

    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredItems = MENU_ITEMS;

        // Filter by Category
        if (activeCategory !== 'Semua') {
            filteredItems = filteredItems.filter(item => item.category === activeCategory);
        }

        // Filter by Search Term
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );

        renderMenu(filteredItems);
    };
    
    searchInput.addEventListener('input', applyFilters);

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Update active category
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            activeCategory = e.target.textContent;
            
            applyFilters();
        });
    });
};

// --- Order Page Logic ---
const renderOrderSummary = () => {
    const summaryBody = document.getElementById('order-summary-body');
    const totalCell = document.getElementById('order-total-price');
    
    if (!summaryBody || !totalCell) return;
    
    summaryBody.innerHTML = '';
    let grandTotal = 0;
    
    if (cart.length === 0) {
        summaryBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Keranjang kosong. <a href="menu.html">Lihat Menu</a></td></tr>`;
        totalCell.textContent = 'Rp 0';
        return;
    }
    
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        grandTotal += itemTotal;
        
        const row = `
            <tr>
                <td>${item.name}</td>
                <td style="text-align:center;">${item.qty}</td>
                <td>Rp ${item.price.toLocaleString('id-ID')}</td>
                <td style="text-align:right;">Rp ${itemTotal.toLocaleString('id-ID')}</td>
            </tr>
        `;
        summaryBody.innerHTML += row;
    });
    
    totalCell.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
    
    // Simpan Total di session storage sementara
    sessionStorage.setItem('orderGrandTotal', grandTotal);
};

const setupOrderForm = () => {
    const orderForm = document.getElementById('order-form');
    const paymentMethodRadios = document.querySelectorAll('input[name="payment_method"]');
    const paymentDetailsDiv = document.getElementById('payment-details');

    const togglePaymentDetails = (method) => {
        if (method === 'Transfer' || method === 'E-Wallet') {
            paymentDetailsDiv.style.display = 'block';
            
            // Logika menampilkan info spesifik
            const detailsContent = document.getElementById('payment-details-content');
            
            let methodInfoHTML = '';
            let qrCodeSrc = 'img/qr-code-placeholder.jpg'; // Placeholder QR Code

            if (method === 'Transfer') {
                methodInfoHTML = `
                    <p>Silakan transfer ke salah satu rekening berikut:</p>
                    <p><strong>BCA: 1234567890 a.n. CoffeeVille</strong></p>
                    <p><strong>BRI: 0987654321 a.n. CoffeeVille</strong></p>
                    <p style="color: var(--secondary-color); font-weight: bold; margin-top: 10px;">Anda akan diarahkan ke WhatsApp untuk konfirmasi dan pengiriman bukti transfer.</p>
                `;
            } else if (method === 'E-Wallet') {
                 methodInfoHTML = `
                    <p>Silakan bayar menggunakan QRIS (Dana, OVO, Gopay, Shopeepay) berikut:</p>
                    <p style="color: var(--secondary-color); font-weight: bold; margin-top: 10px;">Anda akan diarahkan ke WhatsApp untuk konfirmasi dan pengiriman bukti pembayaran (screenshot/foto QRIS).</p>
                `;
            }
            
            detailsContent.innerHTML = `
                ${methodInfoHTML}
                <div class="payment-method-info">
                    <img src="${qrCodeSrc}" alt="QR Code Pembayaran">
                </div>
            `;
            
        } else {
            // Cash on Delivery
            paymentDetailsDiv.style.display = 'none';
        }
    };

    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            togglePaymentDetails(e.target.value);
        });
    });
    
    togglePaymentDetails(document.querySelector('input[name="payment_method"]:checked')?.value);


    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert("Keranjang kosong! Tidak dapat melanjutkan pemesanan.");
            window.location.href = 'menu.html';
            return;
        }

        const formData = new FormData(orderForm);
        const orderData = {
            id: 'CV' + Date.now(),
            name: formData.get('name'),
            address: formData.get('address'),
            whatsapp: formData.get('whatsapp'),
            delivery_option: formData.get('delivery_option'),
            notes: formData.get('notes'),
            payment_method: formData.get('payment_method'),
            total: sessionStorage.getItem('orderGrandTotal'),
            items: cart,
            status: 'Pending Confirmation',
            date: new Date().toLocaleString()
        };
        
        sessionStorage.setItem('currentOrder', JSON.stringify(orderData));
        
        localStorage.removeItem('coffeeVilleCart');
        cart = [];
        
        window.location.href = 'payment.html';
    });
};

// --- Payment/Invoice Page Logic ---
const renderInvoiceDetails = () => {
    const orderData = JSON.parse(sessionStorage.getItem('currentOrder'));
    
    if (!orderData) {
        document.getElementById('invoice-detail-container').innerHTML = '<h2>Data Pesanan Tidak Ditemukan.</h2><p><a href="index.html">Kembali ke Home</a></p>';
        return;
    }
    
    document.getElementById('invoice-id').textContent = orderData.id;
    document.getElementById('invoice-id-2').textContent = orderData.id;
    document.getElementById('invoice-date').textContent = orderData.date;
    document.getElementById('customer-name').textContent = orderData.name;
    document.getElementById('customer-address').textContent = orderData.address;
    document.getElementById('delivery-option').textContent = orderData.delivery_option;
    document.getElementById('payment-method').textContent = orderData.payment_method;
    
    const invoiceTableBody = document.getElementById('invoice-table-body');
    let itemTotal = 0;

    invoiceTableBody.innerHTML = '';
    orderData.items.forEach(item => {
        const subTotal = item.price * item.qty;
        itemTotal += subTotal;
        const row = `
            <tr>
                <td>${item.name}</td>
                <td style="text-align:center;">${item.qty}</td>
                <td style="text-align:right;">Rp ${item.price.toLocaleString('id-ID')}</td>
                <td style="text-align:right;">Rp ${subTotal.toLocaleString('id-ID')}</td>
            </tr>
        `;
        invoiceTableBody.innerHTML += row;
    });

    const totalRow = `
        <tr class="total-row">
            <td colspan="3" style="text-align:right; font-weight:bold;">TOTAL HARGA</td>
            <td style="text-align:right;">Rp ${itemTotal.toLocaleString('id-ID')}</td>
        </tr>
    `;
    invoiceTableBody.innerHTML += totalRow;
    
    const downloadBtn = document.getElementById('download-invoice-btn');
    const whatsappBtn = document.getElementById('whatsapp-order-btn');
    
    downloadBtn.addEventListener('click', () => {
        generateInvoiceText(orderData);
    });

    whatsappBtn.addEventListener('click', () => {
        sendWhatsappOrder(orderData);
    });
};

// --- Fungsi Download Invoice (Sederhana: Text File) ---
const generateInvoiceText = (order) => {
    let invoiceText = `===== INVOICE COFFEEVILLE =====\n`;
    invoiceText += `No. Pesanan: ${order.id}\n`;
    invoiceText += `Tanggal: ${order.date}\n`;
    invoiceText += `Status: ${order.status}\n\n`;
    
    invoiceText += `--- DETAIL CUSTOMER ---\n`;
    invoiceText += `Nama: ${order.name}\n`;
    invoiceText += `Alamat: ${order.address}\n`;
    invoiceText += `No. WA: ${order.whatsapp}\n`;
    invoiceText += `Opsi: ${order.delivery_option}\n\n`;

    invoiceText += `--- DETAIL PESANAN ---\n`;
    order.items.forEach(item => {
        const subTotal = item.price * item.qty;
        invoiceText += `${item.name} (x${item.qty}) - Rp ${subTotal.toLocaleString('id-ID')}\n`;
    });
    
    invoiceText += `\nTOTAL BAYAR: Rp ${parseInt(order.total).toLocaleString('id-ID')}\n`;
    invoiceText += `Metode Pembayaran: ${order.payment_method}\n\n`;
    invoiceText += `Terima kasih atas pesanan Anda di CoffeeVille!\n`;
    
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Invoice ${order.id} berhasil diunduh sebagai file teks.`);
};

// --- Fungsi Kirim ke WhatsApp API ---
const sendWhatsappOrder = (order) => {
    let message = `*HALO ADMIN COFFEEVILLE*\n\nSaya ${order.name} ingin mengkonfirmasi dan mengirim detail pesanan saya:\n`;
    message += `*No. Pesanan:* ${order.id}\n`;
    message += `*Nama:* ${order.name}\n`;
    message += `*No. HP:* ${order.whatsapp}\n`;
    message += `*Alamat:* ${order.address} (${order.delivery_option})\n`;
    message += `*Metode Bayar:* ${order.payment_method}\n\n`;
    
    message += `*DETAIL PESANAN:*\n`;
    order.items.forEach(item => {
        message += `- ${item.name} x${item.qty} (Rp ${(item.price * item.qty).toLocaleString('id-ID')})\n`;
    });
    
    message += `\n*TOTAL HARGA:* Rp ${parseInt(order.total).toLocaleString('id-ID')}\n\n`;
    
    if (order.payment_method !== 'Cash') {
         message += `Mohon segera kirimkan bukti transfer/pembayaran saya di chat ini agar pesanan bisa diproses. Terima kasih! 🙏`;
    } else {
         message += `Siap untuk Cash on Delivery. Terima kasih! 🙏`;
    }


    // =============================================================
    // !!! GANTI NOMOR DI BAWAH INI DENGAN NOMOR WHATSAPP ANDA !!!
    // Format: 628xxxxxx (tanpa + atau spasi)
    const whatsappNumber = '6285806865727'; // <-- GANTI NOMOR INI
    // =============================================================


    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Buka di tab baru
    window.open(whatsappUrl, '_blank');
};