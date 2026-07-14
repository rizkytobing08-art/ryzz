// DATABASE LAYANAN SIMULASI SMM
const servicesData = {
  instagram: [
    {
      id: "121",
      name: "Instagram Followers [Super Fast] - Bergaransi",
      price: 15000,
      min: 100,
      max: 50000,
      desc: "Followers Instagram instan dengan garansi isi ulang (refill) 30 hari. Sangat cocok meningkatkan kredibilitas profile baru Anda."
    },
    {
      id: "122",
      name: "Instagram Likes [High Quality] - Real Akun",
      price: 8000,
      min: 50,
      max: 20000,
      desc: "Likes instan dari akun riil aktif. Menaikkan jangkauan organik akun dan meningkatkan rasio interaksi postingan Anda."
    }
  ],
  tiktok: [
    {
      id: "133",
      name: "TikTok Followers [No Drop] - Premium",
      price: 25000,
      min: 100,
      max: 30000,
      desc: "Layanan optimasi followers TikTok berkecepatan natural, aman dari deteksi spam sistem TikTok."
    },
    {
      id: "134",
      name: "TikTok Views [Instant] - Super Murah",
      price: 4000,
      min: 1000,
      max: 100000,
      desc: "Layanan penambah tayangan video untuk memicu algoritma FYP TikTok. Murah dan instan."
    }
  ],
  youtube: [
    {
      id: "145",
      name: "YouTube Subscribers [Real & Permanen]",
      price: 45000,
      min: 100,
      max: 10000,
      desc: "Pelengkap syarat monetisasi channel YouTube Anda secara alami dengan pelanggan permanen."
    }
  ]
};

// ================= SISTEM AUTH (MASUK & KELUAR) =================
const loginForm = document.getElementById('loginForm');
const authPage = document.getElementById('authPage');
const appArea = document.getElementById('appArea');
const logoutBtn = document.getElementById('logoutBtn');
const loggedUserSpan = document.getElementById('loggedUser');

// Jalankan fungsi saat tombol "Masuk Sekarang" diklik
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('loginUser').value;
  
  // Ubah nama profil di pojok kiri bawah
  loggedUserSpan.textContent = usernameInput || "ryzzmember";
  
  // Sembunyikan halaman login, tampilkan dashboard utama
  document.body.classList.remove('auth-mode');
  authPage.classList.add('hidden');
  appArea.classList.remove('hidden');
});

// Jalankan fungsi saat tombol "Keluar" diklik
logoutBtn.addEventListener('click', function() {
  // Sembunyikan dashboard utama, kembali ke halaman login
  document.body.classList.add('auth-mode');
  appArea.classList.add('hidden');
  authPage.classList.remove('hidden');
});

// ================= SISTEM NAVIGASI SIDEBAR =================
const menuLinks = document.querySelectorAll('.menu-link');
const appSections = document.querySelectorAll('.app-section');

menuLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Hapus status aktif dari menu lama
    menuLinks.forEach(item => item.classList.remove('active'));
    this.classList.add('active');
    
    // Sembunyikan semua konten section
    appSections.forEach(section => section.classList.remove('active'));
    
    // Tampilkan section yang ditargetkan
    const targetSectionId = this.getAttribute('data-target');
    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Tutup sidebar di HP jika diklik
    document.querySelector('.sidebar').classList.remove('open');
  });
});

// MOBILE NAVIGATION TOGGLE
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// ================= LOGIKA FORM PEMESANAN BARU =================
const categorySelect = document.getElementById('category');
const serviceSelect = document.getElementById('serviceId');
const quantityInput = document.getElementById('quantity');
const totalDisplay = document.getElementById('totalDisplay');
const ratePer1kSpan = document.getElementById('ratePer1k');
const serviceDescText = document.getElementById('serviceDesc');
const minLimitLabel = document.getElementById('minLimit');
const maxLimitLabel = document.getElementById('maxLimit');
const orderForm = document.getElementById('orderForm');
const submitBtn = document.getElementById('submitBtn');
const responseBox = document.getElementById('response-box');
const historyBody = document.getElementById('historyBody');
const statTotalOrders = document.getElementById('statTotalOrders');

let userTotalOrdersCount = 1248; // Total awal simulasi statistik orderan Anda

// Filter pilihan Layanan berdasarkan Kategori
categorySelect.addEventListener('change', function() {
  const selectedCategory = this.value;
  serviceSelect.innerHTML = '<option value="" disabled selected>-- Pilih Layanan --</option>';
  serviceSelect.disabled = false;

  if (servicesData[selectedCategory]) {
    servicesData[selectedCategory].forEach(service => {
      const option = document.createElement('option');
      option.value = service.id;
      option.textContent = service.name;
      option.dataset.price = service.price;
      option.dataset.min = service.min;
      option.dataset.max = service.max;
      option.dataset.desc = service.desc;
      serviceSelect.appendChild(option);
    });
  }
  
  resetCalculator();
});

// Ambil info detail saat layanan dipilih
serviceSelect.addEventListener('change', function() {
  const selectedOption = this.options[this.selectedIndex];
  if (selectedOption) {
    const price = selectedOption.dataset.price;
    const min = selectedOption.dataset.min;
    const max = selectedOption.dataset.max;
    const desc = selectedOption.dataset.desc;

    serviceDescText.textContent = desc;
    minLimitLabel.textContent = parseInt(min).toLocaleString('id-ID');
    maxLimitLabel.textContent = parseInt(max).toLocaleString('id-ID');
    ratePer1kSpan.textContent = `Rp ${parseInt(price).toLocaleString('id-ID')}`;
    
    quantityInput.min = min;
    quantityInput.placeholder = `Minimal: ${min} - Maksimal: ${max}`;
    calculatePrice();
  }
});

quantityInput.addEventListener('input', calculatePrice);

// Hitung total biaya secara langsung (Live Kalkulasi)
function calculatePrice() {
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  const quantity = parseInt(quantityInput.value) || 0;

  if (selectedOption && selectedOption.dataset.price && quantity > 0) {
    const ratePer1000 = parseFloat(selectedOption.dataset.price);
    const totalPrice = (quantity / 1000) * ratePer1000;
    
    totalDisplay.textContent = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(totalPrice);
  } else {
    totalDisplay.textContent = 'Rp 0';
  }
}

function resetCalculator() {
  serviceDescText.textContent = "Pilih layanan untuk memuat rincian informasi, kecepatan proses, serta garansi refill.";
  minLimitLabel.textContent = "-";
  maxLimitLabel.textContent = "-";
  ratePer1kSpan.textContent = "Rp 0";
  totalDisplay.textContent = "Rp 0";
  quantityInput.value = "";
}

// Simulasi submit order baru
orderForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  const quantity = parseInt(quantityInput.value);
  const target = document.getElementById('target').value;
  
  if (selectedOption) {
    const min = parseInt(selectedOption.dataset.min);
    const max = parseInt(selectedOption.dataset.max);
    
    if (quantity < min || quantity > max) {
      showResponse(false, `Pemesanan minimal ${min.toLocaleString('id-ID')} dan maksimal ${max.toLocaleString('id-ID')}.`);
      return;
    }
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
  
  setTimeout(() => {
    const orderId = Math.floor(100000 + Math.random() * 900000);
    showResponse(true, `<strong>🎉 Pemesanan Berhasil!</strong><br>ID Order: #${orderId}<br>Layanan sedang diproses oleh server SMM.`);
    
    // Tambahkan otomatis order baru ke daftar tabel riwayat secara instan
    addNewOrderToHistory(orderId, selectedOption.textContent, target, quantity, totalDisplay.textContent);
    
    // Update total statistik pesanan pada dashboard
    userTotalOrdersCount++;
    statTotalOrders.textContent = userTotalOrdersCount.toLocaleString('id-ID');
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Pesanan';
  }, 1000);
});

function showResponse(isSuccess, message) {
  responseBox.style.display = 'block';
  responseBox.className = isSuccess ? 'success' : 'error';
  responseBox.innerHTML = message;
}

function addNewOrderToHistory(id, serviceName, target, qty, price) {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>#${id}</td>
    <td>${serviceName}</td>
    <td>${target.length > 25 ? target.substring(0, 22) + '...' : target}</td>
    <td>${qty.toLocaleString('id-ID')}</td>
    <td>${price}</td>
    <td><span class="badge pending">Pending</span></td>
  `;
  historyBody.insertBefore(newRow, historyBody.firstChild);
      }
