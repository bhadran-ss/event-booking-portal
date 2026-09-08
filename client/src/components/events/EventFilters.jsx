const categories = ["", "Music", "Tech", "Workshop", "Sports", "Other"];

export default function EventFilters({
  searchInput,
  category,
  onSearchInputChange,
  onCategoryChange,
  onSubmit,
  onClear,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_180px_auto]"
    >
      <input
        type="search"
        value={searchInput}
        onChange={(event) => onSearchInputChange(event.target.value)}
        placeholder="Search events..."
        className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
      />

      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
      >
        {categories.map((item) => (
          <option key={item || "all"} value={item}>
            {item || "All categories"}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-700"
        >
          Search
        </button>

        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
