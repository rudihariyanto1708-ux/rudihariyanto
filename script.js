// script.js — Jewelry Edition (open product, load detail, popup order)

// open product from katalog -> produk.html with params
function openProduct(img, name, price, desc){
  const base = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1) + 'produk.html';
  const params = new URLSearchParams({ img, nama: name, harga: price, desc: desc });
  window.location.href = base + '?' + params.toString();
}

// load product details (when produk.html opens)
(function loadProductFromParams(){
  if(!document.getElementById('product-name')) return;
  const params = new URLSearchParams(window.location.search);
  const img = params.get('img') || 'img/ring1.jpg';
  const nama = params.get('nama') || 'Produk';
  const harga = params.get('harga') || '0';
  const desc = params.get('desc') ? decodeURIComponent(params.get('desc')) : '';

  const imgEl = document.getElementById('product-image');
  const nameEl = document.getElementById('product-name');
  const priceEl = document.getElementById('product-price');
  const descEl = document.getElementById('product-desc');

  imgEl.src = img;
  imgEl.alt = nama;
  nameEl.textContent = nama;
  priceEl.textContent = 'Rp ' + Number(harga).toLocaleString('id-ID');
  descEl.textContent = desc;
})();

// build & handle popup form (produk.html)
(function setupPopupHandlers(){
  const buyBtn = document.getElementById('buy-now');
  if(!buyBtn) return;

  const popupHtml = `
  <div class="popup" id="popup">
    <div class="popup-content">
      <span class="close-popup" id="closePopup">×</span>
      <h3 class="popup-title">🛍️ Formulir Pesanan</h3>
      <p class="popup-subtitle">Isi data pengiriman untuk melanjutkan</p>

      <form id="orderForm" onsubmit="return false;">
        <div class="floating-group"><input id="buyerName" placeholder=" " required><label>Nama Lengkap</label></div>
        <div class="floating-group"><textarea id="buyerAddress" placeholder=" " required></textarea><label>Alamat Lengkap</label></div>
        <div class="floating-group"><input id="buyerPhone" placeholder=" " required><label>Nomor WhatsApp (628...)</label></div>
        <div class="floating-group readonly"><input id="popupProductName" readonly placeholder=" "><label>Produk</label></div>
        <div class="floating-group readonly"><input id="popupPrice" readonly placeholder=" "><label>Harga Satuan</label></div>
        <div class="floating-group"><input type="number" id="quantity" min="1" value="1" required><label>Jumlah</label></div>
        <div class="floating-group readonly"><input id="totalPrice" readonly placeholder=" "><label>Total Harga</label></div>

        <div class="popup-actions">
          <button class="confirm-btn" id="confirmBuy" type="button">Konfirmasi & Kirim ke WA</button>
          <button class="cancel-btn" id="cancelBuy" type="button">Batal</button>
        </div>
      </form>
    </div>
  </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHtml);

  const popup = document.getElementById('popup');
  const closePopupEl = document.getElementById('closePopup');
  const cancelBuy = document.getElementById('cancelBuy');
  const confirmBuyBtn = document.getElementById('confirmBuy');

  buyBtn.addEventListener('click', function(e){
    e.preventDefault();
    const productName = document.getElementById('product-name').textContent;
    const priceText = document.getElementById('product-price').textContent.replace('Rp','').replace(/\./g,'').trim();
    const price = parseInt(priceText) || 0;

    document.getElementById('popupProductName').value = productName;
    document.getElementById('popupPrice').value = 'Rp ' + price.toLocaleString('id-ID');
    document.getElementById('totalPrice').value = 'Rp ' + price.toLocaleString('id-ID');
    document.getElementById('quantity').value = 1;
    popup.style.display = 'flex';
  });

  closePopupEl.addEventListener('click', ()=> popup.style.display = 'none');
  cancelBuy.addEventListener('click', ()=> popup.style.display = 'none');
  window.addEventListener('click', (e)=> { if(e.target === popup) popup.style.display = 'none'; });

  document.getElementById('quantity').addEventListener('input', function(){
    const q = Math.max(1, Number(this.value) || 1);
    this.value = q;
    const priceText = document.getElementById('popupPrice').value.replace('Rp','').replace(/\./g,'').trim();
    const price = parseInt(priceText) || 0;
    const total = q * price;
    document.getElementById('totalPrice').value = 'Rp ' + total.toLocaleString('id-ID');
  });

  confirmBuyBtn.addEventListener('click', function(){
    const name = document.getElementById('buyerName').value.trim();
    const address = document.getElementById('buyerAddress').value.trim();
    const phone = document.getElementById('buyerPhone').value.trim();
    const qty = Number(document.getElementById('quantity').value) || 1;
    const totalText = document.getElementById('totalPrice').value.replace('Rp','').replace(/\./g,'').trim();
    const total = Number(totalText) || 0;
    const productName = document.getElementById('popupProductName').value;

    if(!name || !address || !phone){
      alert('Mohon lengkapi Nama, Alamat, dan Nomor WhatsApp terlebih dahulu.');
      return;
    }

    const WA_NUMBER = 'YOUR_WA_NUMBER'; // <-- ganti nomor WA di sini (contoh: 62812...)
    const message =
`Halo Sheila Store, saya ingin memesan:
- Produk: ${productName}
- Jumlah: ${qty}
- Total: Rp ${total.toLocaleString('id-ID')}

Nama: ${name}
Nomor: ${phone}
Alamat: ${address}`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url,'_blank');
    popup.style.display = 'none';
  });

})();
