import React, { useEffect, useState } from 'react';
import { eventService } from '../../services/eventService';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/specific/StatCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { Search, RefreshCw, Users } from 'lucide-react';

const AdminEventRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  const fetchAllRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Fetch all events
      const events = await eventService.getAllEvents();
      
      if (!Array.isArray(events)) {
        throw new Error("Invalid events response shape from server.");
      }

      // Step 2: Fetch registrations for each event using Promise.allSettled
      const results = await Promise.allSettled(
        events.map(event => 
          eventService.getEventRegistrations(event.id).then(res => ({
            event,
            // Handle different potential response shapes safely
            registrations: Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []
          }))
        )
      );

      // Step 3: Flatten results
      let flattened = [];
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          const { event, registrations: regList } = result.value;
          regList.forEach(reg => {
            flattened.push({
              userId: reg.userId,
              fullName: reg.fullName,
              registeredAt: reg.registeredAt,
              eventName: event.title,
              venue: event.venue,
              eventDate: event.eventDate
            });
          });
        } else {
          console.error("Failed to fetch registrations for an event:", result.reason);
        }
      });

      // Sort globally by registration date (newest first)
      flattened.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
      
      setRegistrations(flattened);
    } catch (err) {
      console.error(err);
      setError("Failed to load event registrations.");
      addToast(err.message || "Failed to load event registrations", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter(reg => {
    const term = searchTerm.toLowerCase();
    return (
      (reg.userId && reg.userId.toLowerCase().includes(term)) ||
      (reg.fullName && reg.fullName.toLowerCase().includes(term)) ||
      (reg.eventName && reg.eventName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Event Registrations" 
        subtitle="Global view of all participants registered across all events."
        action={
          <Button 
            onClick={fetchAllRegistrations} 
            disabled={loading}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Registrations" 
          value={registrations.length} 
          icon={<Users />} 
        />
      </div>

      <Card>
        <Card.Body className="p-0">
          <div className="p-4 border-b border-surface-variant/30 flex justify-between items-center bg-surface-container-lowest rounded-t-xl">
            <div className="w-full max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurface-variant" size={20} />
              <input 
                type="text"
                placeholder="Search by User ID, Name, or Event Name..."
                className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md text-onSurface placeholder:text-onSurface-variant transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <LoadingSpinner size="lg" className="py-20" />
            ) : error ? (
              <div className="py-20 text-center flex flex-col items-center gap-2">
                <p className="text-error font-medium">{error}</p>
                <Button variant="ghost" onClick={fetchAllRegistrations}>Try Again</Button>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="py-20 text-center text-onSurface-variant flex flex-col items-center gap-2">
                <Users size={40} className="opacity-20 mb-2" />
                <p>{searchTerm ? "No registrations match your search." : "No registrations found across any events."}</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-surface-variant/50">
                    <th className="px-6 py-4 text-label-md font-semibold text-onSurface-variant uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-4 text-label-md font-semibold text-onSurface-variant uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-4 text-label-md font-semibold text-onSurface-variant uppercase tracking-wider">Event Name</th>
                    <th className="px-6 py-4 text-label-md font-semibold text-onSurface-variant uppercase tracking-wider">Venue</th>
                    <th className="px-6 py-4 text-label-md font-semibold text-onSurface-variant uppercase tracking-wider">Event Date</th>
                    <th className="px-6 py-4 text-label-md font-semibold text-onSurface-variant uppercase tracking-wider">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant/30">
                  {filteredRegistrations.map((reg, idx) => (
                    <tr key={`${reg.userId}-${reg.eventName}-${idx}`} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-onSurface">{reg.userId}</td>
                      <td className="px-6 py-4 text-onSurface">{reg.fullName}</td>
                      <td className="px-6 py-4 text-onSurface">{reg.eventName}</td>
                      <td className="px-6 py-4 text-onSurface-variant">{reg.venue}</td>
                      <td className="px-6 py-4 text-onSurface-variant">{reg.eventDate}</td>
                      <td className="px-6 py-4 text-onSurface-variant">
                        {new Date(reg.registeredAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminEventRegistrations;
