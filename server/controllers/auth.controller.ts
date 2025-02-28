import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import Company from "../models/company.model";
import jwt from "jsonwebtoken";
import passport from "passport";
import { hashPassword, comparePassword } from "../utils/password";
import config from "../config";
import { validateLoginInput, validateRegisterInput } from "../validators/auth.validator";

// Generate JWT Token
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// Register new company and admin user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, companyName, businessType, businessSize } = validateRegisterInput(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new company
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

    const company = await Company.create({
      name: companyName,
      businessType: businessType || "retail",
      businessSize: businessSize || "small",
      subscriptionPlan: "trial",
      subscriptionStatus: "trial",
      subscriptionStartDate: new Date(),
      subscriptionEndDate: trialEndDate,
      contactEmail: email,
    });

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      companyId: company._id,
      role: "admin",
      permissions: ["manage_all"],
      isActive: true,
    });

    // Generate JWT token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      company: {
        id: company._id,
        name: company.name,
        subscriptionPlan: company.subscriptionPlan,
        subscriptionStatus: company.subscriptionStatus,
        subscriptionEndDate: company.subscriptionEndDate,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", { session: false }, (err: Error, user: any, info: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: info.message || "Authentication failed" });
    }

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Remove sensitive data
    user.password = undefined;

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      token,
    });
  })(req, res, next);
};

// Logout user
export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.json({ message: "Logout successful" });
  });
};

// Get current user
export const getCurrentUser = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      companyId: req.user.companyId,
    },
  });
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if the user exists or not for security reasons
      return res.json({ message: "If your email is registered, you will receive a password reset link" });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, config.jwt.resetSecret, {
      expiresIn: "1h",
    });

    // Store token in database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // In a real application, send an email with reset link
    // For now, just return the token (not secure for production)
    res.json({ 
      message: "If your email is registered, you will receive a password reset link",
      // Only include this in development
      ...(config.environment === "development" && { resetToken })
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.resetSecret);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find user with token
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { name, email } = req.body;
    const updates: Record<string, any> = {};

    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

// Admin endpoints

// Get all users (admin only)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create user (admin only)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, username, role, businessSize, businessType, status, permissions } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      username: username || email.split('@')[0] + uuidv4().substring(0, 6),
      password: hashedPassword,
      role: role || 'staff',
      permissions,
      businessSize: businessSize || 'small',
      businessType,
      status: status || 'active'
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update user (admin only)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, username, role, permissions, status, businessSize, businessType } = req.body;

    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          name, 
          email, 
          username,
          role,
          permissions,
          status,
          businessSize,
          businessType
        } 
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete user (admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};