---
layout: default
title: Getting Started
nav_order: 2
---

<!--prettier-ignore-start-->
## Support

Need help with your project? Contact the Aries Solutions team for
assistance.

---

## Getting started

### Quick Demo

We can provide a demo or install our hosted version directly to your dev environment.
[Please reach out to our team for help.](https://www.ariessolutions.io/contact-aries/)

## Merchant Center Custom Application

### Local Development

To run the application locally, follow these steps:

1. **Install Dependencies**  
   Use `yarn` to install the required dependencies:

   ```bash
   yarn install
   ```

2. **Set Up Environment Variables**  
   Copy the `.env.template` file to `.env` and configure the required environment variables:

   ```bash
   cp .env.template .env
   ```

   Update the `.env` file with the appropriate values for your commercetools project and environment.

3. **Run the Application**  
   Start the application locally:

   ```bash
   yarn start
   ```

Once the application is running, you can access it in your browser at the local development URL provided by the terminal output.

### Host the Application

The commercetools Merchant Center does not allow a single running instance to be shared, each _ENTRY_POINT_URI_PATH_ must be unique.

You can launch your own copy through Netlify or similar hosting service. Be sure to set the correct environment variables, there is a .env.template file to help.

### Configure Custom Application with Merchant Center

In order to use this custom application, you'll need to register it inside of the Merchant Center. To register your Custom Application with a Merchant Center project:

1. In the main navigation of the Merchant Center, navigate to **User Icon > Manage Organization and Teams**. Click on the organizaiton where you want to install the application.

2. From your organization page, navigate to the tab **Custom Applications** and clck the **Configure Custom Applications** button. Then click the **Add a Custom Application** button.

3. Fill in the fields as follows:

    - **Application Name**: Emailer
    - **Application Url**: Your hosting location
    - **Application entry point URI path**: `emailer-unique-url`
    - **Permissions**: View Key/Value Documents, View Products, View Messages, View Orders, View Customers, View Categories, Manage Key/Value Documents

4. Click **Register Custom Application**.

5. Install the application in your desired projects. From the organization's Custom Applications screen click on the **Install Custom Applications** button. Choose the application. Install in all or selected projects for that organization.

## Event Processor

The Event Processor is responsible for handling events and sending emails. The backend code for this service is available at [commercetools-emailer-backend](https://github.com/ariessolutionsio/commercetools-emailer-backend).

### Installation Instructions

1. **Clone the Repository**  
   Clone the backend repository to your local machine:

   ```bash
   git clone https://github.com/ariessolutionsio/commercetools-emailer-backend.git
   cd commercetools-emailer-backend
   ```

2. **Install Dependencies**  
   Install the required dependencies using `npm` or `yarn`:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**  
   Copy the `.env.template` file to `.env` and configure the required environment variables:

   ```bash
   cp .env.template .env
   ```

   Update the `.env` file with your commercetools project credentials and email service configuration.

4. **Run the Application**  
   Start the application locally:

   ```bash
   npm start
   # or
   yarn start
   ```

5. **Deploy the Application**  
   Deploy the application to your preferred hosting service (e.g., AWS, Heroku, or Google Cloud). Ensure the environment variables are correctly set in the hosting environment.

6. **Configure commercetools Subscriptions**  
   To enable the Event Processor to handle commercetools events, configure a subscription in your commercetools Merchant Center:
   - Navigate to **Settings > Subscriptions**.
   - Click **Add Subscription**.
   - Fill in the fields as follows:
     - **Destination**: Provide the destination type (e.g., HTTP) and the URL of your deployed Event Processor.
     - **Messages**: Select the message types you want to subscribe to (e.g., Order Created, Order Updated).
   - Save the subscription.

7. **Test the Integration**  
   Verify that the Event Processor is correctly handling events and sending emails by creating or updating an order in your commercetools project.

For more details, refer to the [commercetools-emailer-backend GitHub](https://github.com/ariessolutionsio/commercetools-emailer-backend).
