let cart = [];
let total = 0;
let cartVisible = false;

function addToCart(item, price) {
  cart.push({ item, price });
  updateCart();
}

function updateCart() {
  const list = document.getElementById('cart-list');
  list.innerHTML = '';
  total = 0;
  cart.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = `${entry.item} - ₱${entry.price}`; // Keep peso sign here (for cart list)
    list.appendChild(li);
    total += entry.price;
  });
  document.getElementById('total').textContent = total; // ✅ Removed peso sign (HTML already has it)
}

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const customerName = document.getElementById('customer-name').value;
  const shippingAddress = document.getElementById('shipping-address').value;

  if (!customerName || !shippingAddress) {
    alert('Please fill in your name and address!');
    return;
  }

 const orderData = {
  requestType: 'CheckOutOrder',
  customerName,
  shippingAddress,
  items: JSON.stringify(cart), // this still needs to be stringified because it's an array
  total
};

$.ajax({
  url: 'backend/end-points/controller.php',
  type: 'POST',
  data: orderData,
  success: function(response) {
    console.log('Order submitted:', response);
    showOrderConfirmation(customerName, shippingAddress);
    cart = [];
    updateCart();
  },
  error: function(xhr, status, error) {
    console.error('Order submission failed:', error);
    alert('Failed to submit order. Please try again.');
  }
});



}


function showOrderConfirmation(customerName, shippingAddress) {
  const orderNumber = Math.floor(Math.random() * 100);
  const orderSummary = document.getElementById('order-summary');
  orderSummary.innerHTML = '';
  cart.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = `${entry.item} - ₱${entry.price}`; 
    orderSummary.appendChild(li);
  });
  document.getElementById('final-total').textContent = total; 
  document.getElementById('order-number').textContent = orderNumber;
  document.getElementById('order-customer-name').textContent = customerName;
  document.getElementById('order-shipping-address').textContent = shippingAddress;

  const modal = document.getElementById('order-confirmation-modal');
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('order-confirmation-modal');
  modal.style.display = 'none';
}

function toggleCart() {
  const cartSection = document.getElementById('cart-section');
  cartVisible = !cartVisible;
  cartSection.style.display = cartVisible ? 'block' : 'none';
}
