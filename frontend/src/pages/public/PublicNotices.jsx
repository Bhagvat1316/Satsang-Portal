import React, { useEffect, useState } from 'react';
import { noticeService } from '../../services/noticeService';
import PageHeader from '../../components/layout/PageHeader';
import NoticeCard from '../../components/specific/NoticeCard';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const PublicNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await noticeService.getAllNotices();
        setNotices(data);
      } catch (error) {
        console.error("Failed to load notices");
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    (n.description && n.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <PageHeader 
        title="Notice Board" 
        subtitle="Stay updated with the latest announcements and community news." 
      />
      
      <div className="mb-8 max-w-md">
        <Input 
          placeholder="Search notices..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <NoticeCard 
              key={notice.id}
              title={notice.title}
              date={new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              content={notice.description}
              priority={notice.priority}
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No notices found" 
          description={search ? "Try adjusting your search terms." : "There are currently no active notices."} 
        />
      )}
    </div>
  );
};

export default PublicNotices;
