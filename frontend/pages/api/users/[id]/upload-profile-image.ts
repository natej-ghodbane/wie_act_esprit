import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);
    
    const userId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    const profileImage = Array.isArray(files.profileImage) ? files.profileImage[0] : files.profileImage;

    if (!profileImage || !userId) {
      return res.status(400).json({ message: 'Missing user ID or image file' });
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    // Create form data for backend
    const formData = new FormData();
    const fileStream = fs.createReadStream(profileImage.filepath);
    formData.append('profileImage', fileStream, profileImage.originalFilename || 'profile.jpg');

    const response = await fetch(`${backendUrl}/users/${userId}/upload-profile-image`, {
      method: 'POST',
      body: formData as any, // Type assertion to fix the FormData typing issue
    });

    const data = await response.json();

    // Clean up temp file
    fs.unlinkSync(profileImage.filepath);

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}