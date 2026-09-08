import { Navigate, Route, Routes } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="foundation-page">
      <section className="foundation-card">
        <p className="eyebrow">EventHub</p>

        <h1>React Frontend Development Test</h1>
      </section>
    </main>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
