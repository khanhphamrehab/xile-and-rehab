(function (root) {
  'use strict';
  function validateBooking(values) {
    const name = String(values.name || '').trim();
    const phone = String(values.phone || '').replace(/[\s().-]/g, '');
    const errors = {};
    if (name.length < 2) errors.name = 'Bạn nhập tên từ 2 ký tự nhé';
    if (!/^(0[35789]\d{8}|\+84[35789]\d{8})$/.test(phone)) errors.phone = 'Vui lòng nhập số điện thoại Việt Nam hợp lệ.';
    if (!values.consent) errors.consent = 'Vui lòng đồng ý để Xile liên hệ về lịch hẹn.';
    return { name, phone, errors };
  }
  function composeMessage(values, service) {
    const choice = service
      ? 'tìm hiểu ' + service.name + ' (' + service.priceLabel + ') — ' + service.category
      : 'được tư vấn dịch vụ tại Xile / RBK';
    return 'Chào Xile, mình là ' + values.name + '. Mình muốn ' + choice + '. Số điện thoại: ' + values.phone + '. Xile tư vấn giúp mình khung giờ phù hợp nhé';
  }
  const api = { validateBooking, composeMessage };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.XileBookingUtils = api;
})(typeof window !== 'undefined' ? window : globalThis);
