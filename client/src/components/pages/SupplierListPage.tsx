import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SupplierForm from '../ui/SupplierForm';

interface Supplier {
  id: number;
  name: string;
  ftpHost: string;
  ftpUser: string;
  remotePath: string;
  schedule: string;
}

export default function SupplierListPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers');
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const handleFormSubmit = () => {
    setEditingSupplier(null);
    fetchSuppliers();
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Поставщики
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>FTP Хост</TableCell>
              <TableCell>FTP Пользователь</TableCell>
              <TableCell>Удаленный путь</TableCell>
              <TableCell>Расписание</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.ftpHost}</TableCell>
                <TableCell>{supplier.ftpUser}</TableCell>
                <TableCell>{supplier.remotePath}</TableCell>
                <TableCell>{supplier.schedule}</TableCell>
                <TableCell>
                  <Button startIcon={<EditIcon />} onClick={() => handleEdit(supplier)}>
                    Редактировать
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(supplier.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setEditingSupplier({} as Supplier)}
        style={{ marginTop: '20px' }}
      >
        Добавить поставщика
      </Button>
      {editingSupplier && (
        <SupplierForm
          supplier={editingSupplier}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditingSupplier(null)}
        />
      )}
    </div>
  );
}
