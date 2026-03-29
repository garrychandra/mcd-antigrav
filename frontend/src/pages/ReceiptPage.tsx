import { useEffect } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatRupiah } from '../utils';

const ReceiptPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location as { state: { orderId: number; method: string; total: number } | null };

  useEffect(() => {
    if (!state || !state.orderId) {
      navigate('/');
    }

    const timer = setTimeout(() => {
      navigate('/');
    }, 15000);

    return () => clearTimeout(timer);
  }, [state, navigate]);

  if (!state) return null;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFC72C 0%, #FFD54F 40%, #fff 40%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      px: 3
    }}>
      <Container maxWidth="xs">
        <Paper sx={{
          p: 5,
          borderRadius: 4,
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top stripe */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: '#27AE60'
          }} />

          <CheckCircle sx={{ fontSize: 72, color: '#27AE60', mb: 2 }} />

          <Typography variant="h4" sx={{ fontWeight: 800, color: '#333', mb: 0.5 }}>
            Payment Successful!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4, fontSize: '0.95rem' }}>
            Thank you for your order
          </Typography>

          <Box sx={{
            border: '2px dashed #ddd',
            borderRadius: 3,
            p: 4,
            mb: 4,
            backgroundColor: '#FAFAFA'
          }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.85rem', letterSpacing: 2 }}>
              Order Number
            </Typography>
            <Typography variant="h2" sx={{
              fontWeight: 900,
              color: '#DA291C',
              my: 1.5,
              fontFamily: 'monospace'
            }}>
              {String(state.orderId).padStart(3, '0')}
            </Typography>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
              px: 2
            }}>
              <Typography sx={{ fontWeight: 600, color: '#888' }}>Total paid</Typography>
              <Typography sx={{ fontWeight: 800, color: '#333' }}>{formatRupiah(state.total)}</Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 1,
              px: 2
            }}>
              <Typography sx={{ fontWeight: 600, color: '#888' }}>Method</Typography>
              <Typography sx={{ fontWeight: 700, color: '#333' }}>{state.method}</Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: '#FFC72C',
              color: '#333',
              fontWeight: 700,
              borderRadius: 6,
              py: 2,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(255, 199, 44, 0.3)',
              '&:hover': { backgroundColor: '#FFB300' }
            }}
          >
            Start New Order
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Returning to menu in 15 seconds...
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ReceiptPage;
