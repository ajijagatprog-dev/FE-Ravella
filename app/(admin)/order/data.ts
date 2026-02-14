export interface Order {
  uid: string;
  id: string;
  customer: string;
  date: string;
  status: string;
  total: string;
}

export const allOrders: Order[] = [
  {
    uid: "1",
    id: "#RVL-4921",
    customer: "Fadil",
    date: "Oct 24, 2023",
    status: "Success",
    total: "Rp. 2.000.000",
  },
  {
    uid: "2",
    id: "#RVL-4922",
    customer: "Anan",
    date: "Oct 24, 2023",
    status: "Pending",
    total: "Rp. 3.500.000",
  },
];
