// src/components/ui/Slider.tsx
import React from 'react';

// Get all the props that a standard <input type="range"> would accept
type SliderProps = React.ComponentPropsWithoutRef<'input'> & {
  label: string;
  value: number;
};

export function Slider({ label, id, value, ...props }: SliderProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="flex justify-between items-center text-sm font-medium text-gray-300 mb-1">
        <span>{label}</span>
        {/* Display the current value next to the label */}
        <span className="px-2 py-0.5 bg-gray-700 text-xs rounded-md">{value}</span>
      </label>
      <input
        type="range"
        id={id}
        value={value}
        {...props}
        className="
          w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-green-500
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:bg-green-500
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:cursor-pointer
        "
      />
    </div>
  );
}