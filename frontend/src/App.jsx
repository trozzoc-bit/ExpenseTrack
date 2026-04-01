import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    comment: "",
  });
  const [error, setError] = useState("");

  const categories = [
    "Health",
    "Groceries",
    "Entertainment & Going Out",
    "Digital Services",
    "Shopping",
    "Beauty",
    "Transport",
    "Travel",
    "Accommodation",
  ];

  const categoryColors = {
    Health: "#ff5c8a",
    Groceries: "#59d98e",
    "Entertainment & Going Out": "#6c63ff",
    "Digital Services": "#6f7cff",
    Shopping: "#ffb020",
    Beauty: "#b084f5",
    Transport: "#ffd166",
    Travel: "#4ecdc4",
    Accommodation: "#8da9c4",
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Could not load expenses.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const resetForm = () => {
    setForm({
      title: "",
      category: "",
      amount: "",
      date: "",
      comment: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.category || !form.amount || !form.date) {
      setError("Please complete all required fields.");
      return;
    }

    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    const expenseData = {
      title: form.title,
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
      description: form.comment,
    };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/expenses/${editingId}`,
          expenseData
        );
      } else {
        await axios.post("http://localhost:5000/api/expenses", expenseData);
      }

      resetForm();
      setError("");
      fetchExpenses();
      setCurrentView("dashboard");
    } catch (err) {
      console.error("Error saving expense:", err);
      setError("Could not save expense.");
    }
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      comment: expense.description || "",
    });
    setEditingId(expense._id);
    setError("");
    setCurrentView("add");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      if (editingId === id) {
        resetForm();
      }
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Could not delete expense.");
    }
  };

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  }, [expenses]);

  const groupedExpenses = useMemo(() => {
    const sorted = [...expenses].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return sorted.reduce((groups, expense) => {
      const dateKey = expense.date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(expense);
      return groups;
    }, {});
  }, [expenses]);

  return (
    <div className="app-shell">
      <div className="mobile-frame">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              {currentView === "dashboard" ? "Dashboard" : "New Entry"}
            </p>
            <h1 className="brand-title">Fluid Ledger</h1>
          </div>
        </header>

        {currentView === "dashboard" ? (
          <main className="view-content">
            <section className="hero-card">
              <p className="section-label">Total Spent</p>
              <h2 className="balance-amount">${totalSpent.toFixed(2)}</h2>
              <button
                className="primary-button"
                onClick={() => {
                  resetForm();
                  setCurrentView("add");
                }}
              >
                Add Expense
              </button>
            </section>

            <section className="summary-card">
              <h3>Quick Summary</h3>
              <p>Total entries: {expenses.length}</p>
            </section>

            <section className="expenses-section">
              {Object.keys(groupedExpenses).length === 0 ? (
                <p className="empty-state">No expenses yet.</p>
              ) : (
                Object.entries(groupedExpenses).map(([date, items]) => (
                  <div key={date} className="date-group">
                    <div className="date-heading-row">
                      <h4>{date}</h4>
                      <div className="date-line"></div>
                    </div>

                    {items.map((exp) => (
                      <div key={exp._id} className="expense-card">
                        <div
                          className="expense-icon"
                          style={{
                            backgroundColor:
                              categoryColors[exp.category] || "#999",
                          }}
                        >
                          ●
                        </div>

                        <div className="expense-info">
                          <h5>{exp.title}</h5>
                          <p>{exp.category}</p>
                          {exp.description && (
                            <small>{exp.description}</small>
                          )}
                        </div>

                        <div className="expense-right">
                          <strong>-${Number(exp.amount).toFixed(2)}</strong>
                          <div className="card-actions">
                            <button onClick={() => handleEdit(exp)}>Edit</button>
                            <button onClick={() => handleDelete(exp._id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </section>
          </main>
        ) : (
          <main className="view-content">
            <section className="intro-block">
              <p className="section-label">Track your spending flow.</p>
              <p className="intro-text">
                Add a new expense and keep everything organized in one place.
              </p>
            </section>

            <form className="expense-form-card" onSubmit={handleSubmit}>
              <label>
                <span>Title</span>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Monthly Cloud Storage"
                  value={form.title}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Amount</span>
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                />
              </label>

              <label>
                <span>Category</span>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Transaction Date</span>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Optional Comment</span>
                <textarea
                  name="comment"
                  placeholder="Add a note about this expense..."
                  value={form.comment}
                  onChange={handleChange}
                  rows="4"
                />
              </label>

              {error && <p className="error-text">{error}</p>}

              <button className="primary-button" type="submit">
                {editingId ? "Update Expense" : "Save Expense"}
              </button>

              {editingId && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </main>
        )}

        <nav className="bottom-nav">
          <button
            className={currentView === "dashboard" ? "nav-btn active" : "nav-btn"}
            onClick={() => setCurrentView("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={currentView === "add" ? "nav-btn active" : "nav-btn"}
            onClick={() => {
              resetForm();
              setCurrentView("add");
            }}
          >
            Add New
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;