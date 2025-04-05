export const InterestedMailTemplate = (fromUser, fromUsername, toUser) => {
  return `
<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>New Match Interest - DevRoot</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 30px auto;
          background-color: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #1B2635;
          color: #fff;
          padding: 20px;
          text-align: center;
        }
        .header img {
          width:120px;
          margin-bottom: -25px;
          
        }
        
        .header p {
          margin-bottom: 0.5rem; 
          font-size: 1.5rem;     
          font-weight: bold;
          background: linear-gradient(to right, #3982F2, #30C93D); 
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        .content {
          padding: 30px;
          line-height: 1.6;
        }
        .highlight {
          background-color: #eef3fd;
          padding: 10px 15px;
          border-radius: 6px;
          margin: 20px 0;
          color: #1a1a40;
          font-weight: 500;
        }
        .button {
          display: inline-block;
          background-color: #5b6fff;
          color: #fff;
          padding: 12px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin-top: 20px;
        }
        .footer {
          background-color: #f0f0f0;
          text-align: center;
          padding: 15px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://res.cloudinary.com/dklos8vki/image/upload/v1747900456/logo_uzp4te.png" alt="devroot logo" />
          <p>Connect. Collaborate. Grow.</p>
        </div>
        <div class="content">
          <h2>🔥 You've Got a New Connection Request!</h2>
          <p>Hello ${toUser},</p>
          <p>${fromUser} just swiped right on your profile! 👀</p>
          <div class="highlight">
            They are interested in connecting and possibly collaborating on exciting dev projects.
          </div>
          <p>Log in to check out their profile, swipe back, and start building something awesome together!</p>
          <a href="${
            process.env.LIVE_WEBSITE_LINK + "/profile/" + fromUsername
          }" class="button">View Profile</a>
          <p style="margin-top: 30px;">Happy Matching,<br>The DevRoot Team</p>
        </div>
        <div class="footer">
          © 2025 DevRoot. All rights reserved.<br />
          You are receiving this email because you're a registered user at <a href="${
            process.env.LIVE_WEBSITE_LINK
          }">DevRoot</a>.
        </div>
      </div>
    </body>
  </html>`;
};
