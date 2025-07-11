const express = require('express');
const router = express.Router();

app.post('/api/auth/logout', authenticate, (req, res) => {
    try {
      // In a real application, you might want to:
      // 1. Add the token to a blacklist
      // 2. Clear any server-side sessions
      // 3. Clear any cookies
      
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Protected route example
  app.get('/api/users/me', authenticate, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // API routes
  app.use('/api/sales', salesRouter);
  app.use('/api/users', usersRouter);


module.exports = router;