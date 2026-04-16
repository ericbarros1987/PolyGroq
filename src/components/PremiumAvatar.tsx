'use client';

import { useState, useEffect, useRef } from 'react';
import { AVATAR_CHARACTERS } from '@/data/avatarCharacters';

type Expression = 'neutral' | 'happy' | 'thinking' | 'listening' | 'speaking' | 'excited' | 'concerned';

interface PremiumAvatarProps {
  characterId?: string;
  expression?: Expression;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showTitle?: boolean;
}

const EXPRESSION_STYLES = {
  neutral: { mouthCurve: 0, eyeScale: 1, browAngle: 0, cheekIntensity: 0 },
  happy: { mouthCurve: 0.6, eyeScale: 0.9, browAngle: -5, cheekIntensity: 0.6 },
  thinking: { mouthCurve: -0.1, eyeScale: 1.1, browAngle: 10, cheekIntensity: 0 },
  listening: { mouthCurve: 0.1, eyeScale: 1.05, browAngle: 0, cheekIntensity: 0.2 },
  speaking: { mouthCurve: 0.4, eyeScale: 1, browAngle: 0, cheekIntensity: 0.3 },
  excited: { mouthCurve: 0.8, eyeScale: 0.85, browAngle: -10, cheekIntensity: 0.8 },
  concerned: { mouthCurve: -0.2, eyeScale: 1.15, browAngle: 15, cheekIntensity: 0 },
};

export default function PremiumAvatar({ 
  characterId = 'alisha',
  expression = 'neutral',
  isSpeaking = false,
  size = 'md',
  showName = true,
  showTitle = false
}: PremiumAvatarProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(expression);
  
  const character = AVATAR_CHARACTERS.find(c => c.id === characterId) || AVATAR_CHARACTERS[0];
  const style = EXPRESSION_STYLES[currentExpression];
  
  const sizes = {
    sm: { avatar: 80, container: 'w-24', text: 'text-sm' },
    md: { avatar: 120, container: 'w-36', text: 'text-base' },
    lg: { avatar: 160, container: 'w-48', text: 'text-lg' },
    xl: { avatar: 200, container: 'w-56', text: 'text-xl' },
  };
  
  const currentSize = sizes[size];

  useEffect(() => {
    if (isSpeaking) {
      setIsAnimating(true);
      const interval = setInterval(() => {
        setCurrentExpression(prev => prev === 'speaking' ? 'neutral' : 'speaking');
      }, 200);
      return () => clearInterval(interval);
    } else {
      setIsAnimating(false);
      setCurrentExpression(expression);
    }
  }, [isSpeaking, expression]);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${currentSize.container}`}>
        <div 
          className={`absolute inset-0 rounded-full blur-2xl opacity-50 bg-gradient-to-br ${character.colorScheme.background} ${
            isAnimating ? 'animate-pulse' : ''
          }`}
        />
        
        <div className="relative">
          <svg
            viewBox="0 0 200 200"
            width={currentSize.avatar}
            height={currentSize.avatar}
            className="drop-shadow-xl"
          >
            <defs>
              <linearGradient id={`bg-${character.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={character.colorScheme.primary} />
                <stop offset="100%" stopColor={character.colorScheme.secondary} />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
              </filter>
              <clipPath id="avatarClip">
                <circle cx="100" cy="100" r="95" />
              </clipPath>
            </defs>
            
            <circle cx="100" cy="100" r="98" fill={`url(#bg-${character.id})`} />
            
            <g clipPath="url(#avatarClip)">
              <ellipse cx="100" cy="95" rx="65" ry="70" fill="#F5D0C5" />
              
              <path 
                d="M35 80 Q35 30, 100 25 Q165 30, 165 80 Q165 50, 100 45 Q35 50, 35 80" 
                fill={character.hairColor} 
              />
              
              <g filter="url(#shadow)">
                <path
                  d={`M55 72 Q70 ${72 + style.browAngle}, 85 74`}
                  stroke={character.hairColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={`M115 74 Q130 ${74 + style.browAngle}, 145 72`}
                  stroke={character.hairColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                
                <g transform={`scale(1, ${style.eyeScale})`}>
                  <ellipse cx="70" cy="90" rx="12" ry="10" fill="white" />
                  <circle cx="72" cy="90" r="6" fill={character.eyeColor} />
                  <circle cx="74" cy="88" r="2" fill="white" />
                  
                  <ellipse cx="130" cy="90" rx="12" ry="10" fill="white" />
                  <circle cx="128" cy="90" r="6" fill={character.eyeColor} />
                  <circle cx="130" cy="88" r="2" fill="white" />
                </g>
                
                <path
                  d="M100 95 L97 115 Q100 118, 103 115 L100 95"
                  fill="#E8C4B8"
                  opacity="0.8"
                />
                
                {isAnimating ? (
                  <g>
                    <ellipse cx="100" cy="135" rx="20" ry="12" fill="#C96B6B" />
                    <ellipse cx="100" cy="138" rx="12" ry="6" fill="#A85555" />
                  </g>
                ) : (
                  <path
                    d={`M75 ${135 + style.mouthCurve * 10} Q100 ${145 + style.mouthCurve * 15}, 125 ${135 + style.mouthCurve * 10}`}
                    stroke="#C96B6B"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
                
                {style.cheekIntensity > 0 && (
                  <>
                    <ellipse cx="50" cy="115" rx="15" ry="10" fill="#FFB5B5" opacity={style.cheekIntensity * 0.5} />
                    <ellipse cx="150" cy="115" rx="15" ry="10" fill="#FFB5B5" opacity={style.cheekIntensity * 0.5} />
                  </>
                )}
              </g>
              
              <path
                d="M20 200 Q20 160, 50 150 Q100 145, 150 150 Q180 160, 180 200"
                fill={character.colorScheme.primary}
              />
            </g>
            
            {isSpeaking && (
              <g>
                <circle cx="100" cy="100" r="95" fill="none" stroke="white" strokeWidth="2" opacity="0.5">
                  <animate attributeName="r" values="95;105;95" dur="0.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="0.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="100" r="95" fill="none" stroke="white" strokeWidth="2" opacity="0.5">
                  <animate attributeName="r" values="95;110;95" dur="0.5s" begin="0.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="0.5s" begin="0.2s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
            
            <g transform="translate(140, 140)">
              <circle cx="0" cy="0" r="25" fill="white" />
              <circle cx="0" cy="0" r="22" fill={character.colorScheme.primary} />
              <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">AI</text>
            </g>
          </svg>
          
          {isSpeaking && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-white rounded-full animate-bounce"
                  style={{
                    height: '8px',
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {showName && (
        <div className="mt-3 text-center">
          <p className="font-bold text-white text-lg">{character.name}</p>
          {showTitle && (
            <p className="text-purple-200 text-sm">{character.title}</p>
          )}
        </div>
      )}
    </div>
  );
}
