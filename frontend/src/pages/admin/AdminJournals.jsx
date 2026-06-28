import React, { useEffect, useState, useMemo } from 'react';
import { journalService } from '../../services/journalService';
import PageHeader from '../../components/layout/PageHeader';
import Table from '../../components/common/Table';
import StatCard from '../../components/specific/StatCard';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { BookOpen, Calendar, Search, User, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const AdminJournals = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Backend Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJournals, setTotalJournals] = useState(0);
  const limit = 10;
  
  const [filterMonth, setFilterMonth] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filterUserId, setFilterUserId] = useState('');
  
  // Client-side Filter
  const [searchQuery, setSearchQuery] = useState('');

  // View Modal State
  const [selectedJournal, setSelectedJournal] = useState(null);

  const { addToast } = useToast();

  useEffect(() => {
    fetchJournals();
  }, [page, filterMonth, filterYear, filterUserId]);

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const monthParam = filterMonth === 'All' ? '' : filterMonth;
      const yearParam = filterYear === 'All' ? '' : filterYear;
      
      const response = await journalService.getAllJournals(page, limit, monthParam, yearParam, filterUserId.trim());
      
      setJournals(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalJournals(response.pagination?.total || 0);
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to load journals", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUserIdSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1); // Reset to page 1 on new search
      setFilterUserId(e.target.value);
    }
  };

  const handleFilterChange = (setter) => (e) => {
    setPage(1);
    setter(e.target.value);
  };

  const filteredJournals = useMemo(() => {
    if (!searchQuery.trim()) return journals;
    const query = searchQuery.toLowerCase();
    return journals.filter(j => 
      (j.fullName || '').toLowerCase().includes(query) ||
      (j.title || '').toLowerCase().includes(query)
    );
  }, [journals, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Admin Journals" 
        subtitle="Manage and review all submitted learning journals."
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Journals" value={totalJournals} icon={<BookOpen />} />
        <StatCard title="Current Page" value={`${page} / ${totalPages}`} icon={<BookOpen />} />
        <StatCard title="Month Filter" value={filterMonth === 'All' ? 'All Months' : filterMonth} icon={<Calendar />} />
        <StatCard title="Year Filter" value={filterYear === 'All' ? 'All Years' : filterYear} icon={<Calendar />} />
      </div>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 bg-surface-container-low p-4 rounded-card border border-surface-container-highest">
        <div className="flex-1 min-w-[200px]">
          <Input 
            label="Search User ID" 
            placeholder="Enter SAT ID and press Enter..." 
            icon={<User size={18} />}
            defaultValue={filterUserId}
            onKeyDown={handleUserIdSearch}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Input 
            label="Search Title / Username" 
            placeholder="Filter current page..." 
            icon={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full lg:w-48">
          <Select 
            label="Month" 
            value={filterMonth} 
            onChange={handleFilterChange(setFilterMonth)}
            options={[
              {value: 'All', label: 'All Months'},
              {value: '01', label: 'January'},
              {value: '02', label: 'February'},
              {value: '03', label: 'March'},
              {value: '04', label: 'April'},
              {value: '05', label: 'May'},
              {value: '06', label: 'June'},
              {value: '07', label: 'July'},
              {value: '08', label: 'August'},
              {value: '09', label: 'September'},
              {value: '10', label: 'October'},
              {value: '11', label: 'November'},
              {value: '12', label: 'December'}
            ]}
          />
        </div>
        <div className="w-full lg:w-48">
          <Select 
            label="Year" 
            value={filterYear} 
            onChange={handleFilterChange(setFilterYear)}
            options={[
              {value: 'All', label: 'All Years'},
              {value: '2026', label: '2026'}, 
              {value: '2025', label: '2025'}
            ]}
          />
        </div>
      </div>

      {/* Table & Pagination */}
      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <div className="flex flex-col gap-4">
          <Table 
            headers={['Sabha Date', 'Submitted Date', 'User ID', 'Username', 'Title', 'Learning Preview', 'Actions']}
            data={filteredJournals}
            renderRow={(journal) => (
              <tr 
                key={journal.id} 
                className="hover:bg-surface-container-low/50 cursor-pointer transition-colors"
                onClick={() => setSelectedJournal(journal)}
              >
                <td className="px-6 py-4 text-onSurface-variant">{journal.sabhaDate}</td>
                <td className="px-6 py-4 text-onSurface-variant">
                  {new Date(journal.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </td>
                <td className="px-6 py-4 font-medium text-onSurface">{journal.userId}</td>
                <td className="px-6 py-4 text-onSurface">{journal.fullName}</td>
                <td className="px-6 py-4 text-onSurface font-medium max-w-xs truncate" title={journal.title}>
                  {journal.title}
                </td>
                <td className="px-6 py-4 text-onSurface-variant max-w-sm truncate">
                  {journal.learning.length > 100 ? `${journal.learning.substring(0, 100)}...` : journal.learning}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="secondary" 
                    outline 
                    className="p-2 h-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJournal(journal);
                    }}
                    title="View Details"
                  >
                    <Eye size={18} />
                  </Button>
                </td>
              </tr>
            )}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-2">
              <Button 
                variant="secondary" 
                outline 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3"
              >
                <ChevronLeft size={20} />
              </Button>
              <span className="text-label-lg font-medium text-onSurface">
                Page {page} of {totalPages}
              </span>
              <Button 
                variant="secondary" 
                outline 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3"
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* View Details Modal */}
      <Modal
        isOpen={!!selectedJournal}
        onClose={() => setSelectedJournal(null)}
        title="Journal Details"
        footer={
          <Button onClick={() => setSelectedJournal(null)}>Close</Button>
        }
      >
        {selectedJournal && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 bg-surface-container-lowest p-4 rounded-card border border-surface-container-highest">
              <div>
                <p className="text-label-sm text-onSurface-variant uppercase tracking-wider mb-1">User ID</p>
                <p className="font-medium text-onSurface">{selectedJournal.userId}</p>
              </div>
              <div>
                <p className="text-label-sm text-onSurface-variant uppercase tracking-wider mb-1">Username</p>
                <p className="font-medium text-onSurface">{selectedJournal.fullName}</p>
              </div>
              <div>
                <p className="text-label-sm text-onSurface-variant uppercase tracking-wider mb-1">Sabha Date</p>
                <p className="font-medium text-onSurface">{selectedJournal.sabhaDate}</p>
              </div>
              <div>
                <p className="text-label-sm text-onSurface-variant uppercase tracking-wider mb-1">Submitted Date</p>
                <p className="font-medium text-onSurface">
                  {new Date(selectedJournal.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-label-sm text-onSurface-variant uppercase tracking-wider mb-2">Title</p>
              <h4 className="text-title-lg font-semibold text-onSurface">{selectedJournal.title}</h4>
            </div>

            <div>
              <p className="text-label-sm text-onSurface-variant uppercase tracking-wider mb-2">Full Learning</p>
              <div className="bg-surface-container-low p-4 rounded-card border border-surface-container-highest whitespace-pre-wrap text-body-md text-onSurface">
                {selectedJournal.learning}
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default AdminJournals;
