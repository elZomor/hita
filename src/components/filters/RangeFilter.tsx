import React, { useState } from 'react';
import { Box, Slider } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface RangeFilterProps {
  minVal: number;
  maxVal: number;
  initialStartVal?: number;
  initialEndVal?: number;
  onChange?: (initialStartVal: number, initialEndVal: number) => void;
}

export const RangeFilter: React.FC<RangeFilterProps> = ({
  minVal,
  maxVal,
  initialStartVal = minVal,
  initialEndVal = maxVal,
  onChange,
}) => {
  const [valRange, setValRange] = useState<[number, number]>([
    initialStartVal,
    initialEndVal,
  ]);
  const { i18n } = useTranslation();

  const handleChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      setValRange([newValue[0], newValue[1]]);
    }
  };

  const handleChangeCommitted = (
    _: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[]
  ) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      if (onChange) {
        onChange(newValue[0], newValue[1]);
      }
    }
  };

  return (
    <Box className="w-full px-4">
      <Slider
        value={valRange}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        min={minVal}
        max={maxVal}
        aria-labelledby="range-slider"
        sx={{
          color: '#f59e0b', // purple-500
          '& .MuiSlider-thumb': {
            backgroundColor: '#f59e0b', // purple-500
            '&:hover': {
              backgroundColor: '#d97706', // purple-600
            },
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#fde68a', // purple-200
          },
          '& .MuiSlider-track': {
            backgroundColor: '#fbbf24', // purple-400
          },
        }}
      />
      <Box className="flex justify-between">
        <span>{i18n.language === 'ar' ? valRange[1] : valRange[0]}</span>
        <span>{i18n.language === 'ar' ? valRange[0] : valRange[1]}</span>
      </Box>
    </Box>
  );
};
