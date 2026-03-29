import { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { CreditCard, QrCodeScanner, Payments } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { clearCart } from '../store/cartSlice';
import api from '../api';

const PaymentPage = () => {
  const [processing, setProcessing] = useState(false);
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const paymentState = location.state as { total: number; subtotal: number; tax: number } | null;

  useEffect(() => {
    if (cart.items.length === 0 && !processing) {
      navigate('/');
    }
  }, [cart.items.length, processing, navigate]);

  const handlePayment = async (method: string) => {
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const payload = {
        total_amount: paymentState?.total || cart.total,
        status: 'paid',
        items: cart.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        }))
      };

      const response = await api.post('/orders', payload);
      dispatch(clearCart());
      navigate('/receipt', { state: { orderId: response.data.id, method, total: paymentState?.total || cart.total } });
    } catch {
      setProcessing(false);
      alert('Payment failed. Please try again.');
    }
  };

  if (processing) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#fff',
        gap: 3
      }}>
        <CircularProgress size={80} sx={{ color: '#FFC72C' }} thickness={5} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#333' }}>Processing Payment...</Typography>
        <Typography color="text.secondary">Please wait a moment</Typography>
      </Box>
    );
  }

  const paymentMethods = [
    { icon: <QrCodeScanner sx={{ fontSize: 28 }} />, label: 'QR Pay', color: '#FFC72C' },
    { icon: <CreditCard sx={{ fontSize: 28 }} />, label: 'Credit/Debit Card', color: '#FFC72C' },
    { icon: <Payments sx={{ fontSize: 28 }} />, label: 'Cash (Pay at counter)', color: '#FFC72C' },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      px: 4
    }}>
      <Typography variant="h4" sx={{
        fontWeight: 700,
        color: '#333',
        mb: 6,
        textAlign: 'center'
      }}>
        Please select a payment type
      </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: 380
      }}>
        {paymentMethods.map((method) => (
          <Button
            key={method.label}
            variant="contained"
            onClick={() => handlePayment(method.label)}
            startIcon={method.icon}
            sx={{
              backgroundColor: method.color,
              color: '#333',
              fontWeight: 700,
              fontSize: '1rem',
              py: 2,
              px: 4,
              borderRadius: 6,
              textTransform: 'none',
              justifyContent: 'center',
              gap: 1.5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#FFB300',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }
            }}
          >
            {method.label}
          </Button>
        ))}
      </Box>

      <Button
        variant="outlined"
        onClick={() => navigate('/cart')}
        sx={{
          mt: 6,
          borderColor: '#333',
          color: '#333',
          fontWeight: 600,
          borderRadius: 6,
          px: 8,
          py: 1.5,
          textTransform: 'none',
          fontSize: '1rem',
          '&:hover': { borderColor: '#333', backgroundColor: '#f5f5f5' }
        }}
      >
        Back
      </Button>
    </Box>
  );
};

export default PaymentPage;
