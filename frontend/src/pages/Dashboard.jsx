import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, LogOut } from 'lucide-react';

function Dashboard() {
    const { token, logout } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [filterCategory, setFilterCategory] = useState('All');

    const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'];

    const fetchExpenses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/expenses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(res.data);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [token]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/expense', 
                { title, amount: Number(amount), category },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTitle('');
            setAmount('');
            fetchExpenses();
        } catch (error) {
            console.error("Failed to add expense", error);
        }
    };

    const filteredExpenses = filterCategory === 'All' 
        ? expenses 
        : expenses.filter(exp => exp.category === filterCategory);

    const totalExpense = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="auth-title" style={{ textAlign: 'left', marginBottom: '0' }}>Prime Event Expenses</h1>
                    <p className="auth-subtitle" style={{ textAlign: 'left', marginBottom: '0', marginTop: '0.25rem' }}>Track and manage your finances</p>
                </div>
                <button onClick={logout} className="btn-logout"><LogOut size={16} /> Logout</button>
            </header>

            <div className="summary-cards">
                <div className="summary-card">
                    <div className="summary-title">Total Expenses</div>
                    <div className="summary-value">${totalExpense.toFixed(2)}</div>
                </div>
                <div className="summary-card">
                    <div className="summary-title">Total Records</div>
                    <div className="summary-value">{filteredExpenses.length}</div>
                </div>
            </div>

            <div className="main-content">
                <div className="panel">
                    <h2 className="panel-title"><PlusCircle size={20} /> Add New Expense</h2>
                    <form onSubmit={handleAddExpense}>
                        <div className="form-group">
                            <label className="form-label">What did you spend on?</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="E.g., Groceries"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Amount</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="0.01"
                                step="0.01"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select 
                                className="form-input" 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Add Expense
                        </button>
                    </form>
                </div>

                <div className="panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className="panel-title" style={{ marginBottom: 0 }}>Recent Expenses</h2>
                        <div className="filter-controls" style={{ marginBottom: 0 }}>
                            <select 
                                className="filter-select"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="All">All Categories</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="expense-list">
                        {filteredExpenses.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                                No expenses found. Try adding one!
                            </div>
                        ) : (
                            filteredExpenses.map(expense => (
                                <div key={expense._id} className="expense-item">
                                    <div className="expense-info">
                                        <div className="expense-title">{expense.title}</div>
                                        <div className="expense-meta">
                                            <span className={`badge bg-${expense.category}`}>{expense.category}</span>
                                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className={`expense-amount amount-${expense.category}`}>
                                        ${expense.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
