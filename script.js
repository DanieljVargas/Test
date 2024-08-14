let cart = [];

// const numws = document.getElementById("ws");
// const numText = numws.textContent;
// const phoneNumber = numText;
// console.log(phoneNumber); // Imprime el número: 584129834755

async function obtenerPrecioDolar() {
  const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
  const data = await response.json();
  const precioDolar = data.promedio;
  return precioDolar;
}

function addToCart(button) {
  const productElement = button.closest(".elementor-element-9c3be3c");
  const name = productElement
    .querySelector(".elementor-image-box-title")
    .textContent.trim();
  const priceText = productElement
    .querySelector(".elementor-image-box-description")
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

  cartSummary.innerText = `Productos: ${totalQuantity} - Total: $${subtotal.toFixed(
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
      paymentInfo.style.display = "block";
      paymentLogo.src =
        "data:image/png;base64,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"; // Reemplaza con la ruta de la imagen del logo de Zelle
      paymentDetails.innerHTML = `
        <p>Correo: zelle@ejemplo.com</p>
        <p>Teléfono: +1 234-567-8900</p>
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
      paymentInfo.style.display = "block";
      paymentLogo.src =
        "data:image/png;base64,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"; // Reemplaza con la ruta de la imagen del logo del banco
      paymentDetails.innerHTML = `
        <p>Banco: Banco Ejemplo</p>
        <p>Teléfono: +58 412-3456789</p>
        <p>Cédula: V-12345678</p>
        <p>Referencia: 987654321</p>
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
  const name = document.getElementById("name").value;
  const ci = document.getElementById("ci").value;
  const phone = document.getElementById("phone").value;

  if (!name || !ci || !phone) {
    alert("Por favor, complete todos los campos de facturación.");
    return;
  }

  generateWhatsAppLink(name, ci, phone);
}

async function generateWhatsAppLink(name, ci, phone) {
  const paymentMethod = document.getElementById("payment").value;
  let phoneNumber;

  function getPhoneNumber() {
    const headingElement = document.getElementById("pedido");
    if (headingElement) {
      const phoneNum = headingElement.textContent;
      return phoneNum;
    } else {
      console.error("Element with ID 'pedido' not found");
      return null;
    }
  }
  phoneNumber = await getPhoneNumber();
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

// Obtener el número de WhatsApp del encabezado y asignarlo a phoneNumber
const headingElement = document.querySelector(".elementor-heading-title");
const headingText = headingElement ? headingElement.textContent : "";
const phoneNumber = headingText;

console.log(phoneNumber); // Imprime el número: 584129834755
