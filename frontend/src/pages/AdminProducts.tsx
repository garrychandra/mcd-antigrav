import { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Checkbox, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { formatRupiah } from '../utils';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState<any>({ name: '', description: '', price: '', image_url: '', category_ids: [], availability: true });
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([api.get('/products-admin'), api.get('/categories')]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenForm = (product?: any) => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        category_ids: product.category_ids || [],
        availability: product.availability
      });
      setEditingId(product.id);
    } else {
      setFormData({ name: '', description: '', price: '', image_url: '', category_ids: [], availability: true });
      setEditingId(null);
    }
    setOpenForm(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setOpenForm(false);
      fetchData();
    } catch (err) {
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

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
          <Chip label="Menu Management" size="small" sx={{ backgroundColor: '#DA291C', color: '#fff', fontWeight: 700 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={() => navigate('/admin')}
            sx={{ color: '#aaa', fontWeight: 600, textTransform: 'none', fontSize: '0.9rem', '&:hover': { color: '#fff' } }}>
            Dashboard
          </Button>
          <Button onClick={() => navigate('/admin/products')}
            sx={{ color: '#FFC72C', fontWeight: 600, textTransform: 'none', fontSize: '0.9rem' }}>
            Manage Menu
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}
            sx={{ borderColor: '#444', color: '#aaa', fontWeight: 600, textTransform: 'none', borderRadius: 6, '&:hover': { borderColor: '#FFC72C', color: '#FFC72C' } }}>
            Exit to Kiosk
          </Button>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>Menu Items</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenForm()}
            sx={{
              backgroundColor: '#FFC72C',
              color: '#333',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 6,
              px: 3,
              '&:hover': { backgroundColor: '#FFB300' }
            }}
          >
            Add Product
          </Button>
        </Box>

        <Paper sx={{ borderRadius: 4, overflow: 'hidden', backgroundColor: '#1a1d27', border: '1px solid #2a2d37' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#14161e' }}>
                <TableCell sx={{ fontWeight: 700, color: '#888', borderBottom: '1px solid #2a2d37' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#888', borderBottom: '1px solid #2a2d37' }}>Categories</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#888', borderBottom: '1px solid #2a2d37' }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#888', borderBottom: '1px solid #2a2d37' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ borderBottom: '1px solid #2a2d37' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        component="img"
                        src={p.image_url || '/images/products/bigmac.png'}
                        sx={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 2, backgroundColor: '#fff', p: 0.3 }}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{p.name}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{p.description?.substring(0, 50)}...</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #2a2d37' }}>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {(p.category_ids || []).map((catId: number) => {
                        const cat = categories.find(c => c.id === catId);
                        return cat ? (
                          <Chip key={catId} label={cat.name} size="small"
                            sx={{ backgroundColor: '#2a2d37', color: '#ccc', fontSize: '0.7rem', height: 22 }} />
                        ) : null;
                      })}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#FFC72C', borderBottom: '1px solid #2a2d37' }}>
                    {formatRupiah(Number(p.price))}
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid #2a2d37' }}>
                    <IconButton onClick={() => handleOpenForm(p)} sx={{ color: '#FFC72C' }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(p.id)} sx={{ color: '#DA291C' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>

      {/* Product Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { backgroundColor: '#1a1d27', color: '#fff', borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#fff' }}>
          {editingId ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#2a2d37' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField label="Name" fullWidth value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              InputProps={{ sx: { color: '#fff' } }}
              InputLabelProps={{ sx: { color: '#888' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#2a2d37' }, '&:hover fieldset': { borderColor: '#FFC72C' } } }}
            />
            <TextField label="Description" fullWidth multiline rows={3} value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              InputProps={{ sx: { color: '#fff' } }}
              InputLabelProps={{ sx: { color: '#888' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#2a2d37' }, '&:hover fieldset': { borderColor: '#FFC72C' } } }}
            />
            <TextField label="Price (IDR)" type="number" fullWidth value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              InputProps={{ sx: { color: '#fff' } }}
              InputLabelProps={{ sx: { color: '#888' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#2a2d37' }, '&:hover fieldset': { borderColor: '#FFC72C' } } }}
            />
            <TextField label="Image URL" fullWidth value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              InputProps={{ sx: { color: '#fff' } }}
              InputLabelProps={{ sx: { color: '#888' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#2a2d37' }, '&:hover fieldset': { borderColor: '#FFC72C' } } }}
            />
            {/* Multi-select categories */}
            <Box>
              <Typography sx={{ color: '#888', fontSize: '0.8rem', mb: 1 }}>Categories (select multiple)</Typography>
              <Select
                multiple
                fullWidth
                value={formData.category_ids}
                onChange={(e) => setFormData({ ...formData, category_ids: e.target.value })}
                input={<OutlinedInput />}
                renderValue={(selected: number[]) =>
                  selected.map(id => categories.find(c => c.id === id)?.name).filter(Boolean).join(', ')
                }
                sx={{
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2d37' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFC72C' },
                  '& .MuiSvgIcon-root': { color: '#888' }
                }}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Checkbox checked={formData.category_ids.includes(c.id)} sx={{ color: '#FFC72C', '&.Mui-checked': { color: '#FFC72C' } }} />
                    <ListItemText primary={c.name} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #2a2d37' }}>
          <Button onClick={() => setOpenForm(false)} sx={{ color: '#888', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained"
            sx={{ backgroundColor: '#FFC72C', color: '#333', fontWeight: 700, textTransform: 'none', borderRadius: 6, px: 4, '&:hover': { backgroundColor: '#FFB300' } }}>
            Save Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProducts;
