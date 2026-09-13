import { forwardRef, useRef, useEffect, useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  options: readonly DropdownOption[];
  onSelect?: (value: string, option: DropdownOption) => void;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
  maxHeight?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  // Controlled mode props
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Toggle callback for Select wrapper
  onToggle?: () => void;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      options,
      onSelect,
      placeholder,
      value,
      disabled = false,
      className,
      menuClassName,
      align = 'left',
      maxHeight = 240,
      searchable = false,
      searchPlaceholder = 'Tìm kiếm...',
      isOpen: controlledIsOpen,
      onOpenChange,
    },
    ref
  ) => {
    const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
    const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
    const setIsOpen = controlledIsOpen !== undefined ? onOpenChange ?? (() => {}) : setUncontrolledIsOpen;

    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter((opt) =>
      opt.divider
        ? true
        : opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Close on outside click
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
          setHighlightedIndex(-1);
        }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    // Keyboard navigation
    useEffect(() => {
      function handleKeyDown(event: KeyboardEvent) {
        if (!isOpen) {
          if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
            event.preventDefault();
            setIsOpen(true);
          }
          return;
        }

        filteredOptions.filter((o) => !o.divider && !o.disabled);

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setHighlightedIndex((prev) => {
              let next = prev + 1;
              while (next < filteredOptions.length && (filteredOptions[next].divider || filteredOptions[next].disabled)) {
                next++;
              }
              return next >= filteredOptions.length ? 0 : next;
            });
            break;
          case 'ArrowUp':
            event.preventDefault();
            setHighlightedIndex((prev) => {
              let next = prev - 1;
              while (next >= 0 && (filteredOptions[next].divider || filteredOptions[next].disabled)) {
                next--;
              }
              return next < 0 ? filteredOptions.length - 1 : next;
            });
            break;
          case 'Enter':
            event.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
              const option = filteredOptions[highlightedIndex];
              if (!option.divider && !option.disabled) {
                onSelect?.(option.value, option);
                setIsOpen(false);
                setSearchQuery('');
                setHighlightedIndex(-1);
                triggerRef.current?.focus();
              }
            }
            break;
          case 'Escape':
            setIsOpen(false);
            setSearchQuery('');
            setHighlightedIndex(-1);
            triggerRef.current?.focus();
            break;
          case 'Tab':
            setIsOpen(false);
            setSearchQuery('');
            setHighlightedIndex(-1);
            break;
        }
      }

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredOptions, highlightedIndex, onSelect]);

    const selectedOption = options.find((o) => o.value === value);
    const triggerContent = (
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className={cn(
          'relative inline-flex items-center justify-between gap-2',
          'px-4 py-2.5',
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-600',
          'rounded-xl',
          'text-sm text-gray-900 dark:text-white',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'hover:border-violet-500 dark:hover:border-violet-500',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-150',
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={placeholder || 'Mở menu'}
      >
        <span className={cn('truncate flex-1 text-left', value ? '' : 'text-gray-400 dark:text-gray-500')}>
          {value ? selectedOption?.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
    );

    const menuContent = (
      <div
        ref={menuRef}
        className={cn(
          'absolute z-50 mt-1.5 min-w-[200px] max-w-xs',
          'bg-white dark:bg-gray-800',
          'rounded-xl border border-gray-100 dark:border-gray-700',
          'shadow-lg',
          'overflow-hidden',
          'animate-in fade-in-0 zoom-in-95 duration-150 ease-out',
          align === 'right' ? 'right-0' : 'left-0',
          menuClassName
        )}
        style={{ maxHeight: maxHeight }}
        role="listbox"
        aria-label={placeholder || 'Các lựa chọn'}
      >
        {searchable && (
          <div className="p-2 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHighlightedIndex(-1);
              }}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              autoFocus
            />
          </div>
        )}

        <div className="py-1" role="listbox">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Không tìm thấy kết quả
            </div>
          ) : (
            filteredOptions.map((option, index) => {
              if (option.divider) {
                return (
                  <div key={index} className="border-t border-gray-100 dark:border-gray-700 my-1" role="separator" />
                );
              }

              const isHighlighted = index === highlightedIndex;
              const isSelected = value === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  disabled={option.disabled}
                  className={cn(
                    'w-full px-3 py-2.5 text-left text-sm flex items-center gap-3',
                    'transition-colors duration-100',
                    option.disabled
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-violet-900/30',
                    isHighlighted && !option.disabled
                      ? 'bg-violet-50 dark:bg-violet-900/30'
                      : '',
                    option.danger && 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'
                  )}
                  onClick={() => {
                    if (!option.disabled) {
                      onSelect?.(option.value, option);
                      setIsOpen(false);
                      setSearchQuery('');
                      setHighlightedIndex(-1);
                      triggerRef.current?.focus();
                    }
                  }}
                  onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                >
                  {option.icon && <span className="flex-shrink-0 w-4 h-4">{option.icon}</span>}
                  <span className={cn('truncate flex-1', isSelected && 'font-medium')}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <svg className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn('relative inline-block', className)}
        onMouseLeave={() => setHighlightedIndex(-1)}
      >
        {triggerContent}
        {isOpen && menuContent}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

// Select wrapper for form integration
interface SelectProps extends Omit<DropdownProps, 'trigger'> {
  label?: string;
  error?: string;
  helperText?: string;
  name?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

export function Select({
  label,
  error,
  helperText,
  name,
  required,
  onChange,
  className,
  ...props
}: SelectProps) {
  const selectedOption = props.options.find((o) => o.value === props.value);

  const handleToggle = () => {
    if (!props.disabled) {
      props.onOpenChange?.(!props.isOpen);
    }
  };

  return (
      <span className={cn('truncate flex-1 text-left', props.value ? '' : 'text-gray-400 dark:text-gray-500')}>
        {props.value ? selectedOption?.label : props.placeholder}
      </span>
      <ChevronDown
        className={cn(
          'w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform',
          props.isOpen && 'rotate-180'
        )}
        aria-hidden="true"
      />
    </button>
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </label>
      )}
      <Dropdown
        {...props}
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        onSelect={(value) => {
          onChange?.(value);
          props.onSelect?.(value, props.options.find((o) => o.value === value)!);
        }}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${name}-helper`} className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}