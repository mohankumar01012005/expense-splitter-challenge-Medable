import BalanceView from './components/BalanceView';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import PeopleManager from './components/PeopleManager';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col">
      <header className="bg-white/10 backdrop-blur-md p-4 sm:p-6 text-center border-b border-white/20">
        <h1 className="text-white text-2xl sm:text-4xl font-bold drop-shadow-lg">💰 Expense Splitter</h1>
      </header>

      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8" >
          <div className="w-full flex flex-col gap-6">
            <PeopleManager />
            <ExpenseForm />
          </div>

          <div className="w-full flex flex-col gap-6">
            <BalanceView />
            <ExpenseList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
