// Sheila Store v4 — product navigation, multi-image gallery, popup form, WA message

// open product page with multiple images (array)
function openProductMulti(imgs, name, price, desc){
  // imgs: array of image paths
  const base = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1) + 'produk.html';
  // join images with '||' safe separator and encode
  const params = new URLSearchParams({
    imgs: imgs.join('||'),
    nama: name,
    harga: price,
    desc: desc
  });
  window.location.href = base + '?' + params.toString();
}

// load product data & build gallery
(function loadProduct(){
  if(!document.getElementById('product-name')) return;
  const params = new URLSearchParams(window.location.search);
  const imgsParam = params.get('imgs') || 'img/ring1.jpg';
  const imgs = imgsParam.split('||');
  const name = params.get('nama') || 'Produk';
  const price = params.get('harga') || '0';
  const desc = params.get('desc') ? decodeURIComponent(params.get('desc')) : '';

  const galleryImage = document.getElementById('galleryImage');
  const thumbs = document.getElementById('thumbs');
  const nameEl = document.getElementById('product-name');
  const priceEl = document.getElementById('product-price');
  const descEl = document.getElementById('product-desc');

  let index = 0;
  function show(i){
    index = (i + imgs.length) % imgs.length;
    galleryImage.src = imgs[index];
    // update active thumb
    Array.from(thumbs.children).forEach((t, idx) => t.classList.toggle('active', idx === index));
  }

  // create thumbs
  thumbs.innerHTML = '';
  imgs.forEach((src, i) => {
    const b = document.createElement('div');
    b.className = 'thumb';
    b.innerHTML = `<img src="${src}" alt="${name} variant ${i+1}">`;
    b.addEventListener('click', ()=> show(i));
    thumbs.appendChild(b);
  });

  // next / prev handlers
  document.getElementById('nextBtn').addEventListener('click', ()=> show(index+1));
  document.getElementById('prevBtn').addEventListener('click', ()=> show(index-1));

  // keyboard support
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') show(index+1);
    if(e.key === 'ArrowLeft') show(index-1);
  });

  // initial
  show(0);

  // fill meta
  nameEl.textContent = name;
  priceEl.textContent = 'Rp ' + Number(price).toLocaleString('id-ID');
  descEl.textContent = desc;
})();

// popup form creation & handling
(function popupForm(){
  const buyBtn = document.getElementById('buy-now');
  if(!buyBtn) return;

  const popupHtml = `
    <div class="popup" id="popup">
      <div class="popup-content" role="dialog" aria-modal="true">
        <span class="close-popup" id="closePopup">×</span>
        <h3 class="popup-title">🛍️ Formulir Pesanan</h3>
        <p class="popup-sub">Isi data pengiriman untuk melanjutkan</p>
        <form id="orderForm" onsubmit="return false;">
          <div class="floating"><input id="buyerName" placeholder=" " required><label>Nama Lengkap</label></div>
          <div class="floating"><textarea id="buyerAddress" placeholder=" " required></textarea><label>Alamat Lengkap</label></div>
          <div class="floating"><input id="buyerPhone" placeholder=" " required><label>Nomor WhatsApp (628...)</label></div>
          <div class="floating"><input id="popupProduct" readonly placeholder=" "><label>Produk</label></div>
          <div class="floating"><input id="popupPrice" readonly placeholder=" "><label>Harga Satuan</label></div>
          <div class="floating"><input type="number" id="quantity" min="1" value="1" required><label>Jumlah</label></div>
          <div class="floating"><input id="totalPrice" readonly placeholder=" "><label>Total Harga</label></div>
          <div style="display:flex;gap:10px;margin-top:12px">
            <button class="primary" id="confirmBuy" type="button">Konfirmasi & Kirim ke WA</button>
            <button class="ghost" id="cancelBuy" type="button">Batal</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHtml);

  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');
  const cancelBuy = document.getElementById('cancelBuy');
  const confirmBuy = document.getElementById('confirmBuy');

  buyBtn.addEventListener('click', function(e){
    e.preventDefault();
    const name = document.getElementById('product-name').textContent;
    const priceText = document.getElementById('product-price').textContent.replace('Rp','').replace(/\./g,'').trim();
    const price = parseInt(priceText) || 0;
    document.getElementById('popupProduct').value = name;
    document.getElementById('popupPrice').value = 'Rp ' + price.toLocaleString('id-ID');
    document.getElementById('totalPrice').value = 'Rp ' + price.toLocaleString('id-ID');
    document.getElementById('quantity').value = 1;
    popup.style.display = 'flex';
    document.getElementById('buyerName').focus();
  });

  closePopup.addEventListener('click', ()=> popup.style.display = 'none');
  cancelBuy.addEventListener('click', ()=> popup.style.display = 'none');
  window.addEventListener('click', (e)=> { if(e.target === popup) popup.style.display = 'none'; });

  // update total when qty changes
  document.addEventListener('input', (e)=>{
    if(e.target && e.target.id === 'quantity'){
      const q = Math.max(1, Number(e.target.value) || 1);
      e.target.value = q;
      const pText = document.getElementById('popupPrice').value.replace('Rp','').replace(/\./g,'').trim();
      const p = parseInt(pText) || 0;
      document.getElementById('totalPrice').value = 'Rp ' + (q * p).toLocaleString('id-ID');
    }
  });

  confirmBuy.addEventListener('click', function(){
    const buyer = document.getElementById('buyerName').value.trim();
    const address = document.getElementById('buyerAddress').value.trim();
    const phone = document.getElementById('buyerPhone').value.trim();
    const qty = Number(document.getElementById('quantity').value) || 1;
    const prod = document.getElementById('popupProduct').value;
    const totalText = document.getElementById('totalPrice').value.replace('Rp','').replace(/\./g,'').trim();
    const total = Number(totalText) || 0;

    if(!buyer || !address || !phone){
      alert('Mohon lengkapi semua data (Nama, Alamat, Nomor WA).');
      return;
    }

    const WA_NUMBER = '6285931500246'; // <-- ganti di sini (format: 62812...)

  // buat pesan
const message =
  "Halo Sheila Store, saya ingin memesan:\n" +
  "- Produk: " + prod + "\n" +
  "- Jumlah: " + qty + "\n" +
  "- Total: Rp " + total.toLocaleString() + "\n" +
  "Nama: " + buyer + "\n" +
  "Nomor: " + phone + "\n" +
  "Alamat: " + address;

// ubah semua baris baru ke %0A
const encodedMessage = message.replace(/\n/g, "%0A");

// buat tautan yang dijamin aman
const url = "https://api.whatsapp.com/send?phone=6285931500246&text=" + encodedMessage;

// buka WhatsApp
window.open(url, "_blank");


    popup.style.display = 'none';
  });
})();
