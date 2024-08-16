const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
require('dotenv').config();

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/send-message') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const parsedData = querystring.parse(body);
            sendEmail(parsedData.name, parsedData.email, parsedData.message);
            res.writeHead(302, { 'Location': '/thank-you' });
            res.end();
        });
    } else {
        let filePath = '';

        switch (req.url) {
            case '/':
                filePath = 'index.html';
                break;
            case '/about':
                filePath = 'about.html';
                break;
            case '/contact-me':
                filePath = 'contact-me.html';
                break;
            case '/styles.css':
                filePath = 'styles.css';
                break;
            case '/mojo1.png':
                filePath = 'mojo1.png';
                break;
            case '/mojo2.png':
                filePath = 'mojo2.png';
                break;    
            case '/mojo3.png':
                filePath = 'mojo3.png';
                break;
            case '/mojo4.png':
                filePath = 'mojo4.png';
                break;
            case '/mojo5.png':
                filePath = 'mojo5.png';
                break;
            case '/mojo-video.mp4':
                filePath = 'mojo-video.mp4';
                break;
            case '/thank-you':
                filePath = 'thank-you.html';
                break;
            default:
                filePath = '404.html';
                break;
        }

        const extname = path.extname(filePath);
        let contentType = 'text/html';
        switch (extname) {
            case '.css':
                contentType = 'text/css';
                break;
            case '.png':
                contentType = 'image/png';
                break;
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end(`Error loading ${filePath}`);
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

function sendEmail(name, email, message) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'leylamemiguven@gmail.com', 
            pass: process.env.GMAIL_PASS  
        }
    });

    let mailOptions = {
        from: email,
        to: 'leylamemiguven@gmail.com',
        subject: `Message from ${name}`,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

server.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});
