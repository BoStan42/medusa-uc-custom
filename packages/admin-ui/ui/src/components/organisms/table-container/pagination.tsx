import { useTranslation } from 'react-i18next';
import { SkeletonProvider } from '../../../providers/skeleton-provider';
import Skeleton from '../../atoms/skeleton';
import ArrowLeftIcon from '../../fundamentals/icons/arrow-left-icon';
import ArrowRightIcon from '../../fundamentals/icons/arrow-right-icon';
import { PagingProps } from './types';
import { useEffect, useState } from 'react';

type Props = {
  isLoading?: boolean;
  pagingState: PagingProps;
};

export const TablePagination = ({
  isLoading = false,
  pagingState: {
    title,
    currentPage,
    pageCount,
    pageSize,
    count,
    offset,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
    gotoPage,
  },
}: Props) => {
  const { t } = useTranslation();
  const soothedOffset = count > 0 ? offset + 1 : 0;
  const soothedPageCount = Math.max(1, pageCount);
  const [inputPage, setInputPage] = useState<string | number>(currentPage);
  const [isInputChange, setIsInputChange] = useState(false);

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsInputChange(true);
    if (value === '') {
      setInputPage(value);
      return;
    }

    const numberValue = Number(value);
    if (!isNaN(numberValue) && numberValue >= 1) {
      setInputPage(numberValue);
    } else {
      setInputPage(currentPage);
    }
  };

  useEffect(() => {
    if (!isInputChange || inputPage === '' || inputPage === currentPage) {
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      const numberValue = Number(inputPage);
      if (numberValue >= 1 && numberValue <= soothedPageCount) {
        gotoPage(numberValue);
      } else {
        setInputPage(currentPage);
      }
      setIsInputChange(false);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [inputPage, soothedPageCount, currentPage, gotoPage, isInputChange]);

  return (
    <SkeletonProvider isLoading={isLoading}>
      <div className={'inter-small-regular text-grey-50 flex w-full justify-between'}>
        <Skeleton>
          <div>
            {t('table-container-soothed-offset', '{{soothedOffset}} - {{pageSize}} of {{count}} {{title}}', {
              soothedOffset,
              pageSize,
              count,
              title,
            })}
          </div>
        </Skeleton>
        <div className="flex items-center justify-center space-x-4">
          <Skeleton>
            <div>
              {t('table-container-current-page', '{{currentPage}} of {{soothedPageCount}}', {
                currentPage,
                soothedPageCount,
              })}
            </div>
          </Skeleton>
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-grey-5 border-gray-20 px-small rounded-rounded focus-within:shadow-input focus-within:border-violet-60 flex w-full items-center border py-1">
              <input
                type="text"
                value={inputPage}
                onChange={handlePageChange}
                className="w-12 bg-transparent text-center font-normal outline-none outline-0"
              />
            </div>

            <button
              className="disabled:text-grey-30 cursor-pointer disabled:cursor-default"
              disabled={!hasPrev || isLoading}
              onClick={() => prevPage()}
            >
              <ArrowLeftIcon />
            </button>
            <button
              className="disabled:text-grey-30 cursor-pointer disabled:cursor-default"
              disabled={!hasNext || isLoading}
              onClick={() => nextPage()}
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </SkeletonProvider>
  );
};
