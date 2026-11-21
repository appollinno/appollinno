// Demo-only order history shown on the account page. In the mock auth/order
// system, real orders placed via /checkout are not tied to a signed-in
// account yet (there's no persistent database — see
// supabase/migrations/0001_init.sql for the real `orders` table). These
// seed rows let the Order History UI be exercised end-to-end.
export const MOCK_ORDER_HISTORY = [
  {
    orderNumber: "APC-482913",
    date: "2026-10-02",
    status: "Delivered",
    totalCents: 3100,
    items: "Ethiopia Yirgacheffe (250g), Signature House Blend (250g)",
  },
  {
    orderNumber: "APC-471028",
    date: "2026-09-14",
    status: "Delivered",
    totalCents: 1750,
    items: "Kenya Nyeri AA (250g)",
  },
  {
    orderNumber: "APC-459876",
    date: "2026-08-22",
    status: "Delivered",
    totalCents: 4600,
    items: "Colombia Huila (500g), Midnight Espresso Blend (250g)",
  },
];
