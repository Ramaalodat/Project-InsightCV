import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'
import { ratingAPI } from '../services/api'
import './Testimonials.css'

const Testimonials = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -40])
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 40])

  // Fetch real testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await ratingAPI.getAll()
        const formattedTestimonials = response.ratings.map(rating => ({
          name: rating.user.name,
          role: rating.user.candidate?.title || rating.user.company?.name || 'User',
          company: rating.user.company?.name || 'Job Seeker',
          avatar: rating.user.avatar 
            ? `http://localhost:8000/storage/${rating.user.avatar}` 
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(rating.user.name)}&background=FFD700&color=1a1a2e&size=150`,
          content: rating.comment,
          rating: rating.rating,
        }))
        
        // If no ratings yet, show default ones
        if (formattedTestimonials.length === 0) {
          setTestimonials([
            {
              name: 'Be the first!',
              role: 'User',
              company: 'InsightCV',
              avatar: 'https://ui-avatars.com/api/?name=User&background=FFD700&color=1a1a2e&size=150',
              content: 'Be the first to share your experience with InsightCV! Your feedback helps us improve.',
              rating: 5,
            }
          ])
        } else {
          setTestimonials(formattedTestimonials)
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error)
        // Show default testimonial on error
        setTestimonials([
          {
            name: 'InsightCV User',
            role: 'Professional',
            company: 'Various Companies',
            avatar: 'https://ui-avatars.com/api/?name=User&background=FFD700&color=1a1a2e&size=150',
            content: 'Join our community and share your success story!',
            rating: 5,
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [testimonials.length])

  return (
    <section
      id="testimonials"
      ref={ref}
      className="testimonials"
    >
      {/* Background Decoration */}
      <div className="testimonials-background">
        <motion.div className="bg-orb testimonials-orb-1" style={{ y: orb1Y }} />
        <motion.div className="bg-orb testimonials-orb-2" style={{ y: orb2Y }} />
      </div>

      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="testimonials-header"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="testimonials-badge"
          >
            Client Reviews
          </motion.span>
          <h2 className="testimonials-title">
            Loved by{' '}
            <span className="gradient-text">Professionals</span>
          </h2>
          <p className="testimonials-subtitle">
            Join thousands of successful job seekers who transformed their careers
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="testimonials-carousel">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#FFD700' }}>
              Loading testimonials...
            </div>
          ) : (
            <>
          {/* Main Testimonial Display */}
          <div className="testimonials-display">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: currentIndex === index ? 1 : 0,
                  x: currentIndex === index ? 0 : currentIndex < index ? 100 : -100,
                  scale: currentIndex === index ? 1 : 0.8,
                }}
                transition={{ duration: 0.5 }}
                className={`testimonial-card ${
                  currentIndex === index ? 'active' : 'inactive'
                }`}
              >
                <div className="testimonial-content">
                  {/* Quote Icon */}
                  <div className="quote-icon">
                    <Quote className="quote-svg" />
                  </div>

                  {/* Rating */}
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={
                          currentIndex === index
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0 }
                        }
                        transition={{ delay: i * 0.1 + 0.2, duration: 0.3 }}
                      >
                        <Star className="star-icon" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Content */}
                  <p className="testimonial-text">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="testimonial-author">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="author-avatar"
                    >
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="avatar-image"
                      />
                      <div className="avatar-overlay" />
                    </motion.div>
                    <div className="author-info">
                      <div className="author-name">
                        {testimonial.name}
                      </div>
                      <div className="author-role">
                        {testimonial.role}
                      </div>
                      <div className="author-company">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="testimonials-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="dot-button"
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <div
                  className={`dot ${
                    currentIndex === index ? 'active' : 'inactive'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Side Previews - Desktop Only */}
          {testimonials.length > 1 && (
          <div className="testimonials-previews">
            {/* Previous Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 0.3, x: 0 }}
              className="preview-card preview-prev"
            >
              <div className="preview-content">
                <div className="preview-avatar">
                  <img
                    src={
                      testimonials[
                        (currentIndex - 1 + testimonials.length) % testimonials.length
                      ].avatar
                    }
                    alt="Previous"
                    className="preview-image"
                  />
                </div>
                <div className="preview-placeholder" />
              </div>
            </motion.div>

            {/* Next Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 0.3, x: 0 }}
              className="preview-card preview-next"
            >
              <div className="preview-content">
                <div className="preview-avatar">
                  <img
                    src={testimonials[(currentIndex + 1) % testimonials.length].avatar}
                    alt="Next"
                    className="preview-image"
                  />
                </div>
                <div className="preview-placeholder" />
              </div>
            </motion.div>
          </div>
          )}
          </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
