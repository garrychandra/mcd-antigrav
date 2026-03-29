import { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Chip } from '@mui/material';
import { MonetizationOn, ShoppingCart, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../api';
import { formatRupiah } from '../utils';

interface DashboardData {
  totalOrders: number;
  totalIncome: number;
  mostOrdered: Array<{
    product_id: number;
    totalQuantity: string;
    Product: { name: string; image_url: string; price: string };
  }>;
  dailyIncome: Array<{
    date: string;
    income: string;
    orders: string;
  }>;
}

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [dashRes, ordersRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/orders')
        ]);
        setDashboard(dashRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      }
    };
    fetchAdminData();
  }, []);

  if (!dashboard) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0f1117' }}>
      <Typography variant="h5" sx={{ color: '#888' }}>Loading dashboard...</Typography>
    </Box>
  );

  // Prepare chart data
  const chartData = dashboard.dailyIncome.map(d => ({
    date: new Date(d.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
    income: Number(d.income),
    orders: Number(d.orders)
  }));

  // Fill with zeros if no data
  if (chartData.length === 0) {
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      chartData.push({
        date: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
        income: 0,
        orders: 0
      });
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f1117', color: '#fff' }}>
      {/* Admin Navbar */}
      <Box sx={{
        px: 4, py: 2,
        backgroundColor: '#1a1d27',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #2a2d37'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFC72C' }}>McAdmin</Typography>
          <Chip label="Dashboard" size="small" sx={{ backgroundColor: '#FFC72C', color: '#333', fontWeight: 700 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={() => navigate('/admin')}
            sx={{ color: '#FFC72C', fontWeight: 600, textTransform: 'none', fontSize: '0.9rem' }}>
            Dashboard
          </Button>
          <Button onClick={() => navigate('/admin/products')}
            sx={{ color: '#aaa', fontWeight: 600, textTransform: 'none', fontSize: '0.9rem', '&:hover': { color: '#fff' } }}>
            Manage Menu
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}
            sx={{ borderColor: '#444', color: '#aaa', fontWeight: 600, textTransform: 'none', borderRadius: 6, '&:hover': { borderColor: '#FFC72C', color: '#FFC72C' } }}>
            Exit to Kiosk
          </Button>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* ─── Stats Cards ─── */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{
              p: 3,
              borderRadius: 4,
              backgroundColor: '#1a1d27',
              border: '1px solid #2a2d37',
              display: 'flex', alignItems: 'center', gap: 2.5
            }}>
              <Box sx={{
                width: 56, height: 56, borderRadius: 3,
                background: 'linear-gradient(135deg, #FFC72C, #FF9800)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <MonetizationOn sx={{ fontSize: 28, color: '#fff' }} />
              </Box>
              <Box>
                <Typography sx={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Total Revenue
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                  {formatRupiah(dashboard.totalIncome)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{
              p: 3, borderRadius: 4,
              backgroundColor: '#1a1d27', border: '1px solid #2a2d37',
              display: 'flex', alignItems: 'center', gap: 2.5
            }}>
              <Box sx={{
                width: 56, height: 56, borderRadius: 3,
                background: 'linear-gradient(135deg, #DA291C, #c62828)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ShoppingCart sx={{ fontSize: 28, color: '#fff' }} />
              </Box>
              <Box>
                <Typography sx={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Total Orders
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                  {dashboard.totalOrders}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{
              p: 3, borderRadius: 4,
              backgroundColor: '#1a1d27', border: '1px solid #2a2d37',
              display: 'flex', alignItems: 'center', gap: 2.5
            }}>
              <Box sx={{
                width: 56, height: 56, borderRadius: 3,
                background: 'linear-gradient(135deg, #27AE60, #1B5E20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <TrendingUp sx={{ fontSize: 28, color: '#fff' }} />
              </Box>
              <Box>
                <Typography sx={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Avg. Order Value
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                  {dashboard.totalOrders > 0
                    ? formatRupiah(Math.round(dashboard.totalIncome / dashboard.totalOrders))
                    : 'Rp 0'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* ─── Charts Row ─── */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, borderRadius: 4, backgroundColor: '#1a1d27', border: '1px solid #2a2d37' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', mb: 3, color: '#fff' }}>
                Revenue (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFC72C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FFC72C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" />
                  <XAxis dataKey="date" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid #2a2d37', borderRadius: 8, color: '#fff' }}
                    formatter={(value: number) => [formatRupiah(value), 'Revenue']}
                  />
                  <Area type="monotone" dataKey="income" stroke="#FFC72C" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 4, backgroundColor: '#1a1d27', border: '1px solid #2a2d37' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', mb: 3, color: '#fff' }}>
                Orders (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" />
                  <XAxis dataKey="date" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid #2a2d37', borderRadius: 8, color: '#fff' }}
                  />
                  <Bar dataKey="orders" fill="#DA291C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* ─── Bottom Row: Popular Items + Transaction History ─── */}
        <Grid container spacing={3}>
          {/* Popular Items */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3, borderRadius: 4, backgroundColor: '#1a1d27', border: '1px solid #2a2d37' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', mb: 2, color: '#fff' }}>
                🔥 Most Popular Items
              </Typography>
              {dashboard.mostOrdered.length === 0 ? (
                <Typography sx={{ color: '#666', py: 4, textAlign: 'center' }}>No orders yet</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {dashboard.mostOrdered.map((item, idx) => (
                    <Box key={item.product_id} sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      borderRadius: 3,
                      backgroundColor: idx === 0 ? 'rgba(255, 199, 44, 0.08)' : 'transparent',
                      border: idx === 0 ? '1px solid rgba(255, 199, 44, 0.2)' : '1px solid transparent',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' }
                    }}>
                      {/* Rank */}
                      <Typography sx={{
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        color: idx === 0 ? '#FFC72C' : idx === 1 ? '#aaa' : '#666',
                        minWidth: 24,
                        textAlign: 'center'
                      }}>
                        #{idx + 1}
                      </Typography>

                      {/* Product Image */}
                      <Box
                        component="img"
                        src={item.Product?.image_url || '/images/products/bigmac.png'}
                        alt={item.Product?.name}
                        sx={{
                          width: 44, height: 44,
                          objectFit: 'contain',
                          borderRadius: 2,
                          backgroundColor: '#fff',
                          p: 0.3
                        }}
                      />

                      {/* Name & Price */}
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                          {item.Product?.name || `Product #${item.product_id}`}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                          {item.Product ? formatRupiah(Number(item.Product.price)) : ''}
                        </Typography>
                      </Box>

                      {/* Quantity sold */}
                      <Chip
                        label={`${item.totalQuantity} sold`}
                        size="small"
                        sx={{
                          backgroundColor: idx === 0 ? '#FFC72C' : '#2a2d37',
                          color: idx === 0 ? '#333' : '#ccc',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Transaction History */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ borderRadius: 4, overflow: 'hidden', backgroundColor: '#1a1d27', border: '1px solid #2a2d37' }}>
              <Box sx={{ p: 3, pb: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                  Transaction History
                </Typography>
              </Box>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#14161e' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#888', borderBottom: '1px solid #2a2d37' }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#888', borderBottom: '1px solid #2a2d37' }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#888', borderBottom: '1px solid #2a2d37' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#888', borderBottom: '1px solid #2a2d37' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.slice(0, 10).map((order) => (
                    <TableRow key={order.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#fff', borderBottom: '1px solid #2a2d37' }}>
                        #{String(order.id).padStart(4, '0')}
                      </TableCell>
                      <TableCell sx={{ color: '#aaa', borderBottom: '1px solid #2a2d37' }}>
                        {new Date(order.createdAt).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#FFC72C', borderBottom: '1px solid #2a2d37' }}>
                        {formatRupiah(order.total_amount)}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #2a2d37' }}>
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{
                            backgroundColor: order.status === 'paid' ? 'rgba(39,174,96,0.15)' : 'rgba(255,152,0,0.15)',
                            color: order.status === 'paid' ? '#27AE60' : '#FF9800',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            fontSize: '0.7rem',
                            letterSpacing: 0.5
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#666', borderBottom: 'none' }}>
                        No orders yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
