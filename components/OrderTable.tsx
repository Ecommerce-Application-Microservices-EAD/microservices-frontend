import { Order } from "@/app/types/Order";


interface OrderTableProps {
  order: Order[];
}

export const OrderTable = ({ order }: OrderTableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 mt-6">
      <table className="min-w-full table-auto text-sm text-gray-700 dark:text-gray-300">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <th className="px-6 py-3 text-left font-semibold">ID</th>
            <th className="px-6 py-3 text-left font-semibold">User ID</th>
            <th className="px-6 py-3 text-left font-semibold">Order Number</th>
            <th className="px-6 py-3 text-left font-semibold">SKU Code</th>
            <th className="px-6 py-3 text-left font-semibold">Price</th>
            <th className="px-6 py-3 text-left font-semibold">Quantity</th>
            <th className="px-6 py-3 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {order.length > 0 ? (
            order.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.userId}</td>
                <td className="px-6 py-4">{order.orderNumber}</td>
                <td className="px-6 py-4">{order.skuCode}</td>
                <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                  ${order.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">{order.quantity}</td>
                <td className="px-6 py-4 capitalize">
                  <span
                    className={`${
                      order.status === "completed"
                        ? "text-green-600 dark:text-green-400"
                        : order.status === "pending"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                    } font-semibold`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-600 dark:text-gray-300">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
