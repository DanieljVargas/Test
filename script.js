let cart = [];

async function obtenerPrecioDolar() {
  const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
  const data = await response.json();
  const precioDolar = data.promedio;
  return precioDolar;
}

function addToCart(button) {
  const productElement = button.closest(".elementor-element-9c3be3c");
  const name = productElement.querySelector(".titulo").textContent.trim();
  const priceText = productElement
    .querySelector(".elementor-image-box-title")
    .textContent.trim();
  const price = parseFloat(priceText.replace("$", ""));

  const product = cart.find((item) => item.name === name);
  if (product) {
    product.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCart();
}

function removeFromCart(name) {
  const product = cart.find((item) => item.name === name);
  if (product && product.quantity > 1) {
    product.quantity -= 1;
  } else {
    cart = cart.filter((item) => item.name !== name);
  }
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartSummary = document.getElementById("total-quantity");
  const viewOrderBtn = document.getElementById("view-order-btn");
  cartItems.innerHTML = "";
  let subtotal = 0;
  let totalQuantity = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    totalQuantity += item.quantity;
    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name} x ${item.quantity} - $${itemTotal.toFixed(2)}</span>
        <button class="plus1" onclick="changeQuantity('${
          item.name
        }', 1)">+</button>
        <button class="plus2" onclick="changeQuantity('${
          item.name
        }', -1)">-</button>
      </div>
    `;
  });

  cartSummary.innerText = `Productos: ${totalQuantity}\nTotal: $${subtotal.toFixed(
    2
  )}`;

  if (cart.length > 0) {
    viewOrderBtn.style.display = "block";
  } else {
    viewOrderBtn.style.display = "none";
  }
}

function changeQuantity(name, change) {
  const product = cart.find((item) => item.name === name);
  if (product) {
    product.quantity += change;
    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.name !== name);
    }
  }
  updateCart();
}

function toggleCartVisibility() {
  const cartDetails = document.getElementById("cart-details");
  if (
    cartDetails.style.display === "none" ||
    cartDetails.style.display === ""
  ) {
    cartDetails.style.display = "block";
    updateCartDetails();
  } else {
    cartDetails.style.display = "none";
  }
}

async function updateCartDetails() {
  const subtotalElement = document.getElementById("subtotal");
  const igtfElement = document.getElementById("igtf");
  const totalElement = document.getElementById("total");
  const exchangeRateElement = document.getElementById("exchangeRate");
  const subtotalBolivaresElement = document.getElementById("subtotalBolivares");
  const paymentInfo = document.getElementById("payment-info");
  const paymentLogo = document.getElementById("payment-logo");
  const paymentDetails = document.getElementById("payment-details");

  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
  });

  subtotalElement.innerText = `Subtotal: $${subtotal.toFixed(2)}`;
  const paymentMethod = document.getElementById("payment").value;

  if (paymentMethod === "Divisas" || paymentMethod === "Zelle") {
    const igtf = subtotal * 0.03;
    const total = subtotal + igtf;
    igtfElement.style.display = "block";
    totalElement.style.display = "block";
    subtotalBolivaresElement.style.display = "none";
    exchangeRateElement.style.display = "none";
    igtfElement.innerText = `IGTF: $${igtf.toFixed(2)}`;
    totalElement.innerText = `Total: $${total.toFixed(2)}`;

    if (paymentMethod === "Zelle") {
      console.log("Z");

      const zelleNombre = document
        .getElementById("zelle_nombre")
        .textContent.trim();
      console.log(zelleNombre);
      const zelleEmail = document.getElementById("zelle").textContent.trim();
      console.log(zelleEmail);

      paymentInfo.style.display = "block";
      paymentLogo.src =
        "data:image/png;base64,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"; // Reemplaza con la ruta de la imagen del logo de Zelle
      paymentDetails.innerHTML = `
        <p>Nombre: ${zelleNombre}</p>
        <p>Correo: ${zelleEmail}</p>
      `;
    } else {
      paymentInfo.style.display = "none";
    }
  } else if (
    paymentMethod === "Pago Móvil" ||
    paymentMethod === "Punto de Venta"
  ) {
    const precioDolar = await obtenerPrecioDolar();
    const subtotalEnBolivares = subtotal * precioDolar;
    subtotalBolivaresElement.style.display = "block";
    exchangeRateElement.style.display = "block";
    subtotalBolivaresElement.innerText = `Total en Bs: ${subtotalEnBolivares.toFixed(
      2
    )}`;
    exchangeRateElement.innerText = `Tasa de Cambio: ${precioDolar.toFixed(2)}`;
    igtfElement.style.display = "none";
    totalElement.style.display = "none";

    if (paymentMethod === "Pago Móvil") {
      const banco = document.getElementById("banco").textContent.trim();
      const ciRif = document.getElementById("ci_rif").textContent.trim();
      const telefono = document.getElementById("pagomovil").textContent.trim();

      paymentInfo.style.display = "block";
      paymentLogo.src =
        "data:image/png;base64,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"; // Reemplaza con la ruta de la imagen del logo del banco
      paymentDetails.innerHTML = `
        <p>Banco: ${banco}</p>
        <p>Teléfono: ${telefono}</p>
        <p>Cédula/RIF: ${ciRif}</p>
      `;
    } else {
      paymentInfo.style.display = "none";
    }
  } else {
    igtfElement.style.display = "none";
    totalElement.style.display = "none";
    exchangeRateElement.style.display = "none";
    subtotalBolivaresElement.style.display = "none";
    paymentInfo.style.display = "none";
  }
}

function validateAndSubmit() {
  console.log("1");
  const name = document.getElementById("name").value;
  console.log("2");
  const ci = document.getElementById("ci").value;
  console.log("3");
  const phone = document.getElementById("telf").value;
  console.log("4");

  if (!name || !ci || !phone) {
    alert("Por favor, complete todos los campos de facturación.");
    return;
  }

  generateWhatsAppLink(name, ci, phone);
}

async function generateWhatsAppLink(name, ci, phone) {
  const numws = document.getElementById("pedido").textContent.trim();
  console.log(numws); // Imprime el número de pedido: 584123081593
  const paymentMethod = document.getElementById("payment").value;
  let phoneNumber = numws;

  console.log("a");
  let message = "*Orden:*%0a*............................................*%0a";
  cart.forEach((item) => {
    message += `${item.quantity} ${item.name} $${(
      item.price * item.quantity
    ).toFixed(2)}`;
    message += `%0a`;
  });
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  message += `*............................................*%0a*SUBTOTAL: $${subtotal.toFixed(
    2
  )}*%0a*............................................*%0a`;
  message += `*Método de Pago: ${paymentMethod}*%0a*............................................*%0a`;

  if (paymentMethod === "Divisas" || paymentMethod === "Zelle") {
    const igtf = subtotal * 0.03;
    const total = subtotal + igtf;
    message += `*IGTF: $${igtf.toFixed(2)}*%0a`;
    message += `*Total: $${total.toFixed(2)}*%0a`;
  } else if (
    paymentMethod === "Pago Móvil" ||
    paymentMethod === "Punto de Venta"
  ) {
    const precioDolar = await obtenerPrecioDolar();
    const subtotalEnBolivares = subtotal * precioDolar;
    message += `*Tasa de Cambio: ${precioDolar.toFixed(2)}*%0a`;
    message += `*Total en Bs: ${subtotalEnBolivares.toFixed(2)}*%0a`;
  }

  message += `*Nombre: ${name}*%0a*CI: ${ci}*%0a*Teléfono: ${phone}*%0a`;

  const whatsappLink = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}`;
  window.open(whatsappLink, "_blank");
}

// Event listeners para el modal
const openModalBtn = document.querySelector(
  "button[onclick='showBillingModal()']"
);
if (openModalBtn) {
  openModalBtn.addEventListener("click", showBillingModal);
}
const closeModalBtn = document.querySelector(".close");
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeBillingModal);
}
window.addEventListener("click", (event) => {
  const modal = document.getElementById("billingModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
document
  .getElementById("billingForm")
  .addEventListener("submit", handleBillingFormSubmit);
