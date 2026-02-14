export interface Order {
  uid: string;
  id: string;
  customer: string;
  date: string;
  status: string;
  total: string;
}


export interface OrderTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  counts: {
    all: number;
    pending: number;
    success: number;
    failed: number;
  };
}

export interface OrderTableProps {
  orders: Order[];
}
