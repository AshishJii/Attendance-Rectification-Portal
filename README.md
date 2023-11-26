# Attendance Rectification Portal

## Overview

The Attendance Rectification Portal is a web application designed to streamline the process of rectifying attendance records for students. It provides an easy-to-use interface for students to submit rectification requests and an admin portal for faculty to manage and process these requests.

## Features

- **Student Portal:**
  - Enter roll number to retrieve personal information (name, branch, and photo).
  - Submit rectification requests with specified date periods.

- **Admin Portal:**
  - View all rectification requests in a table.
  - Delete individual rectification records.

## Technologies Used

- **Frontend Server:**
  - Vanilla HTML, CSS, JS and [Node.js](https://nodejs.org/)

- **REST API Server:**
  - [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)

- **Data Store (JSON File):**
  - A simple JSON file structured to hold student information and rectification requests.


## Setting Up JSON Files

To use the Attendance Rectification Portal, you'll need to create a new file named `students.json` in the /RectifyAPI/assets/ directory of the project.
   - Add student data in the following format:

     ```json
      {
       "220156345654": {   // rollNumber
         "Name": "John Doe",
         "Image": "path/to/photo.jpg"
       },
       "220156345865": {
         "Name": "Miley Cruz",
         "Image": "path/to/photo.jpg"
       },
       // Add more student entries as needed
     }
     ```

   - Ensure each student has a unique `rollNumber`.
   
## Usage

1. Clone the repository:

```bash
   git clone https://github.com/ashishjii/attendance-rectification-portal.git
   cd attendance-rectification-portal
```

2.  Run the `starter.bat` file:
    This will automatically install dependencies, start the frontend and backend servers, and open the application in your default browser.