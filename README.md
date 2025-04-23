# Front-End Template: React 19, TypeScript, Vite, ShadCN, TailwindCSS

This project is a template for starting a front-end application with the following technologies:

## Technologies Used
* React 19: JavaScript library for building interactive user interfaces.
* TypeScript: A superset of JavaScript with static types to make your code more robust.
* Vite: An ultra-fast build tool for modern front-end projects.
* ShadCN: Components and utilities to improve the UI/UX of your application.
* TailwindCSS: A utility-first CSS framework for creating modern and responsive designs.
* Recharts: Recharts is a JavaScript library for creating interactive and customizable charts with React. [examples](https://recharts.org/en-US/examples)

## Prerequisites

Before getting started, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (Recommended version: 22.14.0 or above)
- [npm](https://www.npmjs.com/) (Comes with Node.js)
- [Tutoriel getting started](https://docs.forepaas.io/#/en/getting-started/index)

## Installation

1. Install the dependencies:

  ```bash
   npm install --legacy-peer-deps
  ```

2. Configure environment variables in the public/environments-vars.json file.
You need to provide two important variables: IAM_URL and API_URL.
Example content for the public/environments-vars.json file:

  ```json
    {
      "IAM_URL": "https://PROJECT_NAME.forepaas.io/cam?app_id=APP_ID",
      "API_URL": "https://PROJECT_NAME.forepaas.io/API_ID"
    }
  ```

  * Replace PROJECT_NAME, APP_ID, and API_ID with the specific values for your OVHCloud Dataplatform project.

## Running the Project in Development Mode
To start the project in development mode, run the following command:
  ```bash
    npm run dev
  ````
This will start the development server, and you can access the application at [http://localhost:3333](http://localhost:3333)

## Test the build for Production
In production, the project will be built : 
  ```bash
    npm run build
  ````

## Zipping the Project to upload it in the Dataplatform
If you want to zip the project to upload it to the OVHCloud platform, use the following command:
  ```bash
    npm run zip
  ````
This command will generate a compressed file that you can upload directly to the OVHCloud DataPlatform.

## Deploying on OVHCloud DataPlatform
Once your project is ready for deployment, you can upload it to OVHCloud DataPlatform by following the appropriate steps for the platform. This template is designed to make the integration easier.