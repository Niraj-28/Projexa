const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const User = require('../models/User');

// Generate Access Token (Short-lived: 15 minutes)
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

// Generate Refresh Token (Long-lived: 7 days)
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

// Set refresh token in httpOnly cookie
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// @desc    Register a new company and admin account
// @route   POST /api/auth/register-company
// @access  Public
const registerCompany = async (req, res) => {
  try {
    const { companyName, companyEmail, industry, adminName, adminEmail, password } = req.body;

    if (!companyName || !companyEmail || !adminName || !adminEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: adminEmail.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Admin email is already registered' });
    }

    // Check if company email already exists
    const companyExists = await Company.findOne({ email: companyEmail.toLowerCase() });
    if (companyExists) {
      return res.status(400).json({ success: false, message: 'Company email is already registered' });
    }

    // Create unique workspace slug from company name
    let workspaceUrl = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Ensure uniqueness of workspaceUrl
    let urlConflict = await Company.findOne({ workspaceUrl });
    if (urlConflict) {
      const suffix = Math.floor(1000 + Math.random() * 9000);
      workspaceUrl = `${workspaceUrl}-${suffix}`;
    }

    // Create Company
    const company = await Company.create({
      name: companyName,
      email: companyEmail.toLowerCase(),
      industry,
      workspaceUrl,
      subscriptionPlan: 'Free',
    });

    // Create Admin User
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      passwordHash: password, // Pre-save hook will hash this
      role: 'company_admin',
      company: company._id,
      designation: 'Company Admin',
    });

    // Generate tokens
    const accessToken = generateAccessToken(adminUser._id);
    const refreshToken = generateRefreshToken(adminUser._id);

    // Save refresh token to user record
    adminUser.refreshTokens.push(refreshToken);
    await adminUser.save();

    // Send HTTPOnly cookie
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      token: accessToken,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        company: {
          id: company._id,
          name: company.name,
          email: company.email,
          workspaceUrl: company.workspaceUrl,
          subscriptionPlan: company.subscriptionPlan,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get tokens
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user by email and select passwordHash explicitly
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash').populate('company');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Your account is currently inactive' });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Add refresh token to active tokens list
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Send HTTPOnly cookie
    setRefreshTokenCookie(res, refreshToken);

    // Prepare user details to send back (exclude passwordHash and refreshTokens)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company
        ? {
            id: user.company._id,
            name: user.company.name,
            email: user.company.email,
            workspaceUrl: user.company.workspaceUrl,
            subscriptionPlan: user.company.subscriptionPlan,
          }
        : null,
      department: user.department,
      designation: user.designation,
      mustChangePassword: user.mustChangePassword,
      isActive: user.isActive,
    };

    res.status(200).json({
      success: true,
      token: accessToken,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

// @desc    Refresh access token using refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(200).json({ success: false, message: 'No refresh token provided' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(200).json({ success: false, message: 'Invalid refresh token' });
    }

    // Check if token exists in user's refreshTokens array
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(200).json({ success: false, message: 'Refresh token revoked or invalid' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ success: false, message: 'Server error during token refresh' });
  }
};

// @desc    Logout user & clear refresh token
// @route   POST /api/auth/logout
// @access  Private (but handles clearing cookie even if auth header is missing)
const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      // Decode user ID to remove token from DB
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await User.findByIdAndUpdate(decoded.id, {
          $pull: { refreshTokens: token },
        });
      } catch (err) {
        // Token verification failed but we'll still clear the cookie
        console.error('Failed to verify refresh token on logout:', err.message);
      }
    }

    // Clear client-side cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error during logout' });
  }
};

// @desc    Send OTP for password reset (same as TradeXpert sendOtp)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email address' });
    }

    // Enforce 60-second cooldown rate limit
    if (user.resetOtpLastSent && (new Date() - user.resetOtpLastSent < 60000)) {
      const secondsLeft = Math.ceil((60000 - (new Date() - user.resetOtpLastSent)) / 1000);
      return res.status(429).json({ success: false, message: `Please wait ${secondsLeft} seconds before requesting a new OTP.` });
    }

    // Generate numeric 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    user.resetOtpAttempts = 0; // Reset incorrect attempts counter
    user.resetOtpLastSent = new Date();
    await user.save();

    let emailSent = false;
    const nodemailer = require('nodemailer');

    // Send via nodemailer if SMTP is fully configured
    const isSmtpConfigured =
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_USER !== 'your_email@gmail.com' &&
      process.env.SMTP_PASS &&
      process.env.SMTP_PASS !== 'your_gmail_app_password';

    if (isSmtpConfigured) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const fromEmail = process.env.SMTP_FROM || `"WorkArena Security" <${process.env.SMTP_USER}>`;

        const mailOptions = {
          from: fromEmail,
          to: user.email,
          subject: '🔑 Your WorkArena Verification Code',
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; color: #111111;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #111111; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: 0.5px;">WorkArena</h1>
                <p style="color: #6b7280; font-size: 13px; margin: 5px 0 0 0;">Sprint & Workspace Manager</p>
              </div>
              <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <h2 style="font-size: 18px; font-weight: 700; color: #111111; margin-top: 0; margin-bottom: 15px; text-align: center;">Reset Your Password</h2>
                <p style="font-size: 14px; line-height: 22px; color: #4b5563; margin-bottom: 20px;">
                  We received a request to reset your WorkArena account password. Use the verification code below to proceed. This code is valid for <strong>10 minutes</strong>.
                </p>
                <div style="text-align: center; margin: 25px 0;">
                  <div style="display: inline-block; background-color: #f3f4f6; border: 2px dashed #111111; border-radius: 8px; padding: 15px 40px; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #111111;">
                    ${otp}
                  </div>
                </div>
                <p style="font-size: 12px; color: #dc2626; text-align: center; font-weight: 600; margin-top: 15px;">
                  ⚠️ Do not share this verification code with anyone. Our support team will never ask for it.
                </p>
              </div>
              <div style="text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 10px;">
                <p style="margin: 0 0 8px 0;">This is an automated security message. If you did not request this, please secure your account.</p>
                <p style="margin: 0;">&copy; 2026 WorkArena Team. All Rights Reserved.</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (mailError) {
        console.error('❌ Mail delivery error:', mailError);
      }
    }

    // Print styled console box for developers (guaranteed fallback)
    console.log(`
┌────────────────────────────────────────────────────────┐
│             🔑  WORKAREA OTP VERIFICATION              │
├────────────────────────────────────────────────────────┤
│  Recipient:  ${user.email.padEnd(41)} │
│  OTP Code:   ${otp.padEnd(41)} │
│  Expires:    10 Minutes                                │
├────────────────────────────────────────────────────────┤
│  Mail Sent:  ${(emailSent ? 'YES (Nodemailer)' : 'NO (Console Fallback)').padEnd(41)} │
└────────────────────────────────────────────────────────┘
    `);

    res.status(200).json({ 
      success: true, 
      message: emailSent 
        ? 'OTP sent successfully to your registered email!' 
        : 'OTP generated successfully! Check server console logs.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error during forgot password' });
  }
};

// @desc    Verify OTP for password reset (same as TradeXpert verifyOtp)
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.resetOtp) {
      return res.status(400).json({ success: false, message: 'No active verification code request found. Please request a new OTP.' });
    }

    // Check expiry
    if (new Date() > user.resetOtpExpires) {
      user.resetOtp = null;
      user.resetOtpExpires = null;
      user.resetOtpAttempts = 0;
      await user.save();
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }

    // Verify OTP code and check brute force attempts
    if (user.resetOtp !== otp) {
      user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
      await user.save();

      const maxAttempts = 5;
      const attemptsRemaining = maxAttempts - user.resetOtpAttempts;

      if (attemptsRemaining <= 0) {
        user.resetOtp = null;
        user.resetOtpExpires = null;
        user.resetOtpAttempts = 0;
        await user.save();
        return res.status(400).json({ success: false, message: 'Too many failed attempts. This OTP has been invalidated. Please request a new one.' });
      }

      return res.status(400).json({ success: false, message: `Invalid verification code. ${attemptsRemaining} attempts remaining.` });
    }

    // Create a temporary JWT signed token indicating OTP has been verified
    const resetToken = jwt.sign(
      { id: user._id, email, resetVerified: true },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    // Clean up OTP from DB immediately to prevent replay attacks
    user.resetOtp = null;
    user.resetOtpExpires = null;
    user.resetOtpAttempts = 0;
    await user.save();

    res.status(200).json({ success: true, message: 'OTP verified successfully', resetToken });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password using verified session token (same as TradeXpert resetForgottenPassword)
// @route   POST /api/auth/reset-forgotten-password
// @access  Public
const resetForgottenPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required' });
    }

    // Verify reset session JWT
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Your reset session has expired or is invalid. Please request a new OTP.' });
    }

    if (!decoded || !decoded.resetVerified || !decoded.id) {
      return res.status(400).json({ success: false, message: 'Invalid reset session token.' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update password (pre-save hook will hash it)
    user.passwordHash = newPassword;
    
    // Clear any leftover OTP fields
    user.resetOtp = null;
    user.resetOtpExpires = null;
    user.resetOtpAttempts = 0;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change user password (first login or normal change)
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    // Find the user with passwordHash selected
    const user = await User.findById(req.user.id).select('+passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password if user has already changed password before (not forced change check or standard flow)
    // For first login, if mustChangePassword is true, they might only send newPassword, but we can verify currentPassword if provided.
    if (currentPassword) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Incorrect current password' });
      }
    } else if (!user.mustChangePassword) {
      // If user doesn't need first-login change, currentPassword is required
      return res.status(400).json({ success: false, message: 'Please provide current password' });
    }

    // Set new password (pre-save hook will hash it)
    user.passwordHash = newPassword;
    user.mustChangePassword = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password change' });
  }
};

// @desc    Authenticate user via Google OAuth2 access token
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Google access token is required' });
    }

    // Verify token by calling Google User Info API
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    if (!response.ok) {
      return res.status(400).json({ success: false, message: 'Invalid Google access token' });
    }

    const payload = await response.json();
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Could not retrieve email from Google account' });
    }

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() }).populate('company');
    
    if (!user) {
      // Auto-provision a new Company and Admin user
      let workspaceUrl = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-workspace`;
      workspaceUrl = workspaceUrl.replace(/-+/g, '-').replace(/^-|-$/g, '');

      // Ensure uniqueness
      let urlConflict = await Company.findOne({ workspaceUrl });
      if (urlConflict) {
        const suffix = Math.floor(1000 + Math.random() * 9000);
        workspaceUrl = `${workspaceUrl}-${suffix}`;
      }

      // Create Company
      const company = await Company.create({
        name: `${name}'s Workspace`,
        email: email.toLowerCase(),
        industry: 'Other',
        workspaceUrl,
        subscriptionPlan: 'Free',
      });

      // Create Admin User with temporary secure password
      const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
      user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash: tempPassword,
        role: 'company_admin',
        company: company._id,
        designation: 'Company Admin',
      });
      
      user.company = company;
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Your account is currently inactive' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user record
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Send HTTPOnly cookie
    setRefreshTokenCookie(res, refreshToken);

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company
        ? {
            id: user.company._id,
            name: user.company.name,
            email: user.company.email,
            workspaceUrl: user.company.workspaceUrl,
            subscriptionPlan: user.company.subscriptionPlan,
          }
        : null,
      department: user.department,
      designation: user.designation,
      mustChangePassword: user.mustChangePassword,
      isActive: user.isActive,
    };

    res.status(200).json({
      success: true,
      token: accessToken,
      user: userResponse,
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ success: false, message: 'Server error during Google authentication', error: error.message });
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
};

module.exports = {
  registerCompany,
  login,
  googleLogin,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  verifyOtp,
  resetForgottenPassword,
  changePassword,
};
