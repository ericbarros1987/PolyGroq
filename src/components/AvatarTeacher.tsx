'use client';

import { useState, useEffect, useRef } from 'react';

export type AvatarExpression = 
  | 'happy' 
  | 'thinking' 
  | 'speaking' 
  | 'listening' 
  | 'excited' 
  | 'encouraging' 
  | 'explaining'
  | 'correcting'
  | 'celebrating';

export type AvatarMood = 'happy' | 'neutral' | 'excited' | 'encouraging' | 'focused';

interface AvatarTeacherProps {
  expression: AvatarExpression;
  mood: AvatarMood;
  isSpeaking: boolean;
  level: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const EXPRESSION_COLORS = {
  happy: { primary: '#10B981', secondary: '#059669' },
  thinking: { primary: '#8B5CF6', secondary: '#7C3AED' },
  speaking: { primary: '#3B82F6', secondary: '#2563EB' },
  listening: { primary: '#06B6D4', secondary: '#0891B2' },
  excited: { primary: '#F59E0B', secondary: '#D97706' },
  encouraging: { primary: '#EC4899', secondary: '#DB2777' },
  explaining: { primary: '#6366F1', secondary: '#4F46E5' },
  correcting: { primary: '#EF4444', secondary: '#DC2626' },
  celebrating: { primary: '#FFD700', secondary: '#FFA500' },
};

export default function AvatarTeacher({ 
  expression, 
  mood, 
  isSpeaking, 
  level,
  size = 'md',
  animated = true 
}: AvatarTeacherProps) {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [eyeBlink, setEyeBlink] = useState(false);
  const [bounceAnim, setBounceAnim] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const sizeMap = {
    sm: 60,
    md: 120,
    lg: 180,
  };

  const canvasSize = sizeMap[size];
  const colors = EXPRESSION_COLORS[expression] || EXPRESSION_COLORS.happy;

  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setMouthOpen(false);
    }
  }, [isSpeaking]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 100);
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (animated) {
      const bounceInterval = setInterval(() => {
        setBounceAnim(true);
        setTimeout(() => setBounceAnim(false), 500);
      }, 5000);
      return () => clearInterval(bounceInterval);
    }
  }, [animated]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const radius = canvasSize * 0.4;

      ctx.save();
      if (bounceAnim) {
        ctx.translate(0, -5);
      }

      // Glow effect when speaking
      if (isSpeaking) {
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.5);
        gradient.addColorStop(0, `${colors.primary}40`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Background circle
      const bgGradient = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, 0, centerX, centerY, radius);
      bgGradient.addColorStop(0, colors.primary);
      bgGradient.addColorStop(1, colors.secondary);
      
      ctx.fillStyle = bgGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner face
      ctx.fillStyle = '#FFF5E6';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      const eyeY = centerY - radius * 0.2;
      const eyeSpacing = radius * 0.35;
      const eyeSize = radius * 0.15;

      // Left eye
      ctx.fillStyle = '#1F2937';
      if (!eyeBlink) {
        ctx.beginPath();
        ctx.arc(centerX - eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlight
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX - eyeSpacing - eyeSize * 0.3, eyeY - eyeSize * 0.3, eyeSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - eyeSpacing - eyeSize, eyeY);
        ctx.lineTo(centerX - eyeSpacing + eyeSize, eyeY);
        ctx.stroke();
      }

      // Right eye
      if (!eyeBlink) {
        ctx.fillStyle = '#1F2937';
        ctx.beginPath();
        ctx.arc(centerX + eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX + eyeSpacing - eyeSize * 0.3, eyeY - eyeSize * 0.3, eyeSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX + eyeSpacing - eyeSize, eyeY);
        ctx.lineTo(centerX + eyeSpacing + eyeSize, eyeY);
        ctx.stroke();
      }

      // Eyebrows
      ctx.strokeStyle = '#4B5563';
      ctx.lineWidth = radius * 0.05;
      ctx.lineCap = 'round';

      const browY = eyeY - radius * 0.3;
      
      // Left eyebrow - animated based on expression
      ctx.beginPath();
      if (expression === 'thinking' || expression === 'explaining') {
        ctx.moveTo(centerX - eyeSpacing - eyeSize, browY + radius * 0.1);
        ctx.quadraticCurveTo(centerX - eyeSpacing, browY - radius * 0.05, centerX - eyeSpacing + eyeSize, browY);
      } else if (expression === 'excited' || expression === 'celebrating') {
        ctx.moveTo(centerX - eyeSpacing - eyeSize, browY + radius * 0.1);
        ctx.quadraticCurveTo(centerX - eyeSpacing, browY - radius * 0.15, centerX - eyeSpacing + eyeSize, browY - radius * 0.1);
      } else {
        ctx.moveTo(centerX - eyeSpacing - eyeSize, browY);
        ctx.quadraticCurveTo(centerX - eyeSpacing, browY - radius * 0.05, centerX - eyeSpacing + eyeSize, browY);
      }
      ctx.stroke();

      // Right eyebrow
      ctx.beginPath();
      if (expression === 'thinking' || expression === 'explaining') {
        ctx.moveTo(centerX + eyeSpacing - eyeSize, browY);
        ctx.quadraticCurveTo(centerX + eyeSpacing, browY - radius * 0.05, centerX + eyeSpacing + eyeSize, browY + radius * 0.1);
      } else if (expression === 'excited' || expression === 'celebrating') {
        ctx.moveTo(centerX + eyeSpacing - eyeSize, browY - radius * 0.1);
        ctx.quadraticCurveTo(centerX + eyeSpacing, browY - radius * 0.15, centerX + eyeSpacing + eyeSize, browY + radius * 0.1);
      } else {
        ctx.moveTo(centerX + eyeSpacing - eyeSize, browY);
        ctx.quadraticCurveTo(centerX + eyeSpacing, browY - radius * 0.05, centerX + eyeSpacing + eyeSize, browY);
      }
      ctx.stroke();

      // Mouth
      const mouthY = centerY + radius * 0.3;
      const mouthWidth = radius * 0.4;
      
      if (expression === 'celebrating' || expression === 'excited') {
        // Big smile
        ctx.fillStyle = '#1F2937';
        ctx.beginPath();
        ctx.arc(centerX, mouthY - radius * 0.1, mouthWidth, 0, Math.PI);
        ctx.fill();

        // Teeth
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(centerX - mouthWidth * 0.8, mouthY - radius * 0.15, mouthWidth * 1.6, radius * 0.1);
      } else if (expression === 'correcting' || expression === 'thinking') {
        // Slight frown or neutral
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = radius * 0.06;
        ctx.beginPath();
        ctx.arc(centerX, mouthY + radius * 0.1, mouthWidth * 0.5, Math.PI * 0.2, Math.PI * 0.8);
        ctx.stroke();
      } else if (isSpeaking && mouthOpen) {
        // Speaking mouth (open)
        ctx.fillStyle = '#1F2937';
        ctx.beginPath();
        ctx.ellipse(centerX, mouthY, mouthWidth * 0.6, mouthWidth * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tongue
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.ellipse(centerX, mouthY + radius * 0.05, mouthWidth * 0.25, radius * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Normal smile
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = radius * 0.05;
        ctx.beginPath();
        ctx.arc(centerX, mouthY - radius * 0.1, mouthWidth, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
      }

      // Cheeks (blush)
      if (expression === 'happy' || expression === 'excited' || expression === 'celebrating') {
        ctx.fillStyle = 'rgba(251, 146, 60, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX - eyeSpacing - radius * 0.2, mouthY - radius * 0.2, radius * 0.15, radius * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(centerX + eyeSpacing + radius * 0.2, mouthY - radius * 0.2, radius * 0.15, radius * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Level badge
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(centerX + radius * 0.6, centerY + radius * 0.6, radius * 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = colors.primary;
      ctx.font = `bold ${radius * 0.18}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(level.toUpperCase().slice(0, 2), centerX + radius * 0.6, centerY + radius * 0.6);

      ctx.restore();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [expression, isSpeaking, eyeBlink, bounceAnim, colors, canvasSize, level, mouthOpen]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="drop-shadow-lg"
        style={{
          filter: isSpeaking ? `drop-shadow(0 0 20px ${colors.primary}60)` : 'none',
          transition: 'filter 0.3s ease',
        }}
      />
      
      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 bg-green-400 rounded-full animate-pulse"
              style={{
                height: '8px',
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
