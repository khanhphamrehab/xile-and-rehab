(function () {
  'use strict';
  const groups = Array.from(document.querySelectorAll('.skin-dropdown'));
  let hovered = null;
  let pinned = null;
  function renderMenus() {
    const current = hovered || pinned;
    groups.forEach(group => {
      const open = group === current;
      group.querySelector('.skin-dropdown-trigger').setAttribute('aria-expanded', String(open));
      group.querySelector('.skin-dropdown-panel').hidden = !open;
    });
  }
  groups.forEach(group => {
    const trigger = group.querySelector('.skin-dropdown-trigger');
    group.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') { hovered = group; renderMenus(); }
    });
    group.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse') return;
      if (group.contains(document.activeElement) && document.activeElement.matches(':focus-visible')) pinned = group;
      hovered = null;
      renderMenus();
    });
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      hovered = null;
      pinned = open ? null : group;
      renderMenus();
    });
    group.addEventListener('focusout', event => {
      if (!group.contains(event.relatedTarget) && pinned === group) { pinned = null; renderMenus(); }
    });
    group.addEventListener('keydown', event => {
      if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
        event.preventDefault(); hovered = null; pinned = null; renderMenus(); trigger.focus();
      }
    });
  });
  renderMenus();

  const form = document.querySelector('.booking-form');
  if (form) {
    const select = form.querySelector('[name="service"]');
    const submit = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[role="status"]');
    const services = new Map();
    select.querySelectorAll('optgroup').forEach(group => {
      const category = group.label.startsWith('Sport') ? 'Sport Therapy RBK' : group.label.startsWith('Gội') ? 'Gội dưỡng sinh' : 'Chăm sóc da';
      group.querySelectorAll('option').forEach(option => {
        const split = option.textContent.lastIndexOf(' — ');
        services.set(option.value, { name: option.textContent.slice(0, split), priceLabel: option.textContent.slice(split + 3), category });
      });
    });
    function say(text) {
      status.replaceChildren();
      if (text) { const p = document.createElement('p'); p.className = 'status'; p.textContent = text; status.append(p); }
    }
    function resetMessage() { say(''); form.querySelector('.message-ready')?.remove(); }
    select.addEventListener('change', resetMessage);
    document.addEventListener('click', event => {
      const link = event.target.closest?.('a[data-service]');
      if (link && services.has(link.dataset.service)) { select.value = link.dataset.service; resetMessage(); }
    });
    function showMessage(text) {
      const box = document.createElement('div'); box.className = 'message-ready';
      const label = document.createElement('label'); label.htmlFor = 'message'; label.textContent = 'Nội dung để gửi Xile';
      const area = document.createElement('textarea'); area.id = 'message'; area.readOnly = true; area.value = text;
      const copy = document.createElement('button'); copy.type = 'button'; copy.className = 'copy-button'; copy.textContent = 'Sao chép tin nhắn';
      copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(text); say('Đã sao chép. Mở Facebook và dán tin nhắn để gửi cho Xile.'); }
        catch { area.focus(); area.select(); say('Bạn có thể chọn và sao chép nội dung trong ô bên dưới, rồi gửi qua Facebook.'); }
      });
      const link = document.createElement('a'); link.className = 'button'; link.href = 'https://www.facebook.com/xilebeautyspa/'; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Mở Facebook của Xile ↗';
      box.append(label, area, copy, link); form.append(box);
    }
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (submit.disabled) return;
      resetMessage();
      form.querySelectorAll('.error').forEach(node => node.remove());
      ['name', 'phone', 'consent'].forEach(key => {
        const field = form.elements.namedItem(key); field.setAttribute('aria-invalid', 'false'); field.removeAttribute('aria-describedby');
      });
      const checked = window.XileBookingUtils.validateBooking({ name: form.elements.namedItem('name').value, phone: form.elements.namedItem('phone').value, consent: form.elements.namedItem('consent').checked });
      const entries = Object.entries(checked.errors);
      if (entries.length) {
        entries.forEach(([key, text]) => {
          const field = form.elements.namedItem(key);
          field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', key + '-error');
          const p = document.createElement('p'); p.className = 'error'; p.id = key + '-error'; p.textContent = text;
          (key === 'consent' ? field.closest('label') : field).insertAdjacentElement('afterend', p);
        });
        form.elements.namedItem(entries[0][0]).focus(); return;
      }
      const text = window.XileBookingUtils.composeMessage(checked, services.get(select.value));
      const endpoint = window.XILE_BOOKING_API_URL;
      if (!endpoint) {
        showMessage(text);
        say('Yêu cầu đã được soạn. Bạn sao chép và gửi qua Facebook để Xile tiếp nhận nhé Thông tin chưa được gửi tự động.');
        return;
      }
      submit.disabled = true;
      submit.firstChild.textContent = 'Đang gửi…';
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: checked.name, phone: checked.phone, serviceId: select.value, consent: true, source: 'xile-beauty-rehab' }), signal: controller.signal });
        if (!response.ok) throw new Error('Booking request failed');
        say('Xile đã nhận yêu cầu. Lịch hẹn sẽ được xác nhận sau khi trao đổi trực tiếp với bạn.');
      } catch { say('Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi Xile qua 0909 722 408.'); }
      finally { clearTimeout(timer); submit.disabled = false; submit.firstChild.textContent = 'Tiếp tục đặt lịch'; }
    });
  }

  const activity = document.querySelector('.footer-activity');
  if (activity) {
    const path = activity.querySelector('path');
    path.removeAttribute('style'); path.setAttribute('pathLength', '1');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animation;
    function draw() {
      if (reduced.matches || !path.animate) return;
      animation?.cancel();
      animation = path.animate([{ strokeDasharray: '1', strokeDashoffset: '1', opacity: 0 }, { strokeDasharray: '1', strokeDashoffset: '0', opacity: 1 }], { duration: 600, easing: 'linear' });
    }
    activity.addEventListener('mouseenter', draw);
    activity.addEventListener('mouseleave', () => animation?.cancel());
    reduced.addEventListener('change', () => { if (reduced.matches) animation?.cancel(); });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { draw(); observer.disconnect(); }
      });
      observer.observe(activity);
    }
  }
})();
