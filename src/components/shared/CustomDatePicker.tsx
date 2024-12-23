import { ConfigProvider, DatePicker, Space } from 'antd';
import dayjs from 'dayjs';

import { Locale } from 'antd/es/locale';
import { DirectionType } from 'antd/es/config-provider';

type DatePickerProps = {
  locale: Locale | undefined;
  direction: DirectionType;
  maxDate: Date;
  value: dayjs.Dayjs | undefined;
  onChange: (value: dayjs.Dayjs | null) => void;
};

export const CustomDatePicker = ({
  locale,
  direction,
  maxDate,
  value,
  onChange,
}: DatePickerProps) => {
  const disableFutureDates = (current: dayjs.Dayjs): boolean => {
    return current.isAfter(dayjs(maxDate));
  };
  return (
    <ConfigProvider locale={locale} direction={direction}>
      <Space
        direction="horizontal"
        style={{ display: 'flex', width: '100%', position: 'relative' }} // Ensuring parent has enough space
      >
        <DatePicker
          format="DD/MM/YYYY"
          disabledDate={disableFutureDates}
          defaultPickerValue={dayjs(maxDate)}
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            paddingLeft: '1rem', // 4px in Tailwind (1rem = 16px, px-4)
            paddingRight: '1rem', // 4px in Tailwind (1rem = 16px, px-4)
            paddingTop: '0.625rem', // 2.5 = 10px (py-2.5)
            paddingBottom: '0.625rem', // 2.5 = 10px (py-2.5)
            borderRadius: '0.5rem', // rounded-lg
            border: '1px solid #d1d5db', // border-gray-300 (Tailwind gray-300 color)
            outline: 'none', // focus:ring-2 equivalent
            boxShadow: '0 0 0 1px #d1d5db', // focus:ring-purple-500 equivalent
            borderColor: 'transparent', // focus:border-transparent
            position: 'relative',
            zIndex: 10, // Ensure it appears above other elements if needed
          }}
        />
      </Space>
    </ConfigProvider>
  );
};
