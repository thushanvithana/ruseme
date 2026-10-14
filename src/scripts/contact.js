// Draft a message with the visitor's email application; no server credentials required.
document.querySelectorAll('form[data-contact-email]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent(data.get('subject') || 'Portfolio enquiry');
    const body = encodeURIComponent(`${data.get('message')}\n\nFrom: ${data.get('name')}\nEmail: ${data.get('email')}`);
    window.location.href = `mailto:${form.dataset.contactEmail}?subject=${subject}&body=${body}`;
  });
});
