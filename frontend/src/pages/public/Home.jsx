import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { noticeService } from '../../services/noticeService';
import { eventService } from '../../services/eventService';
import { bannerService } from '../../services/bannerService';
import Button from '../../components/common/Button';
import NoticeCard from '../../components/specific/NoticeCard';
import EventCard from '../../components/specific/EventCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ImageIcon } from 'lucide-react';
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Keyboard, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nData, eData, bData] = await Promise.all([
          noticeService.getAllNotices(),
          eventService.getAllEvents(),
          bannerService.getPublicBanners()
        ]);
        setNotices(nData.slice(0, 3)); // preview top 3
        setEvents(eData.slice(0, 3)); // preview top 3
        setBanners(bData || []);
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
          Welcome to the <br /> Satsang Community Portal
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
          { label: 'Active Members', value: '30+' },
          { label: 'Yearly Sabhas', value: '52' },
          { label: 'Community Events', value: '45/yr' },
          { label: 'Monthly Sabhas', value: '4' },
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
                  onRegister={() => window.location.href = '/login'}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Hero Banner Slider */}
      {loading ? (
        <section className="w-full h-64 md:h-[500px] bg-surface-container-highest animate-pulse rounded-2xl flex items-center justify-center">
          <ImageIcon className="text-onSurface-variant opacity-20" size={64} />
        </section>
      ) : banners.length > 0 ? (
        <section className="w-full overflow-hidden rounded-2xl shadow-lg border border-surface-container">
          <Swiper
            modules={[Autoplay, Navigation, Pagination, Keyboard, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop={banners.length > 1}
            className="w-full h-64 md:h-[500px] bg-black group"
          >
            {banners.map(banner => {
              const SlideContent = (
                <div className="relative w-full h-full group/slide cursor-pointer">
                  {/* Lazy loaded image / thumbnail */}
                  <img
                    src={banner.mediaType === 'YOUTUBE' ? banner.thumbnailUrl : banner.imageUrl}
                    alt={banner.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* YouTube Premium Play Button */}
                  {banner.mediaType === 'YOUTUBE' && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/40 backdrop-blur-md shadow-2xl flex items-center justify-center text-white border border-white/20 transition-transform duration-300 transform group-hover/slide:scale-110">
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white"></div>
                        <svg className="w-10 h-10 md:w-12 md:h-12 ml-2 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  )}

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-16 text-left z-20">
                    <div className="max-w-4xl transform transition-transform duration-700 translate-y-0 opacity-100 pointer-events-auto">
                      {banner.title && (
                        <h2 className="text-white text-3xl md:text-5xl font-bold mb-4 leading-tight drop-shadow-md">
                          {banner.title}
                        </h2>
                      )}
                      {banner.subtitle && (
                        <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-8 drop-shadow">
                          {banner.subtitle}
                        </p>
                      )}
                      {banner.buttonText && banner.buttonLink && (
                        banner.mediaType === 'YOUTUBE' ? (
                          <div className="inline-flex cursor-pointer bg-primary text-primary-on hover:bg-primary/90 shadow-lg px-8 py-3 rounded-full text-md font-semibold transition-transform hover:scale-105 active:scale-95">
                            {banner.buttonText}
                          </div>
                        ) : (
                          <Link to={banner.buttonLink}>
                            <Button className="bg-primary text-primary-on hover:bg-primary/90 shadow-lg px-8 py-3 rounded-full text-md font-semibold transition-transform hover:scale-105 active:scale-95">
                              {banner.buttonText}
                            </Button>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <SwiperSlide key={banner.id} className="relative w-full h-full">
                  {banner.mediaType === 'YOUTUBE' ? (
                    <a href={banner.youtubeUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                      {SlideContent}
                    </a>
                  ) : (
                    SlideContent
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      ) : null}

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
