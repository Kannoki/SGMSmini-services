import { DashboardPanel } from './DashboardPanel';
import { MaterialSymbol } from './MaterialSymbol';

type Order = {
  id: string;
  total: string;
  dateTime: string;
  status: 'paid' | 'pending';
};

type RecentOrdersCardProps = {
  orders: Order[];
};

export function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  return (
    <DashboardPanel className="h-full p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Recent orders</h3>
        <button type="button" className="flex items-center gap-1 rounded-md border border-indigo-300/20 px-2 py-1 text-xs text-slate-300">
          <MaterialSymbol name="calendar_today" className="text-sm" />
          Jan 2024
          <MaterialSymbol name="expand_more" className="text-sm" />
        </button>
      </div>

      <div className="grid grid-cols-[1.2fr_1.1fr_0.8fr_0.8fr] gap-3 border-b border-indigo-300/10 pb-2 text-xs text-slate-400">
        <span>Order</span>
        <span>Date</span>
        <span>Status</span>
        <span className="text-right">Total</span>
      </div>

      <div className="mt-2 space-y-1.5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-[1.2fr_1.1fr_0.8fr_0.8fr] items-center gap-3 rounded-md px-2 py-2 text-sm text-slate-200 odd:bg-slate-900/25"
          >
            <span>{order.id}</span>
            <span className="text-slate-300">{order.dateTime}</span>
            <span
              className={[
                'inline-flex w-fit rounded px-1.5 py-0.5 text-[10px] font-medium',
                order.status === 'paid' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300',
              ].join(' ')}
            >
              {order.status}
            </span>
            <span className="text-right font-medium text-slate-100">{order.total}</span>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

