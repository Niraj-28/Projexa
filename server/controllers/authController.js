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

// @desc    Simulate forgot password reset link
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

    res.status(200).json({
      success: true,
      message: 'Password reset instructions have been simulated and sent to your email.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error during forgot password' });
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
  changePassword,
};
