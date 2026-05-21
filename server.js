const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configurar transporter de Nodemailer con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'iellowmar@gmail.com',
    pass: process.env.GMAIL_PASSWORD || 'rljt uxzi wbtk qqyf'
  }
});

// Verificar conexión
transporter.verify((error, success) => {
  if (error) {
    console.log('Error en configuración de email:', error);
  } else {
    console.log('Servidor de email listo');
  }
});

// Ruta para enviar recordatorio
app.post('/api/send-reminder', async (req, res) => {
  try {
    const { usuario, plaza, planta, fecha, email } = req.body;

    const mailOptions = {
      from: process.env.GMAIL_USER || 'iellowmar@gmail.com',
      to: email || 'iellowmar@gmail.com',
      subject: 'Recordatorio - Sistema de Parkings',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1>Sistema de Gestión de Parkings</h1>
          </div>
          <div style="background: white; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2>Hola ${usuario},</h2>
            <p>Te recordamos que <strong>mañana (${fecha})</strong> tienes reservada una plaza de garaje.</p>
            
            <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 15px; margin: 15px 0;">
              <p><strong>Plaza:</strong> ${plaza}</p>
              <p><strong>Planta:</strong> ${planta}</p>
              <p><strong>Fecha:</strong> ${fecha}</p>
            </div>

            <p>Si no tienes previsto hacer uso de ella, puedes liberarla. Esto permitirá que otro compañero pueda usar esa plaza.</p>

            <p style="margin-top: 20px; color: #666;">Si tienes cualquier duda, contacta con administración.</p>
          </div>
          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p>Sistema de Gestión de Parkings © 2025</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    
    res.json({ 
      success: true, 
      message: `Recordatorio enviado a ${email || 'iellowmar@gmail.com'}`,
      messageId: info.messageId 
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar email',
      error: error.message 
    });
  }
});

// Ruta para enviar confirmación
app.post('/api/send-assignment', async (req, res) => {
  try {
    const { usuario, plaza, planta, fecha, email } = req.body;

    const mailOptions = {
      from: process.env.GMAIL_USER || 'iellowmar@gmail.com',
      to: email || 'iellowmar@gmail.com',
      subject: 'Plaza Asignada - Sistema de Parkings',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1>Plaza Asignada</h1>
          </div>
          <div style="background: white; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2>Hola ${usuario},</h2>
            <p>Te comunicamos que se te ha asignado una plaza de garaje.</p>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0;">
              <p><strong>Plaza:</strong> ${plaza}</p>
              <p><strong>Planta:</strong> ${planta}</p>
              <p><strong>Fecha:</strong> ${fecha}</p>
            </div>

            <p>Por favor, confirma tu asistencia para que podamos tener un registro actualizado.</p>

            <p style="margin-top: 20px; color: #666;">Si tienes cualquier duda, contacta con administración.</p>
          </div>
          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p>Sistema de Gestión de Parkings © 2025</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de asignación enviado:', info.messageId);
    
    res.json({ 
      success: true, 
      message: `Confirmación enviada a ${email || 'iellowmar@gmail.com'}`,
      messageId: info.messageId 
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar email',
      error: error.message 
    });
  }
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Email configurado: ${process.env.GMAIL_USER || 'iellowmar@gmail.com'}`);
});
