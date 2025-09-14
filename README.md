Scam Blocker: Anti-Scam Chrome Extension
This is a Chrome extension designed for real-time detection of suspicious scam and phishing websites. The project uses a backend proxy server to safely call external APIs, protecting the API key, and includes a user reporting feature to continuously improve detection capabilities.

Core Features
Real-time Website Detection: Automatically analyzes the current website and displays its security status.

Backend Proxy Server: Safely calls the VirusTotal API through a self-hosted Node.js server, preventing API key exposure in the frontend code.

User Reporting System: Provides a one-click reporting feature to automatically collect suspicious website URLs and relevant information.

Automatic Data Storage: Automatically organizes and saves all user-reported data into a local JSON file.

Technologies Used
Frontend: HTML, CSS, JavaScript (for Chrome Extension)

Backend: Node.js, Express, CORS

Third-Party API: VirusTotal API

Quick Start: Project Setup
This project consists of two separate parts: a backend server and a Chrome extension. Please follow the steps below to complete the setup.

Step 1: Backend Server Setup
Install Node.js

If you don't have Node.js installed, please download and install the LTS version from the Node.js official website.

Initialize the Project

Create a folder named api-proxy.

Open your terminal (or command prompt) and use the cd command to navigate to the api-proxy folder.

Enter the following commands to initialize the project and install the necessary packages:

Bash

npm init -y
npm install express cors
Configure server.js

Download the server.js file from this project and move it into the api-proxy folder.

Open server.js and insert your VirusTotal API key into the designated variable:

JavaScript

const VIRUSTOTAL_API_KEY = 'YOUR-API-KEY-HERE';
Start the Server

Make sure you are still in the terminal within the api-proxy folder.

Enter the following command to start the server:

Bash

node server.js
When you see the message Proxy server is running on http://localhost:3000, the server has started successfully. Do not close this terminal window.

Step 2: Load the Chrome Extension
Download the Extension Files

Download the entire scam-blocker folder to your computer.

Load into the Chrome Browser

In the Chrome browser address bar, type chrome://extensions and press Enter.

Enable the "Developer mode" toggle switch in the top right corner.

Click the "Load unpacked" button in the top left.

Select the scam-blocker folder you downloaded.

Usage
Website Detection: Once the extension is loaded, click the icon in your toolbar. It will display the security status of the current website.

Report a Suspicious Website: If the detection is incorrect or you find a new suspicious website, you can click the "Report this website" button. The extension will automatically send the website's information to your server.

View Reported Data: All user-reported website data will be organized and saved in a reports.json file within your api-proxy folder.

Disclaimer
This project uses the VirusTotal API for demonstration purposes. Please ensure you comply with their API terms of use and limitations.

The api-proxy server requires the terminal to remain open while running. For official deployment, consider using cloud services like Heroku or Vercel.
