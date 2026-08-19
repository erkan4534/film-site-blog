const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwtConfig.js');
const User = require('../models/User.js');

const registerUser = async (req, res) => {
  try {
    const { password,...otherData } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
        
    const newUser = new User.create({  password: hashedPassword, ...otherData });

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, secret, { expiresIn });
    
    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu!', user: newUser, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre'  });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn });

    res.status(200).json({ message: 'Giriş başarılı!', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};