// Dữ liệu quảng cáo với ảnh đẹp từ Unsplash
export const adData = [
  {
    id: 1,
    title: "Shopee - Mua Sắm Online",
    description: "Khuyến mãi 12.12 - Giảm giá đến 90%, Freeship 0đ toàn quốc. Hàng triệu sản phẩm chính hãng.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop&q=80",
    link: "https://shopee.vn",
    color: "bg-gradient-to-br from-orange-500 to-red-600",
    category: "ecommerce"
  },
  {
    id: 2,
    title: "Grab - Đi Chỗ Nào Cũng Có",
    description: "Đặt xe nhanh chóng, giao đồ ăn tận nơi, thanh toán tiện lợi. Tải app ngay!",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=250&fit=crop&q=80",
    link: "https://grab.com/vn",
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    category: "transport"
  },
  {
    id: 3,
    title: "VinFast - Xe Điện Thông Minh",
    description: "Trải nghiệm xe điện VinFast với công nghệ tiên tiến. Đặt lịch lái thử miễn phí.",
    image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=250&fit=crop&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop&q=80",
    link: "https://vinfastauto.com",
    color: "bg-gradient-to-br from-blue-600 to-cyan-700",
    category: "automotive"
  },
  {
    id: 4,
    title: "Tiki - Đọc Sách Online",
    description: "Hàng ngàn đầu sách hay, giao hàng 2h, thanh toán COD. Giảm 50% cho thành viên mới.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop&q=80",
    link: "https://tiki.vn",
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    category: "books"
  },
  {
    id: 5,
    title: "Techcombank - Ngân Hàng Số",
    description: "Mở tài khoản online 5 phút, chuyển tiền 24/7, lãi suất tiết kiệm hấp dẫn.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop&q=80",
    link: "https://techcombank.com.vn",
    color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    category: "banking"
  }
]

// Cấu hình carousel
export const carouselConfig = {
  autoPlayInterval: 8000, // 8 giây - phù hợp hơn cho user đọc
  transitionDuration: 500, // 0.5 giây - mượt mà hơn
  showProgressBar: true,
  showDots: true,
  showCounter: true,
  enablePause: true,
  pauseOnHover: true, // tạm dừng khi hover
  showArrows: true // thêm nút điều hướng
}