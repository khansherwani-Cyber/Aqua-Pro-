import { useEffect } from 'react';
import { useStore } from '../store/useStore';

const Toast = () => {
  const { notification, clearNotification } = useStore();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(clearNotification, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification) return null;

  const typeStyles = {
    success: 'bg-green-500/20 border-green-400 text-green-400',
    error: 'bg-red-500/20 border-red-400 text-red-400',
    info: 'bg-platinum/20 border-platinum text-platinum',
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-float-slow">
      <div className={`glass-sm px-6 py-3 rounded-full text-sm font-medium border ${typeStyles[notification.type] || typeStyles.info}`}>
        {notification.msg}
      </div>
    </div>
  );
};
export default Toast;
