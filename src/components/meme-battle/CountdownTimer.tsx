
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  className,
  onComplete
}) => {
  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);
      
      if (updatedTimeLeft.total <= 0 && onComplete) {
        onComplete();
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  const padWithZero = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  // Display format depends on time remaining
  const formatDisplay = () => {
    if (timeLeft.total <= 0) {
      return '00:00:00';
    }
    
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${padWithZero(timeLeft.hours)}:${padWithZero(timeLeft.minutes)}:${padWithZero(timeLeft.seconds)}`;
    }
    
    return `${padWithZero(timeLeft.hours)}:${padWithZero(timeLeft.minutes)}:${padWithZero(timeLeft.seconds)}`;
  };

  return (
    <span className={className}>
      {formatDisplay()}
    </span>
  );
};

export default CountdownTimer;
