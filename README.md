# Xile Beauty Spa & RBK — bản GitHub Pages

Bản đã duyệt, gồm giao diện hiện tại, hình ảnh, font tiếng Việt, thanh xổ xuống, hiệu ứng ô dịch vụ, icon động, form đặt lịch và JSON-LD DaySpa.

## Đưa lên GitHub Pages

1. Giải nén file ZIP.
2. Mở repository trên GitHub. Chọn **Add file → Upload files**.
3. Tải **toàn bộ nội dung bên trong** lên: `index.html`, thư mục `assets`, `README.md` và `.nojekyll`. Không tải nguyên file ZIP. Không đặt thêm một thư mục bọc ngoài.
4. Commit changes.
5. Vào **Settings → Pages**. Chọn **Deploy from a branch**; branch `main` (hoặc nhánh bạn vừa upload), thư mục **/ (root)** rồi Save.
6. Chờ GitHub báo deploy thành công, mở đường dẫn được hiển thị ở trang Pages.

`index.html` phải nằm ngay ở thư mục gốc của repository, cùng cấp với `assets`. Trang dùng đường dẫn tương đối nên chạy dưới đường dẫn repository hoặc tên miền riêng. Không cần npm, Node.js hay build lại để deploy.

Nếu cập nhật repository cũ, thay `index.html` và toàn bộ `assets` bằng bản trong ZIP này. Dùng Ctrl+F5 để nạp lại nếu còn thấy bản cũ.

## Dùng tên miền riêng

Trong Settings → Pages, nhập tên miền đã mua vào Custom domain và cấu hình DNS theo hướng dẫn GitHub. Sau khi DNS được xác nhận, bật Enforce HTTPS.

## Cập nhật địa chỉ website cho SEO

JSON-LD trong `<head>` giữ nguyên thông tin bạn đã gửi. Hiện canonical, Open Graph URL và các trường `url`, `image`, `logo` trong JSON-LD vẫn dùng địa chỉ trang đang được duyệt trên ChatGPT Sites.

Khi có địa chỉ GitHub Pages hoặc tên miền chính thức, chỉnh các URL này trong `index.html` sang địa chỉ mới. Với repository Pages, đường dẫn ảnh phải có cả tên repository: ví dụ `https://TEN-TK.github.io/TEN-REPO/assets/images/xile-logo.png`.

## Form đặt lịch

Mặc định form kiểm tra tên, số điện thoại, sự đồng ý rồi **soạn tin nhắn** để khách sao chép và gửi qua Facebook. Form chưa gửi tự động và chưa tự xác nhận lịch hẹn.

Nếu đã có API/webhook nhận đặt lịch, điền URL HTTPS vào `window.XILE_BOOKING_API_URL` trong `assets/config.js`. API nhận POST JSON với `name`, `phone`, `serviceId`, `consent`, `source`. Cần cho phép CORS từ địa chỉ website của bạn. Không đưa API key hoặc mật khẩu vào file công khai.

## Cấu trúc

- `index.html`: trang chính, metadata và JSON-LD
- `assets/site.css`: giao diện và hiệu ứng
- `assets/images/`: hình ảnh, logo, favicon
- `assets/fonts/`: font tiếng Việt và Calgary đã chỉnh dấu nặng
- `assets/app.js`: thanh xổ xuống, form, chọn dịch vụ, icon động
- `assets/booking-utils.js`: kiểm tra form và soạn tin nhắn
- `assets/config.js`: cấu hình API đặt lịch nếu có
- `.nojekyll`: dùng bản tĩnh trực tiếp
