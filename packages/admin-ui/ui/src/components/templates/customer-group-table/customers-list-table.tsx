import { UseMutateFunction } from '@tanstack/react-query';
import { HeaderGroup, Row, usePagination, useSortBy, useTable } from 'react-table';

import { Customer } from '@medusajs/medusa';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';
import useQueryFilters from '../../../hooks/use-query-filters';
import DetailsIcon from '../../fundamentals/details-icon';
import TrashIcon from '../../fundamentals/icons/trash-icon';
import Table from '../../molecules/table';
import { FilteringOptionProps } from '../../molecules/table/filtering-option';
import TableContainer from '../../organisms/table-container';
import { CUSTOMER_GROUPS_CUSTOMERS_LIST_TABLE_COLUMNS } from './config';

/* ********************************** */
/* ************** TYPES ************* */
/* ********************************** */

type CustomersListTableHeaderRowProps = {
  headerGroup: HeaderGroup<Customer>;
};

interface CustomersListTableRowProps {
  row: Row<Customer>;
  removeCustomers: Function;
}

type CustomersListTableProps = ReturnType<typeof useQueryFilters> & {
  count: number;
  groupId: string;
  customers: Customer[];
  filteringOptions: FilteringOptionProps[];
  removeCustomers: UseMutateFunction<any, Error, any, unknown>;
  isLoading?: boolean;
};

/* ********************************************* */
/* ************** TABLE COMPONENTS ************* */
/* ********************************************* */

/*
 * Renders customer group customers list header row.
 */
function CustomersListTableHeaderRow(props: CustomersListTableHeaderRowProps) {
  const { headerGroup } = props;

  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {props.headerGroup.headers.map((col, index) => {
        const { render, getHeaderProps, getSortByToggleProps } = col;
        const className = index ? 'w-[100px]' : 'w-[60px]';

        return (
          <Table.HeadCell className={className} {...getHeaderProps()}>
            {render('Header')}
          </Table.HeadCell>
        );
      })}
    </Table.HeadRow>
  );
}

interface CustomersListTableRowProps {
  row: Row<Customer>;
  removeCustomers: Function;
}

/*
 * Renders customer group customers list table row.
 */
function CustomersListTableRow(props: CustomersListTableRowProps) {
  const { row, removeCustomers } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions = [
    {
      label: t('customer-group-table-details', 'Details'),
      onClick: () => navigate(`/a/customers/${row.original.id}`),
      icon: <DetailsIcon size={20} />,
    },
    // {
    //   label: "Send an email",
    //   onClick: () => window.open(`mailto:${row.original.email}`),
    //   icon: <MailIcon size={20} />,
    // },
    {
      label: t('customer-group-table-delete-from-the-group', 'Delete from the group'),
      variant: 'danger',
      onClick: () =>
        removeCustomers({
          customer_ids: [{ id: row.original.id }],
        }),
      icon: <TrashIcon size={20} />,
    },
  ];

  return (
    <Table.Row
      color={'inherit'}
      actions={actions}
      linkTo={`/a/customers/${props.row.original.id}`}
      {...props.row.getRowProps()}
    >
      {props.row.cells.map((cell, index) => (
        <Table.Cell {...cell.getCellProps()}>{cell.render('Cell', { index })}</Table.Cell>
      ))}
    </Table.Row>
  );
}

/*
 * Render a list of customers that belong to a customer group.
 */
function CustomersListTable(props: CustomersListTableProps) {
  const { t } = useTranslation();
  const { customers, removeCustomers, setQuery, paginate, filteringOptions, queryObject, count, isLoading } = props;

  const tableConfig = {
    data: customers,
    columns: CUSTOMER_GROUPS_CUSTOMERS_LIST_TABLE_COLUMNS,
    initialState: {
      pageSize: queryObject.limit,
      pageIndex: queryObject.offset / queryObject.limit,
    },
    pageCount: Math.ceil(count / queryObject.limit),
    manualPagination: true,
    autoResetPage: false,
  };

  const table = useTable(tableConfig, useSortBy, usePagination);

  // ********* HANDLERS *********

  const handleNext = () => {
    if (!table.canNextPage) {
      return;
    }

    paginate(1);
    table.nextPage();
  };

  const handlePrev = () => {
    if (!table.canPreviousPage) {
      return;
    }

    paginate(-1);
    table.previousPage();
  };

  const handlePageInput = (page: number) => {
    if (page >= 1 && page <= table.pageCount) {
      table.gotoPage(page - 1);
      paginate(page, 'goToPage');
    }
  };

  const handleSearch = (text: string) => {
    setQuery(text);

    if (text) {
      table.gotoPage(0);
    }
  };

  return (
    <TableContainer
      isLoading={isLoading}
      hasPagination
      numberOfRows={queryObject.limit}
      pagingState={{
        count: count!,
        offset: queryObject.offset,
        pageSize: queryObject.offset + table.rows.length,
        title: t('customer-group-table-customer-groups-title', 'Customer Groups'),
        currentPage: table.state.pageIndex + 1,
        pageCount: table.pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: table.canNextPage,
        hasPrev: table.canPreviousPage,
        gotoPage: handlePageInput,
      }}
    >
      <Table
        enableSearch
        handleSearch={handleSearch}
        searchValue={queryObject.q}
        filteringOptions={filteringOptions}
        {...table.getTableProps()}
      >
        <Table.Head>
          {table.headerGroups?.map((headerGroup, index) => (
            <CustomersListTableHeaderRow key={index} headerGroup={headerGroup} />
          ))}
        </Table.Head>

        <Table.Body {...table.getTableBodyProps()}>
          {table.rows.map(row => {
            table.prepareRow(row);
            return <CustomersListTableRow row={row} key={row.id} removeCustomers={removeCustomers} />;
          })}
        </Table.Body>
      </Table>
    </TableContainer>
  );
}

export default CustomersListTable;
