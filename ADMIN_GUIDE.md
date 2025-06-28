# Admin Guide - Song Management

## How to Add Songs as an Admin

### 1. Login as Admin

- Use the admin credentials: `admin@spotify.com` / `admin123`
- You'll be redirected to the Admin Dashboard

### 2. Access Song Management

- In the Admin Dashboard, click on the "Song Management" tab
- This will show you all existing songs and provide options to add new ones

### 3. Adding a New Song

1. Click the "Add New Song" button
2. Fill in the required fields:

   - **Title** (required): The name of the song
   - **Artist** (required): The artist/band name
   - **Album** (optional): The album name
   - **Genre** (optional): The music genre
   - **Duration** (required): Length in seconds (e.g., 180 for 3 minutes)
   - **Audio File** (required): Upload an MP3, WAV, or OGG file (max 50MB)

3. Click "Add Song" to upload

### 4. Editing Songs

- Click the "Edit" button next to any song in the list
- Modify the fields as needed
- Audio files are optional when editing (only required for new songs)
- Click "Update Song" to save changes

### 5. Deleting Songs

- Click the "Delete" button next to any song
- Confirm the deletion when prompted
- This will permanently remove the song and its audio file

## Supported Audio Formats

- MP3 (.mp3)
- WAV (.wav)
- OGG (.ogg)

## File Size Limits

- Maximum file size: 50MB per song

## Admin Features Overview

### Dashboard Tab

- View total users, songs, and playlists
- See recent user registrations
- View recent song uploads
- Check most played songs

### Song Management Tab

- Add new songs with audio files
- Edit existing song metadata
- Delete songs permanently
- View all songs in a table format
- See play counts for each song

## Technical Details

### Backend API Endpoints

- `POST /api/songs` - Add new song (Admin only)
- `PUT /api/songs/:id` - Update song (Admin only)
- `DELETE /api/songs/:id` - Delete song (Admin only)
- `GET /api/songs` - Get all songs (Public)
- `GET /api/songs/:id` - Get song by ID (Public)

### File Storage

- Audio files are stored in the `backend/uploads/` directory
- Files are automatically renamed with unique timestamps
- Original file extensions are preserved

### Security

- All admin operations require authentication
- Admin middleware ensures only admin users can modify songs
- File uploads are validated for type and size

## Troubleshooting

### Common Issues

1. **File upload fails**: Check file format and size
2. **Song not appearing**: Refresh the page after upload
3. **Edit not working**: Make sure all required fields are filled

### Error Messages

- "Audio file is required" - Make sure to select a file
- "Invalid file type" - Use supported audio formats
- "File too large" - Reduce file size (max 50MB)

## User Experience

- Regular users can view and play all songs
- Only admins can add, edit, or delete songs
- Songs are immediately available to all users after upload
- Play counts are tracked automatically
