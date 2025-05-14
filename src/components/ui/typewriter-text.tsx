
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  cursor?: boolean;
}

export function TypewriterText({
  text,
  delay = 40,
  className = "",
  onComplete,
  cursor = true
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[index]);
        setIndex(index + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [index, delay, text, onComplete, isComplete]);

  return (
    <span className={cn(className)}>
      {displayText}
      {cursor && !isComplete && (
        <span className="animate-pulse inline-block w-1 h-5 bg-wybe-primary ml-0.5"></span>
      )}
      {cursor && isComplete && (
        <span className="animate-pulse inline-block w-1 h-5 bg-wybe-primary ml-0.5 opacity-0"></span>
      )}
    </span>
  );
}

export function TypewriterHeading({
  text,
  highlightWords = [],
  className = "",
  highlightClassName = "text-orange-500",
  delay = 40,
  tag = "h2",
  cursor = true
}: {
  text: string;
  highlightWords?: string[];
  className?: string;
  highlightClassName?: string;
  delay?: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  cursor?: boolean;
}) {
  const words = text.split(' ');
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (index < words.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => [...prev, words[index]]);
        setIndex(index + 1);
      }, delay * 5);
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
    }
  }, [index, delay, words, isComplete]);

  const HeadingTag = tag as keyof JSX.IntrinsicElements;
  
  return (
    <HeadingTag className={cn(className)}>
      {displayText.map((word, idx) => (
        <React.Fragment key={idx}>
          {highlightWords.includes(word) ? (
            <span className={highlightClassName}>{word}</span>
          ) : (
            word
          )}
          {idx < displayText.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
      {cursor && !isComplete && (
        <span className="animate-pulse inline-block w-2 h-6 bg-orange-500 ml-0.5"></span>
      )}
    </HeadingTag>
  );
}

export function RotatingTypewriterWord({
  words,
  colors = ["text-orange-500", "text-blue-500", "text-green-500", "text-purple-500"],
  typingDelay = 100,
  deletingDelay = 50,
  pauseDuration = 1500,
  className = ""
}: {
  words: string[];
  colors?: string[];
  typingDelay?: number;
  deletingDelay?: number;
  pauseDuration?: number;
  className?: string;
}) {
  const [currentWord, setCurrentWord] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  
  useEffect(() => {
    const word = words[wordIndex];
    const currentDelay = isDeleting ? deletingDelay : typingDelay;
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setCurrentWord(word.substring(0, currentWord.length + 1));
        
        // If we completed the word, start deleting after a pause
        if (currentWord.length === word.length) {
          setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      } else {
        // Deleting
        setCurrentWord(word.substring(0, currentWord.length - 1));
        
        // If we deleted the word, move to the next word
        if (currentWord.length === 0) {
          setIsDeleting(false);
          setWordIndex((wordIndex + 1) % words.length);
          setColorIndex((colorIndex + 1) % colors.length);
        }
      }
    }, currentDelay);
    
    return () => clearTimeout(timeout);
  }, [currentWord, isDeleting, wordIndex, words, typingDelay, deletingDelay, pauseDuration, colorIndex, colors]);
  
  return (
    <span className={cn(colors[colorIndex], className)}>
      {currentWord}
      <span className="inline-block w-1 h-5 ml-0.5 bg-current animate-pulse"></span>
    </span>
  );
}

export function SplitColorHeading({
  text,
  className = "",
  whiteTextClassName = "text-white",
  coloredTextClassName = "text-orange-500",
  splitAt = 0.5
}: {
  text: string;
  className?: string;
  whiteTextClassName?: string;
  coloredTextClassName?: string;
  splitAt?: number;
}) {
  const splitPoint = Math.floor(text.length * splitAt);
  const firstPart = text.substring(0, splitPoint);
  const secondPart = text.substring(splitPoint);

  return (
    <h1 className={cn(className)}>
      <span className={whiteTextClassName}>{firstPart}</span>
      <span className={coloredTextClassName}>{secondPart}</span>
    </h1>
  );
}
