import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface Supplier {
  id?: number;
  name: string;
  ftpHost: string;
  ftpUser: string;
  ftpPassword: string;
  remotePath: string;
  schedule: string;
}

interface SupplierFormProps {
  supplier: Supplier;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function SupplierForm({
  supplier,
  onSubmit,
  onCancel,
}: SupplierFormProps) {
  const [formData, setFormData] = useState<Supplier>(supplier);

  useEffect(() => {
    setFormData(supplier);
  }, [supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = formData.id ? `/api/suppliers/${formData.id}` : '/api/suppliers';
      const method = formData.id ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      onSubmit();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel}>
      <DialogTitle>
        {formData.id ? 'Редактировать поставщика' : 'Добавить поставщика'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Название"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="FTP Хост"
            name="ftpHost"
            value={formData.ftpHost}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="FTP Пользователь"
            name="ftpUser"
            value={formData.ftpUser}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="FTP Пароль"
            name="ftpPassword"
            type="password"
            value={formData.ftpPassword}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Удаленный путь"
            name="remotePath"
            value={formData.remotePath}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Расписание (cron формат)"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Отмена</Button>
          <Button type="submit" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
