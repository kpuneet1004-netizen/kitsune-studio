(() => {
  const fee = 45000;
  const money = new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
  document.querySelector('#amount-one').textContent = money.format(fee*.5);
  document.querySelector('#amount-two').textContent = money.format(fee*.2);
  document.querySelector('#amount-three').textContent = money.format(fee*.3);
  document.querySelector('#year').textContent = new Date().getFullYear();
  const toggle = document.querySelector('#show-terms');
  const preview = document.querySelector('#terms-preview');
  toggle.addEventListener('click', () => {
    const opening = preview.hidden;
    preview.hidden = !opening;
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.innerHTML = opening ? 'Hide key terms <span>−</span>' : 'Preview key terms <span>＋</span>';
  });
  document.querySelector('#preview-submit').addEventListener('click', () => {
    const accepted = document.querySelector('#accept-check').checked;
    const name = document.querySelector('#signer-name').value.trim();
    const email = document.querySelector('#signer-email').value.trim();
    const message = document.querySelector('#form-message');
    if (!accepted || !name || !email) {
      message.textContent = 'For this preview, tick the acknowledgement and enter a name and email to see the next step.';
      return;
    }
    message.textContent = 'Preview complete. In production, the server would verify the client, issue an OTP, capture the acceptance event, and generate a tamper-evident PDF. No signature or agreement has been created.';
  });
})();