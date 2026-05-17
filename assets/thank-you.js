(function () {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('id') || '';

  const orderIdBox = document.getElementById('orderIdBox');
  const successCopy = document.getElementById('successCopy');

  if (orderId) {
    if (orderIdBox) orderIdBox.textContent = orderId;

    if (successCopy) {
      successCopy.innerHTML = `Order Successfully Placed! 🎉 Your Order ID is <b>${orderId}</b>. We have received your order details and your GoTyme payment receipt. Our team will verify the transaction and ship out your peptides shortly. A confirmation email has been sent!`;
    }
  } else {
    if (successCopy) {
      successCopy.innerHTML = `Order Successfully Placed! 🎉 Your Order ID is <b>[missing]</b>. We have received your order details and your GoTyme payment receipt. Our team will verify the transaction and ship out your peptides shortly. A confirmation email has been sent!`;
    }
  }
})();

