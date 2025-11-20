# Website Project - Complete Setup Guide

## Project Overview

This is a complete, production-ready website built with HTML5, CSS3, JavaScript, and PHP. The project includes a responsive design, contact form with database integration, and modern web development best practices.

**Site Purpose:** [Site purpose]

---

## 📁 Project Structure

```
project-root/
│
├── index.html              # Homepage
├── about.html              # About page
├── services.html           # Services/Products page
├── portfolio.html          # Portfolio/Gallery page
├── contact.html            # Contact page with form
│
├── css/
│   └── styles.css          # Main stylesheet with CSS variables
│
├── js/
│   └── app.js              # JavaScript for interactivity
│
├── php/
│   └── contact.php         # Backend form handler
│
├── db/
│   └── db.sql              # Database schema and setup
│
├── assets/
│   └── images/             # Image assets
│       ├── placeholder.jpg
│       ├── about-placeholder.jpg
│       ├── team-1.jpg
│       ├── team-2.jpg
│       ├── team-3.jpg
│       └── portfolio-1.jpg to portfolio-9.jpg
│
├── logs/
│   └── errors.log          # Error log file (auto-created)
│
└── README.md               # This file
```

---

## 🚀 Features

### Frontend Features
- ✅ **Responsive Design** - Mobile-first approach, works on all devices
- ✅ **Semantic HTML5** - Proper heading structure and accessible components
- ✅ **Modern CSS** - CSS Variables, Flexbox, and Grid layout
- ✅ **Mobile Menu** - Hamburger menu for mobile devices
- ✅ **Lazy Loading** - Images load as they enter viewport for better performance
- ✅ **Form Validation** - Client-side validation with real-time feedback
- ✅ **Portfolio Filter** - Filter projects by category

### Backend Features
- ✅ **PHP Backend** - Secure form processing
- ✅ **MySQL Database** - Stores contact submissions
- ✅ **Prepared Statements** - SQL injection prevention using PDO
- ✅ **Input Sanitization** - XSS attack prevention
- ✅ **CSRF Protection** - Token-based security
- ✅ **Error Logging** - Logs errors to file for debugging
- ✅ **JSON Responses** - AJAX-friendly API responses

### Security Features
- 🔒 CSRF token validation
- 🔒 SQL injection prevention (prepared statements)
- 🔒 XSS prevention (input sanitization)
- 🔒 Input length limits
- 🔒 Server-side validation
- 🔒 Error logging (no sensitive data exposed to users)

---

## 💻 Local Development Setup

### Prerequisites

You need one of the following local server environments:

- **XAMPP** (Windows, Mac, Linux) - Recommended
- **WAMP** (Windows)
- **MAMP** (Mac)
- **LAMP** (Linux)

### Installation Steps

#### 1. Install XAMPP

1. Download XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Install XAMPP (default installation is fine)
3. Start Apache and MySQL from XAMPP Control Panel

#### 2. Setup Project Files

1. Copy the entire project folder to your XAMPP `htdocs` directory:
   - **Windows:** `C:\xampp\htdocs\your-project-name\`
   - **Mac:** `/Applications/XAMPP/htdocs/your-project-name/`
   - **Linux:** `/opt/lampp/htdocs/your-project-name/`

2. Ensure the `logs` folder exists and has write permissions:
   ```bash
   # On Mac/Linux
   chmod 755 logs/
   
   # On Windows, right-click logs folder > Properties > Security
   # Give "Users" write permissions
   ```

#### 3. Setup Database

1. Open phpMyAdmin in your browser:
   ```
   http://localhost/phpmyadmin
   ```

2. Click on "Import" tab

3. Choose the file `db/db.sql` from your project

4. Click "Go" to import the database

   **OR** manually create the database:
   - Click "New" to create a database
   - Name it `contact_db`
   - Set collation to `utf8mb4_unicode_ci`
   - Click "SQL" tab and paste the contents of `db/db.sql`
   - Click "Go"

5. Verify the database:
   - Click on `contact_db` in the left sidebar
   - You should see the `contacts` table
   - Click on the table to see the sample record

#### 4. Configure Database Connection

1. Open `php/contact.php` in a text editor

2. Update the database credentials (lines 20-23):
   ```php
   define('DB_HOST', 'localhost');      // Usually 'localhost'
   define('DB_NAME', 'contact_db');     // Database name
   define('DB_USER', 'root');           // Default XAMPP user is 'root'
   define('DB_PASS', '');               // Default XAMPP password is empty
   ```

3. Save the file

#### 5. Access the Website

Open your browser and navigate to:
```
http://localhost/your-project-name/
```

Replace `your-project-name` with your actual folder name.

---

## 🎨 Customization

### Update Color Scheme

1. Open `css/styles.css`
2. Find the `:root` section at the top (lines 6-9)
3. Replace the placeholder colors:
   ```css
   --primary-color: #3498db;    /* Replace [Primary color hex] */
   --accent-color: #e74c3c;     /* Replace [Accent color hex] */
   --neutral-color: #2c3e50;    /* Replace [Neutral color hex] */
   ```

### Update Site Purpose

Replace `[Site purpose]` in all HTML files with your actual site purpose:
- index.html
- about.html
- services.html
- portfolio.html
- contact.html

You can use Find & Replace in your text editor:
- Find: `[Site purpose]`
- Replace with: Your actual site name/purpose

### Add Your Images

Replace placeholder images in `assets/images/` with your actual images:
- `about-placeholder.jpg` - About page image
- `team-1.jpg`, `team-2.jpg`, `team-3.jpg` - Team member photos
- `portfolio-1.jpg` through `portfolio-9.jpg` - Portfolio images
- `placeholder.jpg` - Default lazy-load placeholder

**Recommended image sizes:**
- Portfolio images: 800x600px
- Team photos: 400x400px
- About image: 800x600px

---

## 📧 Testing the Contact Form

1. Navigate to the Contact page: `http://localhost/your-project-name/contact.html`

2. Fill out the form with test data

3. Click "Send Message"

4. Check if the submission was successful:
   - You should see a success message
   - Open phpMyAdmin and check the `contacts` table
   - Your submission should appear as a new row

5. Check error logs if something goes wrong:
   - Open `logs/errors.log` to see any PHP errors

---

## 🔧 Troubleshooting

### Issue: "Database connection failed"

**Solution:**
- Verify MySQL is running in XAMPP Control Panel
- Check database credentials in `php/contact.php`
- Ensure database `contact_db` exists in phpMyAdmin

### Issue: "404 Not Found" when submitting form

**Solution:**
- Verify the project is in the `htdocs` folder
- Check that the path to `php/contact.php` is correct
- Ensure Apache is running in XAMPP

### Issue: Form validation not working

**Solution:**
- Open browser console (F12) to check for JavaScript errors
- Verify `js/app.js` is loading correctly
- Clear browser cache and reload

### Issue: Images not loading

**Solution:**
- Check that images exist in `assets/images/` folder
- Verify image file names match those in HTML
- Check file permissions (should be readable)

### Issue: Mobile menu not working

**Solution:**
- Check browser console for JavaScript errors
- Verify `js/app.js` is loaded
- Test in different browsers

### Issue: Errors not logging

**Solution:**
- Check that `logs/` folder exists
- Verify folder has write permissions:
  ```bash
  # Mac/Linux
  chmod 755 logs/
  touch logs/errors.log
  chmod 644 logs/errors.log
  ```
- On Windows, ensure "Users" have write permissions

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change database password from default
- [ ] Update database credentials in `contact.php`
- [ ] Implement server-side CSRF token generation
- [ ] Add rate limiting to prevent spam
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set proper file permissions (644 for files, 755 for directories)
- [ ] Remove or protect `db.sql` file from public access
- [ ] Disable error display in PHP (set `display_errors = Off`)
- [ ] Keep error logging enabled for debugging
- [ ] Regular database backups
- [ ] Update PHP to latest stable version
- [ ] Consider adding CAPTCHA to contact form

---

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables, Flexbox, Grid
- **JavaScript (ES6+)** - Client-side interactivity
- **PHP 7.4+** - Server-side processing
- **MySQL 5.7+** - Database storage
- **PDO** - Database abstraction layer

---

## 📄 File Permissions (Production)

Recommended permissions for production server:

```bash
# Directories
chmod 755 css/ js/ php/ db/ assets/
chmod 755 assets/images/
chmod 755 logs/

# Files
chmod 644 *.html
chmod 644 css/*.css
chmod 644 js/*.js
chmod 644 php/*.php
chmod 644 assets/images/*

# Log files (writable)
chmod 644 logs/errors.log
```

---

## 🚀 Deployment to Production

### Steps for deploying to a live server:

1. **Upload Files**
   - Use FTP/SFTP to upload all files to your web host
   - Typical location: `public_html/` or `www/`

2. **Create Database**
   - Access your hosting control panel (cPanel, Plesk, etc.)
   - Create a new MySQL database
   - Create a database user with all privileges
   - Import `db/db.sql` via phpMyAdmin

3. **Update Configuration**
   - Edit `php/contact.php` with production database credentials
   - Update any hardcoded URLs if necessary

4. **Set Permissions**
   - Ensure `logs/` folder is writable
   - Set proper file permissions (see above)

5. **Test Everything**
   - Test all pages load correctly
   - Test contact form submission
   - Check error logs for any issues
   - Test on mobile devices

6. **Enable HTTPS**
   - Install SSL certificate (Let's Encrypt is free)
   - Update any HTTP links to HTTPS

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review error logs in `logs/errors.log`
- Verify all setup steps were completed
- Check browser console for JavaScript errors

---

## 📝 License

This project is provided as-is for educational and commercial use.

---

## ✨ Credits

Built with modern web development best practices following industry standards for security, accessibility, and performance.

---

**Last Updated:** 2025-01-20
