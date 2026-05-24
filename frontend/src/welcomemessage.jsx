import React, { useState, useEffect } from 'react';
import { GetWindowsUser } from '../../wailsjs/go/main/App';

function WelcomeMessage() {
  const [username, setUsername] = useState('user');

  useEffect(() => {
    const loadUsername = async () => {
      try {
        const name = await GetWindowsUser();
        const cleanName = name.split('\\').pop() || name;
        setUsername(cleanName);
      } catch (error) {
        console.error('Не удалось получить имя пользователя:', error);
      }
    };
    
    loadUsername();
  }, []);

  return (
    <div className="page-title-block">
      <h2 className="page-greeting">Добро пожаловать, {username}</h2>
      <p className="page-subtitle">Системная информация обновляется каждые 2 секунды</p>
    </div>
  );
}

export default WelcomeMessage;