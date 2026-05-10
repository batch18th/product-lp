# FaithWear Nepal COD Product Funnel

This is a production-ready Cash on Delivery sales funnel built with Next.js App Router and Tailwind CSS.

## Tech Stack

- Next.js App Router for landing, checkout, thank you page, and `/api/order`
- Tailwind CSS for responsive premium UI
- Google Sheets API with a service account for order storage
- Nodemailer with SMTP/Gmail for business and customer email notifications
- Environment variables for all private credentials

## Order Flow

1. A customer clicks a Purchase Now, Order Now, or Buy Now button.
2. The selected product name, quantity, price per piece, and total price are passed to `/checkout`.
3. The checkout form collects name, phone, email, and exact location.
4. `/api/order` validates the order, generates an order ID, adds date/time, sets payment method to Cash On Delivery, and sets status to New Order.
5. The API appends the order to Google Sheets.
6. The API sends a business notification email to `BUSINESS_EMAIL`.
7. The API sends an order received email to the customer.
8. The customer is redirected to `/thank-you`.

The API only returns success after the spreadsheet save and both emails complete successfully.

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BUSINESS_EMAIL=batch18th1990@gmail.com
EMAIL_FROM=batch18th1990@gmail.com
BRAND_NAME=FaithWear Nepal

GOOGLE_SHEET_ID=
GOOGLE_SHEET_TAB_NAME=T-shirt order
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=

EMAIL_SERVICE_API_KEY=

FRONTEND_URL=http://localhost:3000
```

For Gmail SMTP, use a Google App Password as `SMTP_PASS`. Do not use your normal Gmail password.

If your private key contains line breaks, paste it like this:

```bash
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_LINES\n-----END PRIVATE KEY-----\n"
```

## Google Spreadsheet Setup

1. Create a Google Spreadsheet.
2. Rename the sheet tab to `T-shirt order`.
3. Add these columns in row 1:
   `Order ID`, `Date & Time`, `Customer Name`, `Phone Number`, `Email Address`, `Exact Location`, `Product Name`, `Quantity`, `Price Per Piece`, `Total Price`, `Payment Method`, `Order Status`, `Notes`.
4. Select row 1 and turn on filters from Data > Create a filter.
5. Add an Order Status dropdown in the `Order Status` column with:
   `New Order`, `Order Confirmed`, `Order Ongoing`, `Delivered`, `Cancelled`.
6. Copy the spreadsheet ID from the URL and add it to `GOOGLE_SHEET_ID`.
7. Create a Google Cloud service account and enable the Google Sheets API.
8. Copy the service account email to `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
9. Create a JSON key for the service account and paste the private key into `GOOGLE_PRIVATE_KEY`.
10. Share the Google Sheet with the service account email as Editor.

The app also writes the header row automatically if the tab is empty.

## How To Test Order Submission

1. Add valid values to `.env.local`.
2. Run `npm.cmd run dev`.
3. Open `http://localhost:3000`.
4. Choose a quantity and go to checkout.
5. Submit a real test order.
6. Confirm the order appears in Google Sheets.
7. Confirm the business notification arrives in Gmail.
8. Confirm the customer receives the order received email.
9. Confirm the browser redirects to `/thank-you`.

If submission fails, the checkout page shows the API error and does not redirect.

## Deploy On Vercel

1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Add all environment variables in Vercel Project Settings > Environment Variables.
4. Redeploy after adding variables.
5. Test one live order after deployment.

Recommended production values:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com
```

## Editing Product Content

Product copy, price, benefits, testimonials, FAQs, and image paths live in:

```txt
lib/product.ts
```

Product images live in:

```txt
public/products
```

## Routes

- `/` Product landing page
- `/checkout` Checkout page
- `/thank-you` Thank you page
- `/api/order` Order submission API
"# product-lp" 
