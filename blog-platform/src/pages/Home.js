import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Fade,
  Zoom,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    {
      title: 'Every Story Begins',
      subtitle: 'With a Single Word',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=80',
      description: 'In a world of noise, your voice matters. Blogging is not just writing—it\'s sharing your unique perspective with the world.',
    },
    {
      title: 'Ideas Take Flight',
      subtitle: 'When You Give Them Wings',
      image: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=1600&q=80',
      description: 'Your thoughts, experiences, and insights deserve to be heard. Transform fleeting ideas into lasting impact.',
    },
    {
      title: 'Connect & Inspire',
      subtitle: 'Beyond Boundaries',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80',
      description: 'Reach readers across the globe. Build a community. Start conversations that matter.',
    },
    {
      title: 'Your Platform',
      subtitle: 'Your Rules',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80',
      description: 'Take control of your narrative. Create, edit, and manage your content with ease.',
    },
  ];

  return (
    <Box className="home-container">
      {/* Hero Section */}
      <Box className="home-hero">
        <Container maxWidth="md" className="home-hero-content">
          <Fade in timeout={1000}>
            <Box>
              <AutoStoriesIcon className="home-hero-icon" />
              <Typography variant="h1" className="home-hero-title">
                The Art of Blogging
              </Typography>
              <Typography variant="h5" className="home-hero-subtitle">
                Write. Share. Inspire.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<CreateIcon />}
                onClick={() => navigate('/register')}
                className="home-hero-button"
              >
                Begin Your Journey
              </Button>
            </Box>
          </Fade>
        </Container>

        {/* Scroll Indicator */}
        <Box className="home-scroll-indicator">
          <Typography variant="body2" className="home-scroll-text">
            Scroll to explore
          </Typography>
          <Box className="home-scroll-mouse">
            <Box className="home-scroll-wheel" />
          </Box>
        </Box>
      </Box>

      {/* Story Sections */}
      {sections.map((section, index) => (
        <Box
          key={index}
          className={`home-section ${index % 2 === 0 ? 'home-section-left' : 'home-section-right'}`}
          style={{
            backgroundImage: `url(${section.image})`,
          }}
        >
          <Container maxWidth="lg">
            <Box className={`home-section-content ${index % 2 === 0 ? 'home-section-content-left' : 'home-section-content-right'}`}>
              <Zoom in timeout={800}>
                <Box>
                  <Typography variant="overline" className="home-section-chapter">
                    Chapter {index + 1}
                  </Typography>
                  <Typography variant="h2" className="home-section-title">
                    {section.title}
                  </Typography>
                  <Typography variant="h4" className="home-section-subtitle">
                    {section.subtitle}
                  </Typography>
                  <Typography variant="body1" className="home-section-description">
                    {section.description}
                  </Typography>
                </Box>
              </Zoom>
            </Box>
          </Container>
        </Box>
      ))}

      {/* Final CTA Section */}
      <Box className="home-cta">
        <Container maxWidth="md" className="home-cta-content">
          <Fade in timeout={1000}>
            <Box>
              <Typography variant="h2" className="home-cta-title">
                Ready to Write Your Story?
              </Typography>
              
              <Box className="home-cta-buttons">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CreateIcon />}
                  onClick={() => navigate('/register')}
                  className="home-cta-button-primary"
                >
                  Create Free Account
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  className="home-cta-button-secondary"
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
