'use client'
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';

const ResultsTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const recordsPerPage = 6;
  const param=useParams()
  const slug=param['slug']
  // const [formnames, setFormnames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cook=Cookies.get('client') 
        const response = await fetch(`http://localhost:3201/results/${slug}`);
        const results = await response.json();
        console.log(results);
        
        setData(results.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row =>
      Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    const allKeys = Object.keys(data[0]);
   
    return ['id', ...allKeys.filter(key => key !== 'id')]
     
  }, [data]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  const formatCellValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value.toString();
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return 'bg-secondary text-white';
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border spinner-border-custom text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container mx-5">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-5 fw-bold text-dark mb-2">Form Results</h1>
            <p className="lead text-muted">View and manage submitted form responses</p>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div className="position-relative">
                      <i className="bi bi-search search-icon"></i>
                      <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search results..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex gap-3 justify-content-md-end">
                      <div className="stats-card">
                        <strong>{filteredData.length}</strong> total results
                      </div>
                      <div className="stats-card text-black">
                        Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredData.length)}</strong> of <strong>{filteredData.length}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="row">
          <div className="col-12">
            <div className="table-container">
              {currentData.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          {columns.map((column) => (
                            <th key={column} scope="col">
                              <div className="d-flex align-items-center gap-2">
                                {column}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((row, index) => (
                          <tr key={row.id || index}>
                            {columns.map((column) => (
                              <td key={column}>
                                {column === 'id' ? (
                                  <span className="id-badge">#{row[column]}</span>
                                ) : column === 'email' ? (
                                  <span className="email-link">
                                    {row[column]}
                                  </span>
                                ) : (
                                  <span>{formatCellValue(row[column])}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination-container">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            <i className="bi bi-chevron-left me-1"></i>
                            Previous
                          </button>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                            <i className="bi bi-chevron-right ms-1"></i>
                          </button>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted">Page</span>
                          <span className="badge bg-primary fs-6 px-3 py-2">
                            {currentPage}
                          </span>
                          <span className="text-muted">of {totalPages}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-results">
                  <i className="bi bi-file-text"></i>
                  <h3 className="h4 mb-2">No results found</h3>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search criteria.' : 'No form submissions available.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;