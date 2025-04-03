import React, { useState } from 'react';

const LoginForm = ({ onSwitch, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3056/api/shop/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Đăng nhập thành công!');
        console.log('Received tokens:', result.data.tokens);
        onLogin(result); // lưu kết quả đăng nhập (bao gồm token & thông tin user)
        setEmail('');
        setPassword('');
      } else {
        alert('Đăng nhập thất bại: ' + (result.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại!');
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Nhập email"
          />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Nhập mật khẩu"
          />
        </div>
        <br />
        <button type="submit">Đăng nhập</button>
      </form>
      <br />
      <button onClick={() => onSwitch('signup')}>
        Chưa có tài khoản? Đăng ký
      </button>
    </div>
  );
};

export default LoginForm;
