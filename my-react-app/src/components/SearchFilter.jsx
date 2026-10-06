import { useState } from 'react';

const defaultFilters = {
  location: '',
  type: '',
  maxRent: '',
};

const SearchFilter = ({ onSearch, initialValues = defaultFilters }) => {
  const [filters, setFilters] = useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    onSearch(defaultFilters);
  };

  return (
    <form className="search-filter" onSubmit={handleSubmit}>
      <div className="filter-grid">
        <div className="input-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={filters.location}
            onChange={handleChange}
            placeholder="Search by city"
          />
        </div>

        <div className="input-group">
          <label htmlFor="type">Property Type</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleChange}
          >
            <option value="">Any Type</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Room">Room</option>
            <option value="Villa">Villa</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="maxRent">Max Rent</label>
          <input
            id="maxRent"
            name="maxRent"
            type="number"
            min="0"
            value={filters.maxRent}
            onChange={handleChange}
            placeholder="50000"
          />
        </div>
      </div>

      <div className="filter-actions">
        <button type="submit" className="primary-button">
          Search Properties
        </button>
        <button type="button" className="secondary-button" onClick={clearFilters}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchFilter;
