import React, { useEffect } from 'react';

interface MessageProps {
  message?: string;
  color?: string;
  visible?: boolean;
  onVisibilityChange?: (isVisible: boolean) => void;
}

const Message: React.FC<MessageProps> = ({
  message = 'This is a message',
  color = 'red',
  visible = true,
  onVisibilityChange,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onVisibilityChange) {
        onVisibilityChange(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [onVisibilityChange]);

  const bgColor = `bg-${color}-500`;
  const border = `border-${color}-500`;

  return (
    <div
      className={`p-4 rounded-md text-white font-bold ${bgColor} ${border}`}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <p>{message}</p>
    </div>
  );
};

export default Message;
