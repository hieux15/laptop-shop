export default function CartPage() {
  const cartItems = [
    {
      id: 1,
      name: "Laptop Dell Inspiron 15",
      price: 15000000,
      quantity: 1,
    },
    {
      id: 2,
      name: "MacBook Air M1",
      price: 22000000,
      quantity: 2,
    },
  ];

  const total = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h1>Giỏ hàng</h1>

      {cartItems.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            borderBottom: "1px solid #ddd",
          }}
        >
          <span>{item.name}</span>
          <span>x{item.quantity}</span>
          <span>
            {(item.price * item.quantity).toLocaleString()} đ
          </span>
        </div>
      ))}

      <h2>
        Tổng tiền: {total.toLocaleString()} đ
      </h2>

      <button style={{ marginTop: 20 }}>
        Đặt hàng
      </button>
    </div>
  );
}
