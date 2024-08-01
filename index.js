const { JWT } = require('google-auth-library');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load the service account key JSON file.
const serviceAccountPath = path.join(__dirname, 'thinking-volt-430806-g3-e2f72c9cb404.json');

let serviceAccount;
try {
  const rawData = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(rawData);
} catch (error) {
  console.error('Error reading or parsing service account file:', error);
  process.exit(1);
}

// Create a new JWT client
const jwtClient = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

async function getFirestoreSize() {
  try {
    // Manually refresh the token
    const token = await jwtClient.authorize();
    console.log('Token expiry:', new Date(token.expiry_date).toISOString());

    const cloudResourceManager = google.cloudresourcemanager({
      version: 'v1',
      auth: jwtClient,
    });

    // Replace with your Firestore project ID
    const projectId = 'rivo-2';

    // Get the project information
    const res = await cloudResourceManager.projects.get({
      projectId: projectId,
    });

    console.log('Project information:', res.data);

  } catch (error) {
    console.error('Error getting project information:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  }
}

getFirestoreSize();