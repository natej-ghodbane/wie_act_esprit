import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import nodemailer from 'nodemailer';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({ 
      uploadDir: './tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const contactInfo = JSON.parse(fields.contactInfo as string);
    
    // Prepare email content
    const emailContent = `
      New Reclamation Submitted
      
      Type: ${fields.type}
      Priority: ${fields.priority}
      Subject: ${fields.subject}
      
      Description:
      ${fields.description}
      
      Contact Information:
      Name: ${contactInfo.name}
      Email: ${contactInfo.email}
      Phone: ${contactInfo.phone}
      Order Reference: ${contactInfo.orderNumber}
    `;

    // Send email with attachments
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'mangoo4life@gmail.com',
      subject: `[Reclamation] ${fields.subject}`,
      text: emailContent,
      attachments: Object.values(files).map((file: any) => ({
        filename: file.originalFilename,
        path: file.filepath,
      })),
    });

    // Clean up uploaded files
    Object.values(files).forEach((file: any) => {
      fs.unlinkSync(file.filepath);
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing reclamation:', error);
    return res.status(500).json({ error: 'Failed to process reclamation' });
  }
}