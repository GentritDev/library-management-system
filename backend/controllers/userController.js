const { User, Book } = require('../models');
const bcrypt = require('bcryptjs');


// @desc Get all users (admin only)
// @routes GET /api/users
// @access Private + admin

const getAllUsers = async (req,res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password']}, // Dont send passwords
            include: [{
                model: Book,
                as: 'books',
                attributes: ['id', 'title', 'author']

            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch(error) {
        console.error('Get all  users error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


// @desc Get user by ID (admin only)
// @route GET /api/users/:id
// @access Private + admin

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: {exclude: ['password']},
            include: [{
                model: Book,
                as: 'books'
        }]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'USer not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch(error) {
        console.error('Get user error');
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


// @desc Update user ( admin only)
// @route PUT /api/users/:id
//@access Private + admin

const updateUser = async (req, res) => {
    try{
        
        const {name, email, password} = req.body;

        const user = await User.findByPk(req.params.id);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prepare update data
        const updateData = {};
        if (name) updateData.name = name;
        if(email) updateData.email = email;

        //Hash new password if provided
        if (password) {
            const salt  = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Upadate user
        await user.update(updateData);

        // return user without password
        const updatedUser = user.toJSON();
        delete updatedUser.password;

        res.status(200).json({
            success: true,
            message: 'User update successfully',
            data: updatedUser
        });
    } catch(error) {
        console.error('Update user error');

        // handle duplicate email error

        if(error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc Delete user(admin only)
// @route DELETE /api/users/:id
// @access Private + admin 

const deleteUser = async (req,res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        await user.destroy();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch(error) {
        console.error('Delete user error ');
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc Toggle user admin status (admin )
// @route PUT /api/users/:id/toggle-admin
// @access Private + admin

const toggleAdminStatus = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from removing their own admin status

        if (user.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot modify your own admin status'
            });
        }

        // toggle admin status

        await user.update({ isAdmin: !user.isAdmin});

        // return user without password
        const updatedUser = user.toJSON();
        delete updatedUser.password;

        //Return user without password

        res.status(200).json({
            success: true,
            message: `USer ${user.isAdmin ? 'promoted to ' : 'demoted from'} admin`,
            data: updatedUser
        });

    } catch(error) {
        console.error('Toggle admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

//@desc Get current user's profile
// @route GET /api/users/profile
// @access PRivate

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: {exclude: ['password']},
            include: [{
                model: Book,
                as: 'books'
            }]
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch(error ) {
        console.error('Get profile error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc Update current user's profile
// @route PUT /api/users/profile
// @access private

const updateMyProfile = async (req, res) => {
    try {
       

        const { name, email, password } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // PrePare update data
        const updateData = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;

        // Hash new password if provided
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            updateData. password = await bcrypt.hash(password, salt);
        }


        // Update user
        await user.update(updateData);

        //   Fetch updated user and return without password
        const updatedUser = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }  // Exclude password from response
        });

       

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser  // Return full user object
        });

    } catch (error) { 
        console.error(' Update profile error:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error. message
        });
    }
};


module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleAdminStatus,
    getMyProfile,
    updateMyProfile
};
