import React, { useState, useEffect, useRef, useId } from 'react';
import { Eye, EyeSlash, WarningCircle } from '@phosphor-icons/react';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  variant?: 'light' | 'dark';
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      className = '',
      containerClassName = '',
      autoComplete = 'current-password',
      variant = 'light',
      disabled,
      id,
      onKeyDown,
      onKeyUp,
      ...props
    },
    forwardedRef
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const internalRef = useRef<HTMLInputElement | null>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [capsLockActive, setCapsLockActive] = useState(false);

    // Combine forwarded ref and internal ref
    const setRefs = (element: HTMLInputElement | null) => {
      internalRef.current = element;
      if (typeof forwardedRef === 'function') {
        forwardedRef(element);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = element;
      }
    };

    // 1. Masquer automatiquement quand l'onglet perd le focus
    useEffect(() => {
      const handleWindowBlur = () => {
        setShowPassword(false);
        setCapsLockActive(false);
      };
      window.addEventListener('blur', handleWindowBlur);
      return () => window.removeEventListener('blur', handleWindowBlur);
    }, []);

    // 2. Masquer automatiquement à l'envoi du formulaire
    useEffect(() => {
      const inputEl = internalRef.current;
      const form = inputEl?.form;
      if (!form) return;

      const handleFormSubmit = () => {
        setShowPassword(false);
      };
      form.addEventListener('submit', handleFormSubmit);
      return () => form.removeEventListener('submit', handleFormSubmit);
    }, []);

    const handleKeyActivity = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (typeof e.getModifierState === 'function') {
        setCapsLockActive(e.getModifierState('CapsLock'));
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
      // Maintenir le focus sur l'input
      if (internalRef.current) {
        internalRef.current.focus();
      }
    };

    const isDark = variant === 'dark';

    const baseInputStyles = isDark
      ? error
        ? 'border-rose-500 focus:ring-rose-500 text-white bg-rose-950/30 placeholder-slate-400'
        : 'border-[#1E3A5F] bg-[#132A4C] text-white placeholder-slate-500 focus:ring-[#0131FD] focus:bg-[#132A4C]'
      : error
        ? 'border-rose-400 focus:ring-rose-500 text-rose-900 bg-rose-50/30 placeholder-slate-400'
        : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-[#0131FD] focus:bg-white';

    const eyeButtonStyles = isDark
      ? 'text-slate-400 hover:text-white hover:bg-[#1E3A5F] focus:ring-[#0131FD]'
      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:ring-[#0131FD]';

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className={`block text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {label}
            </label>
          </div>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            {...props}
            ref={setRefs}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            autoComplete={autoComplete}
            disabled={disabled}
            onKeyDown={(e) => {
              handleKeyActivity(e);
              onKeyDown?.(e);
            }}
            onKeyUp={(e) => {
              handleKeyActivity(e);
              onKeyUp?.(e);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={`w-full ${leftIcon ? 'pl-10' : 'pl-3.5'} pr-11 py-2.5 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${baseInputStyles} ${className}`}
          />

          <button
            type="button"
            tabIndex={0}
            onMouseDown={(e) => {
              // Empêche la perte de focus de l'input au clic
              e.preventDefault();
            }}
            onClick={togglePasswordVisibility}
            disabled={disabled}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            aria-pressed={showPassword}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg focus:outline-none focus:ring-2 transition-colors ${eyeButtonStyles}`}
          >
            {showPassword ? (
              <EyeSlash size={18} weight="bold" className="text-[#0131FD]" />
            ) : (
              <Eye size={18} weight="bold" />
            )}
          </button>
        </div>

        {/* Avertissement Verr. Maj si active */}
        {capsLockActive && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 w-fit">
            <WarningCircle size={13} weight="fill" />
            <span>Verr. Maj activé</span>
          </div>
        )}

        {/* Message d'erreur spécifique sous le champ */}
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs font-semibold text-rose-600 mt-1">
            {error}
          </p>
        )}

        {/* Texte d'aide sous le champ */}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-[11px] text-slate-500 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
