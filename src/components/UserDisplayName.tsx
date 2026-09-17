import React from 'react';
import { getFontFamily } from '../utils/profileCustomization';

interface UserDisplayNameProps {
  name: string;
  font?: string;
  color?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const UserDisplayName: React.FC<UserDisplayNameProps> = ({
  name,
  font,
  color,
  className = '',
  onClick,
}) => {
  const fontFamily = getFontFamily(font);

  // Check if color is a gradient
  const isGradient = color && color.startsWith('linear-gradient');

  const style: React.CSSProperties = {
    fontFamily: fontFamily !== 'inherit' ? fontFamily : undefined,
  };

  if (isGradient) {
    style.backgroundImage = color;
    style.WebkitBackgroundClip = 'text';
    style.WebkitTextFillColor = 'transparent';
  } else if (color) {
    style.color = color;
  }

  return (
    <span
      onClick={onClick}
      style={style}
      className={`font-semibold tracking-normal inline-block ${onClick ? 'cursor-pointer hover:underline' : ''} ${className}`}
    >
      {name}
    </span>
  );
};
