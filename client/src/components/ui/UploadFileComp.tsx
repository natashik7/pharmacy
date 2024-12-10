'use client'

import React, { useState } from 'react'
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box,
  Alert,
  AlertTitle,
  CircularProgress
  } from '@mui/material'
  import CloudUploadIcon from '@mui/icons-material/CloudUpload'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setMessage({ type: 'error', text: 'Пожалуйста, выберите файл' })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setMessage({ type: 'success', text: `Файл успешно загружен. Обработано ${result.rowsProcessed} строк.` })
      } else {
        const errorData = await response.json()
        setMessage({ type: 'error', text: `Ошибка загрузки файла: ${errorData.message}` })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при загрузке файла' })
      console.error('Ошибка загрузки:', error)
    }

    setUploading(false)
  }

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <CardHeader title="Загрузка данных поставщика аптек" />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
            >
              Выберите файл
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </Button>
            {file && (
              <Typography variant="body2">
                Выбранный файл: {file.name}
              </Typography>
            )}
            <Button 
              type="submit" 
              variant="contained" 
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : null}
            >
              {uploading ? 'Загрузка...' : 'Загрузить'}
            </Button>
            {message && (
              <Alert severity={message.type}>
                <AlertTitle>{message.type === 'error' ? 'Ошибка' : 'Успех'}</AlertTitle>
                {message.text}
              </Alert>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}

