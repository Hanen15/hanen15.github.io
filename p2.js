function getMeds() { 
  return JSON.parse(localStorage.getItem('medicat')) || []; 
}
function getCart() { 
  return JSON.parse(localStorage.getItem('cart')) || []; 
}
function setCart(cart) { 
  localStorage.setItem('cart', JSON.stringify(cart)); 
}


function seedMeds() {
  if (!localStorage.getItem('medicat')) {
    const sampleMeds = [
      { title: "Panadol", total: 50, category: "Painkiller", img: "panadol.jpg" },
      { title: "Vitamin C", total: 30, category: "Supplement", img: "vitc.jpg" },
      { title: "Cough Syrup", total: 75, category: "Flu", img: "cough.jpg" }
    ];
    localStorage.setItem('medicat', JSON.stringify(sampleMeds));
  }
}

function renderOrders() {
  const meds = getMeds();
  const container = document.getElementById('orders-container');
  if (!container) return console.warn('orders-container missing in HTML');
  container.innerHTML = '';

  meds.forEach((med, index) => {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
      <img src="${med.img || 'default.jpg'}" alt="${med.title || ''}" class="order-img">
      <h4>${med.title || 'No title'}</h4>
      <p>Price: ${med.total} EGP</p>
      <p>Category: ${med.category || ''}</p>
      <button class="add-to-cart" data-index="${index}">Add To Cart</button>
    `;
    container.appendChild(card);
    const btn = card.querySelector('.add-to-cart');
    btn.addEventListener('click', () => addToCart(index));
  });
}

function addToCart(index) {
  const meds = getMeds();
  const med = meds[index];
  if (!med) return console.error('No med found at index', index);

  const cart = getCart();
  const existing = cart.find(item => item.title === med.title); 
  if (existing) {
    existing.quantity = Number(existing.quantity || 1) + 1;
  } else {
    cart.push({ ...med, quantity: 1 }); 
  }
  setCart(cart);
  renderCart();
}

function removeFromCart(index) {
  const cart = getCart();
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  setCart(cart);
  renderCart();
}

function renderCart() {
  const cart = getCart();
  const cartList = document.getElementById('cart-list');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');

  if (!cartList) return console.warn('cart-list missing in HTML');

  cartList.innerHTML = '';
  let total = 0;
  let totalQuantity = 0;

  cart.forEach((item, index) => {
    const price = Number(item.total) || 0;
    const qty = Number(item.quantity) || 0;
    const itemTotal = price * qty;
    total += itemTotal;
    totalQuantity += qty;

    const li = document.createElement('li');
    li.innerHTML = `
      ${item.title} - ${price} EGP ×
      <input type="number" min="1" value="${qty}" data-index="${index}" class="qty-input">
      = ${itemTotal} EGP
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;
    cartList.appendChild(li);
  });

  cartList.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const i = Number(e.target.dataset.index);
      updateQuantity(i, e.target.value);
    });
  });
  cartList.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.index);
      removeFromCart(i);
    });
  });

  if (cartCount) cartCount.textContent = totalQuantity; 
  if (cartTotal) cartTotal.textContent = 'Total: ' + total + ' EGP';
}

function updateQuantity(index, newQty) {
  const cart = getCart();
  newQty = parseInt(newQty) || 1;
  if (newQty < 1) newQty = 1;
  if (!cart[index]) return;
  cart[index].quantity = newQty;
  setCart(cart);
  renderCart();
}

function confirmOrder() {
  const cart = getCart();
  if (cart.length === 0) { alert("Your cart is empty!"); return; }

  const total = cart.reduce((sum, item) => sum + (Number(item.total) * Number(item.quantity)), 0);
  const name = prompt("Enter your name:");
  if (!name) return alert('Name required');
  const email = prompt("Enter your email:");
  const phone = prompt("Enter your phone:");
  const address = prompt("Enter your address:");

  console.log({ name, email, phone, address, cart });
  alert("✅ Order Confirmed! Total: " + total + " EGP\nThanks " + name + "!");

  localStorage.removeItem('cart');
  renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
  seedMeds();   
  renderOrders();
  renderCart();

  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateQuantity = updateQuantity;
  window.confirmOrder = confirmOrder;
});
