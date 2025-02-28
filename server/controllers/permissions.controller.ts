
import { Request, Response } from 'express';
import User from '../models/user.model';
import { PERMISSIONS, getUserPermissions } from '../middleware/rbac';

// Get all available permissions
export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    res.json({ permissions: PERMISSIONS });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Failed to fetch permissions' });
  }
};

// Get permissions for a user
export const getUserPermissionsById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const permissions = getUserPermissions(user);
    res.json({ permissions });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({ message: 'Failed to fetch user permissions' });
  }
};

// Update custom permissions for a user
export const updateUserPermissions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { permissions } = req.body;
    
    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: 'Permissions must be an array' });
    }
    
    // Only admins can update permissions
    if ((req.user as any).role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update user permissions' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.permissions = permissions;
    await user.save();
    
    res.json({ message: 'User permissions updated successfully', user });
  } catch (error) {
    console.error('Error updating user permissions:', error);
    res.status(500).json({ message: 'Failed to update user permissions' });
  }
};

// Get current user's permissions
export const getCurrentUserPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = getUserPermissions(req.user);
    res.json({ permissions });
  } catch (error) {
    console.error('Error fetching current user permissions:', error);
    res.status(500).json({ message: 'Failed to fetch current user permissions' });
  }
};
