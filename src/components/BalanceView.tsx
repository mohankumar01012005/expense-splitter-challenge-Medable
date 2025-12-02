import { initialPeople } from '../initialData';

function BalanceView() {
  const people = initialPeople;

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        💰 Balances
      </h2>

      <div className="flex justify-between items-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg mb-6">
        <span>Total Group Spending:</span>
        <strong className="text-2xl">$0.00</strong>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-600 my-2 text-lg">Individual Balance</h3>
        {people.map((person) => (
          <div
            key={person}
            className="flex justify-between items-center px-3 py-3 mb-2 rounded-md transition-all hover:translate-x-1 bg-gray-100 border border-gray-300"
          >
            <span className="font-medium text-gray-800">{person}</span>
            <span className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">settled up</span>
              <strong className="text-gray-600 text-lg">$0.00</strong>
            </span>
          </div>
        ))}
      </div>

      <div className="text-center py-8 bg-green-100 rounded-lg text-green-900 font-medium">
        <p>✅ All balances are settled!</p>
      </div>
    </div>
  );
}

export default BalanceView;
