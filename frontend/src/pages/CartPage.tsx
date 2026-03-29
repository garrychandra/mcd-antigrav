import { Box, Typography, Button, IconButton, Divider } from '@mui/material';
import { Add, Remove, Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { updateQuantity, removeItem } from '../store/cartSlice';
import { formatRupiah } from '../utils';

const CartPage = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpdateQty = (id: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      dispatch(removeItem(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  if (cart.items.length === 0) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 3,
        backgroundColor: '#f8f8f8'
      }}>
        <ShoppingCartEmpty />
        <Typography variant="h5" color="text.secondary" fontWeight={700}>Your cart is empty</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            backgroundColor: '#FFC72C',
            color: '#333',
            fontWeight: 700,
            borderRadius: 6,
            px: 6,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': { backgroundColor: '#FFB300' }
          }}
        >
          Back to Menu
        </Button>
      </Box>
    );
  }

  // Tax calculation (11% PPN)
  const tax = Math.round(cart.total * 0.11);
  const grandTotal = cart.total + tax;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FFC72C' }}>

      {/* ─── Header ─── */}
      <Box sx={{
        pt: 4,
        pb: 2,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        <IconButton onClick={() => navigate('/')} sx={{ color: '#333' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{
          fontWeight: 800,
          color: '#333',
          fontStyle: 'italic'
        }}>
          Order list
        </Typography>
      </Box>

      {/* ─── Items ─── */}
      <Box sx={{ flex: 1, px: 4, pb: 2 }}>
        {cart.items.map((item, idx) => (
          <Box key={item.id}>
            <Box sx={{
              display: 'flex',
              py: 2,
              gap: 2,
            }}>
              {/* Product Image */}
              <Box
                component="img"
                src={item.image_url}
                alt={item.name}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'contain',
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  p: 0.5,
                  flexShrink: 0
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#333', flex: 1 }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#333', ml: 2 }}>
                    x {item.quantity}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#333', ml: 2, minWidth: 100, textAlign: 'right' }}>
                    {formatRupiah(item.price * item.quantity)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => dispatch(removeItem(item.id))}
                    sx={{
                      borderRadius: 4,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderColor: '#DA291C',
                      color: '#DA291C',
                      px: 2,
                      minWidth: 'auto'
                    }}
                  >
                    Remove
                  </Button>

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #999',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}>
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateQty(item.id, item.quantity, -1)}
                      sx={{ borderRadius: 0, color: '#333', px: 1, py: 0.5, backgroundColor: '#eee', '&:hover': { backgroundColor: '#ddd' } }}
                    >
                      <Remove sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Typography sx={{
                      fontWeight: 800,
                      minWidth: 36,
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      backgroundColor: '#fff',
                      py: 0.5,
                      color: '#333'
                    }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateQty(item.id, item.quantity, 1)}
                      sx={{ borderRadius: 0, color: '#333', px: 1, py: 0.5, backgroundColor: '#eee', '&:hover': { backgroundColor: '#ddd' } }}
                    >
                      <Add sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
            {idx < cart.items.length - 1 && <Divider sx={{ borderColor: 'rgba(0,0,0,0.15)' }} />}
          </Box>
        ))}
      </Box>

      {/* ─── Tax & Total ─── */}
      <Box sx={{
        px: 4,
        py: 2,
        backgroundColor: 'rgba(0,0,0,0.08)',
        borderTop: '2px solid rgba(0,0,0,0.15)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4, mb: 0.5 }}>
          <Typography sx={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>Tax (PPN 11%)</Typography>
          <Typography sx={{ fontWeight: 700, color: '#333', fontSize: '0.9rem', minWidth: 110, textAlign: 'right' }}>{formatRupiah(tax)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
          <Typography sx={{ fontWeight: 800, color: '#333', fontSize: '1.1rem' }}>Total</Typography>
          <Typography sx={{ fontWeight: 900, color: '#333', fontSize: '1.1rem', minWidth: 110, textAlign: 'right' }}>{formatRupiah(grandTotal)}</Typography>
        </Box>
      </Box>

      {/* ─── Bottom Buttons ─── */}
      <Box sx={{
        display: 'flex',
        gap: 0,
        backgroundColor: '#fff',
        borderTop: '1px solid #ddd'
      }}>
        <Button
          variant="text"
          onClick={() => navigate('/')}
          sx={{
            flex: 1,
            py: 2.5,
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'none',
            color: '#333',
            borderRadius: 0,
            borderRight: '1px solid #ddd',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          Add more
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('/payment', { state: { total: grandTotal, subtotal: cart.total, tax } })}
          sx={{
            flex: 1,
            py: 2.5,
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'none',
            backgroundColor: '#27AE60',
            color: '#fff',
            borderRadius: 0,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#219653', boxShadow: 'none' }
          }}
        >
          Proceed to checkout
        </Button>
      </Box>
    </Box>
  );
};

// Simple empty cart icon component
const ShoppingCartEmpty = () => (
  <Box sx={{
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: '#FFF3E0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Delete sx={{ fontSize: 40, color: '#FFC72C' }} />
  </Box>
);

export default CartPage;
