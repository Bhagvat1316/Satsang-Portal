import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!userId || !password) {
      setError('Please enter both User ID and Password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(userId, password);
      
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md">
        <Card.Header 
          title="Member Login" 
          subtitle="Access your portal dashboard" 
          className="text-center pb-2 border-none"
        />
        <Card.Body>
          {error && (
            <div className="bg-error-container text-error-onContainer p-3 rounded-button mb-6 text-body-md">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <Input 
              label="User ID" 
              id="userId" 
              placeholder="e.g. SAT1001 or ADMIN001" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <PasswordInput 
              label="Password" 
              id="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              type="submit" 
              isLoading={isLoading} 
              className="mt-4 w-full"
            >
              Login
            </Button>
          </form>
          <div className="mt-6 text-center text-onSurface-variant text-body-md">
            <p>If you don't have an account, please contact the administrator.</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
