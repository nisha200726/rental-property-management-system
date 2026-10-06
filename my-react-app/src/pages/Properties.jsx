import { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import SearchFilter from '../components/SearchFilter';
import api from '../services/api';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState({ location: '', type: '', maxRent: '' });

  const fetchProperties = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (currentFilters.location) params.append('location', currentFilters.location);
      if (currentFilters.type) params.append('type', currentFilters.type);
      if (currentFilters.maxRent) params.append('maxRent', currentFilters.maxRent);

      const response = await api.get(`/properties?${params.toString()}`);
      setProperties(response.data.properties || []);
      setCount(response.data.count || 0);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Unable to load properties right now.';
      setProperties([]);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filters);
  }, []);

  const handleSearch = (nextFilters) => {
    setFilters(nextFilters);
    fetchProperties(nextFilters);
  };

  return (
    <div className="page-shell container">
      <div className="section-heading spaced-heading">
        <div>
          <span className="eyebrow">Browse homes</span>
          <h2>Find the right place for you</h2>
        </div>
      </div>

      <SearchFilter onSearch={handleSearch} initialValues={filters} />

      {!loading && (
        <p className="results-count">{count} property{count === 1 ? '' : 'ies'} found</p>
      )}

      {loading ? (
        <p className="loading-text">Loading properties...</p>
      ) : properties.length === 0 ? (
        <div className="empty-card">No properties match your filters at the moment.</div>
      ) : (
        <div className="property-grid large-grid">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} role="customer" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;
