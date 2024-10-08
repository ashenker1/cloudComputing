const userModel = require('../models/userModel');

// Controller to create a new user
async function createUser(req, res) {
  try {
    const { username, password, email } = req.body;
    const result = await userModel.createUser(username, password, email);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send('Server Error');
  }
}

// Controller to get all users
async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Server Error');
  }
}

// Controller to get user by ID
async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).send('Server Error');
  }
}

// Controller to update a user
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, password, email } = req.body;
    await userModel.updateUser(id, username, password, email);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Server Error');
  }
}

// Controller to delete a user
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await userModel.deleteUser(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
