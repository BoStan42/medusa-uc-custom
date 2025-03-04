import { Label, RadioGroup } from '@medusajs/ui';
import { useState } from 'react';
import Button from '../../../components/fundamentals/button';
import clsx from 'clsx';

const filters = [
  {
    name: 'Last year',
    value: 'year',
  },
  {
    name: 'Last month',
    value: 'month',
  },
  {
    name: 'Last Week',
    value: 'week',
  },
];

type ExportCustomerQuickFiltersProps = {
  handleStartDateChange: (date: Date) => void;
  handleEndDateChange: (date: Date) => void;
};

const ExportCustomerQuickFilters: React.FC<ExportCustomerQuickFiltersProps> = ({
  handleStartDateChange,
  handleEndDateChange,
}) => {
  const [selected, setSelected] = useState('');

  const handleQuickFilters = (filter: string) => {
    switch (filter) {
      case 'year': {
        const date = new Date();
        const yearAgo = date.getFullYear() - 1;
        handleEndDateChange(date);
        handleStartDateChange(new Date(yearAgo, date.getMonth(), date.getDate()));
        break;
      }
      case 'month': {
        const date = new Date();
        const monthAgo = date.getMonth() - 1;
        handleEndDateChange(date);
        handleStartDateChange(new Date(date.getFullYear(), monthAgo, date.getDate()));
        break;
      }
      case 'week': {
        const date = new Date();
        const weekAgo = date.getDate() - 7;
        handleEndDateChange(date);
        handleStartDateChange(new Date(date.getFullYear(), date.getMonth(), weekAgo));
        break;
      }
      default:
        break;
    }

    setSelected(filter);
  };

  return (
    <>
      <RadioGroup value={selected} onValueChange={setSelected} className="py-4">
        <Label weight="plus">Quick filters:</Label>

        <div className="flex gap-x-2">
          {filters.map((filter, index) => (
            <Button variant="secondary" size="small" key={index} onClick={() => handleQuickFilters(filter.value)}>
              <Label
                htmlFor={filter.value}
                weight="regular"
                className={clsx('text-sm', 'cursor-pointer', {
                  'text-[#7c3aed]': selected === filter.value,
                })}
              >
                {filter.name}
              </Label>
            </Button>
          ))}
        </div>
      </RadioGroup>
    </>
  );
};

export default ExportCustomerQuickFilters;
