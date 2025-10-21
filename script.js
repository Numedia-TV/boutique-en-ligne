document.addEventListener('DOMContentLoaded', () => {

  // 🔗 Remplace cette URL par celle de ton Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwIhj7uLHFsQPTaPFNJltFTtDoaKEYN0mQZ6-Zi73Zx7B-6EnNaZ-WHTuQx9H-fCxObLQ/exec';
  
  // 🛍️ Produits disponibles
  const PRODUCTS = [
    {id: 1, name: 'Produit A', price: 4500},
    {id: 2, name: 'Produit B', price: 675},
    {id: 3, name: 'Produit C', price: 1195}
  ];

  const productsEl = document.getElementById('products');
  const cartItemsEl = document.getElementById('cart-items');
  const cartCountEl = document.querySelector('#cart-count span');
  const cartTotalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutSection = document.getElementById('checkout');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutStatus = document.getElementById('checkout-status');

  let cart = [];

  // 🧱 Afficher les produits
  function renderProducts() {
    productsEl.innerHTML = '';
    PRODUCTS.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product';
      card.innerHTML = `
        <h3>${p.name}</h3>
        <div>Prix : ${p.price} DA</div>
        <button class="add-btn" data-id="${p.id}">Ajouter</button>
      `;
      productsEl.appendChild(card);
    });
  }

  // 🛒 Afficher le panier
  function renderCart() {
    cartItemsEl.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} x ${item.qty} — ${item.qty * item.price} DA`;
      cartItemsEl.appendChild(li);
      total += item.qty * item.price;
    });
    cartTotalEl.textContent = `Total : ${total} DA`;
    cartCountEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
  }

  // ➕ Ajouter au panier
  productsEl.addEventListener('click', e => {
    if (e.target.classList.contains('add-btn')) {
      const id = Number(e.target.dataset.id);
      const p = PRODUCTS.find(x => x.id === id);
      const found = cart.find(x => x.id === id);
      if (found) found.qty++;
      else cart.push({...p, qty: 1});
      renderCart();
    }
  });

  // 💳 Afficher / cacher la section paiement
  checkoutBtn.addEventListener('click', () => {
    checkoutSection.classList.toggle('hidden');
  });

  // 📤 Envoi des données au Google Sheet
  checkoutForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    if (cart.length === 0) {
      checkoutStatus.textContent = 'Votre panier est vide.';
      return;
    }

    const formData = new FormData(checkoutForm);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      cart: cart.map(i => ({name: i.name, qty: i.qty, price: i.price})),
      total: cart.reduce((s, i) => s + i.qty * i.price, 0),
      date: new Date().toISOString()
    };

    const params = new URLSearchParams();
    for (const key in payload) {
      params.append(key, typeof payload[key] === 'object' ? JSON.stringify(payload[key]) : payload[key]);
    }

    try {
      checkoutStatus.textContent = 'Envoi en cours...';
      await fetch(`${SCRIPT_URL}?${params.toString()}`, {method: 'GET', mode: 'no-cors'});
      checkoutStatus.textContent = '✅ Commande enregistrée avec succès !';
      cart = [];
      renderCart();
      checkoutForm.reset();
    } catch (err) {
      console.error(err);
      checkoutStatus.textContent = '❌ Erreur lors de l’envoi.';
    }
  });

  // 🚀 Initialisation
  renderProducts();
  renderCart();

});
