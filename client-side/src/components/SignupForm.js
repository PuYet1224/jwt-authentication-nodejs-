import React, { useState } from 'react';

const SignupForm = ({ onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3056/api/shop/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        onSwitch('login');
      } else {
        alert('Đăng ký thất bại: ' + (result.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại!');
      console.error('Signup error:', error);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Họ tên:</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nhập họ tên"
          />
        </div>
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
        <button type="submit">Đăng ký</button>
      </form>
      <br />
      <button onClick={() => onSwitch('login')}>
        Đã có tài khoản? Đăng nhập
      </button>
    </div>
  );
};

export default SignupForm;
