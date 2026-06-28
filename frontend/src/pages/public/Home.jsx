import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { noticeService } from '../../services/noticeService';
import { eventService } from '../../services/eventService';
import Button from '../../components/common/Button';
import NoticeCard from '../../components/specific/NoticeCard';
import EventCard from '../../components/specific/EventCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nData, eData] = await Promise.all([
          noticeService.getAllNotices(),
          eventService.getAllEvents()
        ]);
        setNotices(nData.slice(0, 3)); // preview top 3
        setEvents(eData.slice(0, 3)); // preview top 3
      } catch (err) {
        console.error("Error fetching homepage data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* Hero Section */}
      <section className="bg-surface-container-low rounded-[24px] p-8 md:p-16 text-center border border-surface-container-highest flex flex-col items-center">
        <h1 className="text-display-lg text-onSurface mb-6 max-w-3xl leading-tight">
          Welcome to the <br/> Satsang Community Portal
        </h1>
        <p className="text-body-lg text-onSurface-variant mb-8 max-w-2xl">
          A dedicated platform for managing your spiritual journey, tracking sabha attendance, 
          learning journals, and staying connected with our vibrant community.
        </p>
        <div className="flex gap-4">
          <Link to="/login">
            <Button size="lg">Member Login</Button>
          </Link>
          <Link to="/notices">
            <Button size="lg" variant="secondary" outline>View Notices</Button>
          </Link>
        </div>
      </section>

      {/* Community Statistics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Members', value: '1,200+' },
          { label: 'Weekly Sabhas', value: '15' },
          { label: 'Community Events', value: '45/yr' },
          { label: 'Years of Seva', value: '25+' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-card border border-surface-container shadow-sm text-center">
            <h3 className="text-headline-lg font-bold text-primary mb-2">{stat.value}</h3>
            <p className="text-body-md text-onSurface-variant font-medium">{stat.label}</p>
          </div>
        ))}
      </section>

      {loading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : (
        <div className="grid md:grid-cols-2 gap-12">
          {/* Latest Notices */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-md font-semibold text-onSurface">Latest Notices</h2>
              <Link to="/notices" className="text-primary font-medium hover:underline">View All</Link>
            </div>
            <div className="flex flex-col gap-4">
              {notices.map(notice => (
                <NoticeCard key={notice.id} {...notice} />
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-md font-semibold text-onSurface">Upcoming Events</h2>
              <span className="text-onSurface-variant font-medium">Login to Register</span>
            </div>
            <div className="flex flex-col gap-4">
              {events.map(event => (
                <EventCard 
                  key={event.id} 
                  {...event} 
                  isRegistered={false} 
                  onRegister={() => window.location.href='/login'} 
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* CTA Section */}
      <section className="bg-primary-container rounded-card p-10 text-center">
        <h2 className="text-headline-md font-semibold text-primary-onContainer mb-4">Ready to start your journey?</h2>
        <p className="text-primary-onContainer/80 mb-6 max-w-xl mx-auto">
          If you are part of the community but don't have an account yet, please reach out to the admin team to get your credentials.
        </p>
        <Link to="/login">
          <Button className="bg-primary text-primary-on hover:bg-primary/90">Login to Dashboard</Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
