import { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, IconButton, Badge, Slide } from '@mui/material';
import { ShoppingCart, Add, Remove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api';
import type { RootState } from '../store';
import { addItem, removeItem, updateQuantity } from '../store/cartSlice';
import { formatRupiah } from '../utils';

interface Category {
  id: number;
  name: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category_id: number;
}

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data);
        if (catRes.data.length > 0) {
          setSelectedCategory(catRes.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever selected category changes
  useEffect(() => {
    if (selectedCategory === null) return;
    const fetchProducts = async () => {
      try {
        const prodRes = await api.get(`/products?category_id=${selectedCategory}`);
        setProducts(prodRes.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const handleAddToCart = (product: Product) => {
    dispatch(addItem({
      product_id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image_url: product.image_url,
      quantity: 1
    }));
  };

  const getCartQuantity = (productId: number) => {
    const item = cart.items.find(i => i.product_id === productId);
    return item ? item.quantity : 0;
  };

  const handleRemoveOne = (productId: number) => {
    const item = cart.items.find(i => i.product_id === productId);
    if (item) {
      if (item.quantity <= 1) {
        dispatch(removeItem(item.id));
      } else {
        dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
      }
    }
  };

  const totalItems = cart.items.reduce((a, b) => a + b.quantity, 0);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f8f8f8' }}>

      {/* ─── Left Sidebar: Category Icons ─── */}
      <Box sx={{
        width: 90,
        backgroundColor: '#fff',
        borderRight: '1px solid #e8e8e8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 2,
        gap: 0.5,
        overflowY: 'auto',
        flexShrink: 0,
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)'
      }}>
        {categories.map((cat) => (
          <Box
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            sx={{
              width: 72,
              py: 1.5,
              px: 0.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'pointer',
              borderRadius: 2,
              borderLeft: selectedCategory === cat.id ? '4px solid #FFC72C' : '4px solid transparent',
              backgroundColor: selectedCategory === cat.id ? '#FFF8E1' : 'transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#FFF8E1',
              }
            }}
          >
            <Box
              component="img"
              src={cat.image}
              alt={cat.name}
              sx={{
                width: 44,
                height: 44,
                objectFit: 'contain',
                borderRadius: 2,
              }}
            />
            <Typography sx={{
              fontSize: '0.6rem',
              fontWeight: selectedCategory === cat.id ? 700 : 500,
              color: selectedCategory === cat.id ? '#333' : '#888',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: '-0.2px'
            }}>
              {cat.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ─── Main Content ─── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

        {/* ─── Top Banner ─── */}
        <Box sx={{
          height: 140,
          background: 'linear-gradient(135deg, #FFC72C 0%, #FFD54F 50%, #FFCA28 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <Box
            component="img"
            src="/images/banner.png"
            alt="Banner"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.9
            }}
          />
        </Box>

        {/* ─── Category Title + Search ─── */}
        <Box sx={{
          px: 3,
          pt: 2.5,
          pb: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderBottom: '1px solid #eee'
        }}>
          <Typography variant="h5" sx={{
            fontWeight: 800,
            color: '#292929',
            fontSize: '1.4rem'
          }}>
            {categories.find(c => c.id === selectedCategory)?.name || 'Menu'}
          </Typography>
        </Box>

        {/* ─── Products Grid ─── */}
        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2.5,
          py: 2,
          pb: totalItems > 0 ? 14 : 10,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ddd', borderRadius: 3 }
        }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
          }}>
            {products.map((product) => (
              <Card
                key={product.id}
                onClick={() => handleAddToCart(product)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: '2px solid transparent',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease',
                  overflow: 'visible',
                  position: 'relative',
                  '&:hover': {
                    border: '2px solid #FFC72C',
                    boxShadow: '0 4px 16px rgba(255, 199, 44, 0.25)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'scale(0.97)',
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="130"
                  image={product.image_url}
                  alt={product.name}
                  sx={{
                    objectFit: 'contain',
                    p: 1.5,
                    backgroundColor: '#fafafa'
                  }}
                />
                <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
                  <Typography sx={{
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    lineHeight: 1.3,
                    color: '#333',
                    mb: 0.5,
                    minHeight: '2.2em',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.name}
                  </Typography>
                  <Typography sx={{
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: '#DA291C'
                  }}>
                    {formatRupiah(parseFloat(product.price))}
                  </Typography>
                </CardContent>

                {/* Add / Counter overlay */}
                {(() => {
                  const qty = getCartQuantity(product.id);
                  if (qty === 0) {
                    return (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: '#FFC72C',
                          color: '#333',
                          width: 30,
                          height: 30,
                          '&:hover': { backgroundColor: '#FFB300' }
                        }}
                      >
                        <Add sx={{ fontSize: 18 }} />
                      </IconButton>
                    );
                  }
                  return (
                    <Box
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        borderRadius: 6,
                        border: '2px solid #FFC72C',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveOne(product.id)}
                        sx={{
                          borderRadius: 0,
                          width: 28,
                          height: 28,
                          color: '#DA291C',
                          '&:hover': { backgroundColor: '#FFF3E0' }
                        }}
                      >
                        <Remove sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Typography sx={{
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        minWidth: 24,
                        textAlign: 'center',
                        color: '#333',
                        userSelect: 'none'
                      }}>
                        {qty}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleAddToCart(product)}
                        sx={{
                          borderRadius: 0,
                          width: 28,
                          height: 28,
                          color: '#27AE60',
                          '&:hover': { backgroundColor: '#E8F5E9' }
                        }}
                      >
                        <Add sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  );
                })()}
              </Card>
            ))}
          </Box>
        </Box>

        {/* ─── Bottom Cart / Order Bar ─── */}
        <Slide direction="up" in={totalItems > 0} mountOnEnter unmountOnExit>
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#FFC72C',
            py: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.12)',
            zIndex: 20
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge badgeContent={totalItems} color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.85rem',
                    height: 22,
                    minWidth: 22,
                    borderRadius: 11,
                    fontWeight: 'bold',
                    backgroundColor: '#DA291C'
                  }
                }}>
                <ShoppingCart sx={{ fontSize: 28, color: '#333' }} />
              </Badge>
              <Box>
                <Typography sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#555',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  {totalItems} item{totalItems > 1 ? 's' : ''} in cart
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#292929' }}>
                  {formatRupiah(cart.total)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/cart')}
                sx={{
                  borderColor: '#333',
                  color: '#333',
                  fontWeight: 700,
                  borderRadius: 6,
                  px: 3,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  '&:hover': { borderColor: '#333', backgroundColor: 'rgba(0,0,0,0.05)' }
                }}
              >
                View order list
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/cart')}
                sx={{
                  backgroundColor: '#27AE60',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: 6,
                  px: 4,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(39,174,96,0.3)',
                  '&:hover': { backgroundColor: '#219653' }
                }}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        </Slide>

        {/* ─── Cancel Order button (always shown at the very bottom) ─── */}
        {totalItems === 0 && (
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            py: 2,
            textAlign: 'center',
            backgroundColor: '#fff',
            borderTop: '1px solid #eee'
          }}>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
