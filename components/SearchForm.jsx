import { useState } from "react";

export default function SearchForm({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/search?q=${query}&page=1`);
    const data = await response.json();
    onSearch(data);
  };

  return (
    <form className="flex w-full max-w-sm space-x-3" onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="search"
          name="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="py-2 pl-4 pr-10 text-sm text-white bg-gray-900 rounded-md focus:outline-none focus:bg-white focus:text-gray-900"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
        </div>
      </div>
      {/* <div>
      <label htmlFor="filter" className="sr-only">
        Filter by
      </label>
      <select
        id="filter"
        name="filter"
        className="py-2 text-sm text-white bg-gray-900 rounded-md focus:outline-none focus:bg-white focus:text-gray-900"
      >
        <option value="">Filter by</option>
        <option value="option1">shopify</option>
        <option value="option2">woocommerce</option>
        <option value="option3">unknown</option>
      </select>
    </div> */}
      <div>
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-offset-2 focus:ring-gray-900"
        >
          Search
        </button>
      </div>
    </form>
  );
}
