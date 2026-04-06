export default function TopBanner() {
  const items = [
    "FREE SHIPPING ON ORDERS OVER 1,500 EGP",
    "AUTHENTIC PERFUMES GUARANTEED",
    "CASH ON DELIVERY AVAILABLE",
  ];

  return (
    <div className="bg-gray-200 overflow-hidden pt-3">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items].map((text, i) => (
          <span key={i} className="mx-8 flex items-center gap-2">
            ⭐ {text}
          </span>
        ))}
      </div>
    </div>
  );
}