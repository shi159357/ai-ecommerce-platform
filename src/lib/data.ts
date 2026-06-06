export interface PlatformStats {
  mode: 'dropshipping' | 'amazon' | 'social' | 'all';
  revenue: { today: number; yesterday: number; week: number; month: number };
  orders: { total: number; pending: number; shipped: number; returned: number };
  products: { active: number; pending: number; outOfStock: number };
  profit: { gross: number; net: number; margin: number };
  aiMetrics: { selections: number; listings: number; replies: number; accuracy: number };
  systemHealth: { uptime: number; lastUpdate: string; errors: number; selfHeals: number };
}

export interface Order {
  id: string; product: string; platform: string; amount: number; status: string; time: string;
}

export interface Product {
  id: string; name: string; platform: string; price: number; cost: number; stock: number; aiScore: number; status: string;
}

export const mockStats: PlatformStats = {
  mode: 'all',
  revenue: { today: 12850, yesterday: 11320, week: 87450, month: 352800 },
  orders: { total: 2847, pending: 43, shipped: 2610, returned: 12 },
  products: { active: 568, pending: 24, outOfStock: 8 },
  profit: { gross: 352800, net: 98784, margin: 28 },
  aiMetrics: { selections: 12240, listings: 3560, replies: 8920, accuracy: 94.3 },
  systemHealth: { uptime: 99.97, lastUpdate: '2026-06-07 02:30:00', errors: 0, selfHeals: 3 },
};

export const recentOrders: Order[] = [
  { id: '#ORD-8472', product: '无线降噪耳机 Pro', platform: '独立站', amount: 299, status: '已发货', time: '3分钟前' },
  { id: '#ORD-8471', product: '智能家居控制中枢', platform: 'Amazon', amount: 459, status: '待发货', time: '12分钟前' },
  { id: '#ORD-8470', product: '便携式迷你投影仪', platform: '独立站', amount: 199, status: '已发货', time: '28分钟前' },
  { id: '#ORD-8469', product: 'AI翻译耳机', platform: 'TikTok Shop', amount: 159, status: '已完成', time: '45分钟前' },
  { id: '#ORD-8468', product: '磁吸充电宝 10000mAh', platform: '独立站', amount: 89, status: '已发货', time: '1小时前' },
];

export const topProducts: Product[] = [
  { id: 'P-001', name: '无线降噪耳机 Pro', platform: 'Dropshipping', price: 299, cost: 98, stock: 1250, aiScore: 96, status: '热卖' },
  { id: 'P-002', name: '智能家居控制中枢', platform: 'Amazon FBA', price: 459, cost: 210, stock: 340, aiScore: 93, status: '热卖' },
  { id: 'P-003', name: '便携式迷你投影仪', platform: '社交媒体', price: 199, cost: 75, stock: 890, aiScore: 91, status: '热卖' },
  { id: 'P-004', name: 'AI翻译耳机', platform: 'Dropshipping', price: 159, cost: 55, stock: 2100, aiScore: 89, status: '正常' },
  { id: 'P-005', name: '磁吸充电宝 10000mAh', platform: '社交媒体', price: 89, cost: 28, stock: 3400, aiScore: 87, status: '正常' },
];

export const revenueChart = [
  { date: '6/1', revenue: 48200, profit: 13496 }, { date: '6/2', revenue: 51300, profit: 14364 },
  { date: '6/3', revenue: 46800, profit: 13104 }, { date: '6/4', revenue: 55200, profit: 15456 },
  { date: '6/5', revenue: 49100, profit: 13748 }, { date: '6/6', revenue: 53400, profit: 14952 },
  { date: '6/7', revenue: 48700, profit: 13636 },
];

export const platformBreakdown = [
  { name: '独立站', value: 45, color: '#3B82F6' },
  { name: 'Amazon', value: 30, color: '#F59E0B' },
  { name: 'TikTok', value: 15, color: '#EF4444' },
  { name: 'Instagram', value: 10, color: '#8B5CF6' },
];
