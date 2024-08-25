# Carniolan Provincial Assembly web app
## Vue.js project - Visualisation of the occurrence of place names in parliamentary records

This is a Vue.js application that integrates Google Maps using the Google Maps JavaScript API.

- Vue.js 3: Frontend framework.
- Vue Router: For routing and page management.
- Google Maps Integration: Using Google Maps JavaScript API.
- Bootstrap 5: For responsive design and styling.
- Bootstrap Icons: Icon set integrated with the UI.

## Prerequisites

To run this project locally, you need to have the following installed:
- Node.js (Version 14 or higher recommended)
- npm or yarn package manager

## Getting Started
1. Clone the Repository
2. Install Dependencies
   ```
   npm install
   ```
   Or, if you're using yarn:
   ```
   yarn install
   ```
3. Set Up Environment Variables
   Create a .env file in the root of your project and add your Google Maps API key:
   ```
   VITE_GOOGLE_MAPS_KEY=your_google_maps_api_key
   ```
   For creating the google maps api key you have to create an account here:
   https://console.cloud.google.com/

   In the API&services section choose Credentials and then on click of the button + CREATE CREDENTIALS, choose API key.
4. Upload Files for Kranjska

   The application expects PDF files to be placed in the public/Kranjska-pdf directory. These files represent various records or reports. You must upload these files manually,       as they are not included in the repository.

   To do this:
    - Navigate to the public/Kranjska-pdf directory in your project folder.
    - Upload your PDF files into this folder. The application will access them from this location.
5. Run the Application
   ```
   npm run dev
   ```
   Or, if you're using yarn:
   ```
   yarn dev
   ```

### Known Issues
- Make sure the Google Maps API key is correctly set in your .env file. If the map does not load, check the console for any API-related errors.
- If you encounter any issues with Bootstrap or styling, make sure that all styles are properly imported in main.js.

## License
The project is licensed under the GPLv3.
