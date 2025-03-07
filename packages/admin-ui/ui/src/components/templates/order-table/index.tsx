import clsx from 'clsx';
import { isEmpty } from 'lodash';
import { useAdminOrders } from 'medusa-react';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePagination, useTable } from 'react-table';
import { useAnalytics } from '../../../providers/analytics-provider';
import { useFeatureFlag } from '../../../providers/feature-flag-provider';
import Table from '../../molecules/table';
import TableContainer from '../../organisms/table-container';
import OrderFilters from '../order-filter-dropdown';
import useOrderTableColums from './use-order-column';
import { useOrderFilters } from './use-order-filters';

const DEFAULT_PAGE_SIZE = 15;

const defaultQueryProps = {
  expand: 'customer,shipping_address,cart',
  fields: 'id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code,metadata',
};

type OrderTableProps = {
  setContextFilters: (filters: Record<string, { filter: string[] }>) => void;
};

const OrderTable = ({ setContextFilters }: OrderTableProps) => {
  const location = useLocation();

  const { isFeatureEnabled } = useFeatureFlag();
  const { trackNumberOfOrders } = useAnalytics();

  let hiddenColumns = ['sales_channel'];
  if (isFeatureEnabled('sales_channels')) {
    if (!defaultQueryProps.expand.includes('sales_channel')) {
      defaultQueryProps.expand = defaultQueryProps.expand + ',shipping_address,sales_channel,items';
    }
    hiddenColumns = [];
  }

  const {
    removeTab,
    setTab,
    saveTab,
    availableTabs: filterTabs,
    activeFilterTab,
    reset,
    paginate,
    setFilters,
    filters,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useOrderFilters(location.search, defaultQueryProps);
  const filtersOnLoad = queryObject;

  const offs = parseInt(filtersOnLoad?.offset) || 0;
  const lim = parseInt(filtersOnLoad.limit) || DEFAULT_PAGE_SIZE;

  const [query, setQuery] = useState(filtersOnLoad?.query);
  const [numPages, setNumPages] = useState(0);

  const { orders, isLoading, count, refetch } = useAdminOrders(queryObject, {
    keepPreviousData: true,
    onSuccess: ({ count }) => {
      trackNumberOfOrders({
        count,
      });
    },
  });

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / queryObject.limit);
    setNumPages(controlledPageCount);
    refetch();
  }, [orders]);

  useEffect(() => {
    setContextFilters(filters as {});
  }, [filters]);

  const [columns] = useOrderTableColums();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: orders || [],
      manualPagination: true,
      initialState: {
        pageSize: lim,
        pageIndex: offs / lim,
        hiddenColumns,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination,
  );

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setFreeText(query);
        gotoPage(0);
      } else {
        // if we delete query string, we reset the table view
        reset();
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleNext = () => {
    if (canNextPage) {
      paginate(1);
      nextPage();
    }
  };

  const handlePrev = () => {
    if (canPreviousPage) {
      paginate(-1);
      previousPage();
    }
  };

  const handlePageInput = (page: number) => {
    if (page >= 1 && page <= numPages) {
      gotoPage(page - 1);
      paginate(page, 'goToPage');
    }
  };

  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj);
    window.history.replaceState(`/a/orders`, '', `${`?${stringified}`}`);
  };

  const refreshWithFilters = () => {
    const filterObj = representationObject;

    if (isEmpty(filterObj)) {
      updateUrlFromFilter({ offset: 0, limit: DEFAULT_PAGE_SIZE });
    } else {
      updateUrlFromFilter(filterObj);
    }
  };

  const clearFilters = () => {
    reset();
    setQuery('');
  };

  useEffect(() => {
    refreshWithFilters();
  }, [representationObject]);

  return (
    <div>
      <TableContainer
        isLoading={isLoading}
        hasPagination
        numberOfRows={lim}
        pagingState={{
          count: count!,
          offset: queryObject.offset,
          pageSize: queryObject.offset + rows.length,
          title: 'Orders',
          currentPage: pageIndex + 1,
          pageCount: pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: canNextPage,
          hasPrev: canPreviousPage,
          gotoPage: handlePageInput,
        }}
      >
        <Table
          filteringOptions={
            <OrderFilters
              filters={filters}
              submitFilters={setFilters}
              clearFilters={clearFilters}
              tabs={filterTabs}
              onTabClick={setTab}
              activeTab={activeFilterTab}
              onRemoveTab={removeTab}
              onSaveTab={saveTab}
            />
          }
          enableSearch
          handleSearch={setQuery}
          searchValue={query}
          {...getTableProps()}
          className={clsx({ ['relative']: isLoading })}
        >
          <Table.Head>
            {headerGroups?.map((headerGroup, index) => (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((col, idx) => (
                  <Table.HeadCell {...col.getHeaderProps()} key={idx}>
                    {col.render('Header')}
                  </Table.HeadCell>
                ))}
              </Table.HeadRow>
            ))}
          </Table.Head>
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <Table.Row
                  color={'inherit'}
                  linkTo={`/a/orders/${row.original.id}`}
                  {...row.getRowProps()}
                  className="group"
                  key={index}
                >
                  {row.cells.map((cell, idx) => {
                    return (
                      <Table.Cell {...cell.getCellProps()} key={idx}>
                        {cell.render('Cell')}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </TableContainer>
    </div>
  );
};

export default React.memo(OrderTable);
