# Adarsh Yuva Mandal - Contact Form

Simple contact form that forwards messages to your email using Formspree.

---

## Setup (2 Minutes)

### Step 1: Create Formspree Account

1. Go to: https://formspree.io
2. Sign up (free account)
3. Click **"New Form"**
4. Give it a name: `Adarsh Yuva Mandal Contact`

### Step 2: Get Your Form ID

1. In your form dashboard, copy the **Form ID** from the integration code
2. It looks like: `xpwzpzkg` (8 characters)

### Step 3: Update the Website

1. Open `index.html`
2. Find line 306:
   ```html
   <form id="contactForm" action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
   ```
3. Replace `YOUR_FORMSPREE_ID` with your actual Form ID:
   ```html
   <form id="contactForm" action="https://formspree.io/f/xpwzpzkg" method="POST">
   ```

### Step 4: Set Notification Email

In Formspree dashboard:
1. Go to your form settings
2. Set **"Notify by email"** to your preferred email address
3. Or create a Gmail filter for `no-reply@formspree.io`

---

## That's It!

Open `index.html` in your browser. When someone submits the contact form:
- You'll receive an email with all fields (name, email, phone, interest, message)
- The user sees a success message on the website

---

## Features

- **No backend required** - pure HTML/JavaScript
- **Free tier** - 50 submissions/month
- **Anti-spam** - Formspree filters spam automatically
- **No API keys** - Just an 8-character Form ID
- **Email notifications** - Instant delivery to your inbox

---

## Files in This Project

```
index.html    - Your website with contact form
styles.css    - Styling
README.md     - This file
server.js     - (Optional) Node.js backend if you need more control
package.json  - (Optional) Node.js dependencies
```

---

## Optional: Upgrade to Pro

Formspree Pro features:
- File uploads
- Custom thank you pages
- Redirect after submit
- Multiple admin emails
- Remove Formspree branding

---

## Troubleshooting

**Form not submitting:**
- Make sure you replaced `YOUR_FORMSPREE_ID` with your actual ID
- Check browser console for errors

**Not receiving emails:**
- Check spam/junk folder
- Verify your notification email in Formspree dashboard
- Check Formspree form logs in dashboard

**Need more control?**
- Revert to `server.js` (Node.js backend) - see setup in previous version

---

**🙏 जय माता दी 🙏**
