import React, { useRef, useEffect, useCallback } from 'react';
import './time-picker.css';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, '0')
);
const MINUTES = ['00', '30'];

interface TimeScrollPickerProps {
  hour: string;
  minute: string;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
  disabled?: boolean;
}

const ScrollColumn = ({
  items,
  value,
  onChange,
  disabled,
}: {
  items: string[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

  const scrollToValue = useCallback(
    (val: string, smooth = false) => {
      const el = ref.current;
      if (!el) return;
      const index = items.indexOf(val);
      if (index < 0) return;
      el.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: smooth ? 'smooth' : 'auto',
      });
    },
    [items]
  );

  useEffect(() => {
    scrollToValue(value);
  }, [value, scrollToValue]);

  const handleScroll = () => {
    if (disabled) return;
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const index = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      const newVal = items[clamped];
      if (newVal !== value) {
        onChange(newVal);
      } else {
        scrollToValue(newVal, true);
      }
    }, 80);
  };

  const handleItemClick = (item: string) => {
    if (disabled) return;
    onChange(item);
    scrollToValue(item, true);
  };

  const paddingCount = Math.floor(VISIBLE_ITEMS / 2);

  return (
    <div
      className={`time-picker-column ${disabled ? 'time-picker-column--disabled' : ''}`}
    >
      <div className="time-picker-highlight" aria-hidden />
      <div
        ref={ref}
        className="time-picker-scroll"
        onScroll={handleScroll}
        style={{ height: PICKER_HEIGHT }}
      >
        {Array.from({ length: paddingCount }).map((_, i) => (
          <div key={`pad-top-${i}`} className="time-picker-item time-picker-item--spacer" />
        ))}
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={`time-picker-item ${item === value ? 'time-picker-item--selected' : ''}`}
            onClick={() => handleItemClick(item)}
            disabled={disabled}
          >
            {item}
          </button>
        ))}
        {Array.from({ length: paddingCount }).map((_, i) => (
          <div key={`pad-bot-${i}`} className="time-picker-item time-picker-item--spacer" />
        ))}
      </div>
    </div>
  );
};

const TimeScrollPicker = ({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  disabled = false,
}: TimeScrollPickerProps) => {
  return (
    <div
      className={`time-picker ${disabled ? 'time-picker--disabled' : ''}`}
      style={{ height: PICKER_HEIGHT }}
    >
      <ScrollColumn
        items={HOURS}
        value={hour}
        onChange={onHourChange}
        disabled={disabled}
      />
      <span className="time-picker-separator">:</span>
      <ScrollColumn
        items={MINUTES}
        value={minute}
        onChange={onMinuteChange}
        disabled={disabled}
      />
    </div>
  );
};

export default TimeScrollPicker;
export { HOURS, MINUTES };
