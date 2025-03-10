import { CustomerGroup } from '@medusajs/medusa';
import { useAdminCustomerGroups, useAdminDeleteCustomerGroup } from 'medusa-react';
import { useNavigate } from 'react-router-dom';
import { HeaderGroup, Row, TableInstance, TableOptions, usePagination, useSortBy, useTable } from 'react-table';
import { useTranslation } from 'react-i18next';
import useQueryFilters from '../../../hooks/use-query-filters';
import useSetSearchParams from '../../../hooks/use-set-search-params';
import DetailsIcon from '../../fundamentals/details-icon';
import TrashIcon from '../../fundamentals/icons/trash-icon';
import { ActionType } from '../../molecules/actionables';
import Table from '../../molecules/table';
import TableContainer from '../../organisms/table-container';
import { CUSTOMER_GROUPS_TABLE_COLUMNS } from './config';
import useNotification from '../../../hooks/use-notification';

/**
 * Default filtering config for querying customer groups endpoint.
 */
const defaultQueryProps = {
  additionalFilters: { expand: 'customers' },
  limit: 15,
  offset: 0,
};

/*
 * Customer groups empty state.
 */
function CustomerGroupsPlaceholder() {
  return (
    <div className="center flex h-full min-h-[756px] items-center justify-center">
      <span className="text-xs text-gray-400">No customer groups yet</span>
    </div>
  );
}

/* ******************************************** */
/* ************** TABLE ELEMENTS ************** */
/* ******************************************** */

type HeaderCellProps = {
  col: HeaderGroup<CustomerGroup>;
};

/*
 * Renders react-table cell for the customer groups table.
 */
function CustomerGroupsTableHeaderCell(props: HeaderCellProps) {
  return (
    <Table.HeadCell className="w-[100px]" {...props.col.getHeaderProps(props.col.getSortByToggleProps())}>
      {props.col.render('Header')}
    </Table.HeadCell>
  );
}

type HeaderRowProps = {
  headerGroup: HeaderGroup<CustomerGroup>;
};

/*
 * Renders react-table header row for the customer groups table.
 */
function CustomerGroupsTableHeaderRow(props: HeaderRowProps) {
  return (
    <Table.HeadRow {...props.headerGroup.getHeaderGroupProps()}>
      {props.headerGroup.headers.map(col => (
        <CustomerGroupsTableHeaderCell key={col.id} col={col} />
      ))}
    </Table.HeadRow>
  );
}

type CustomerGroupsTableRowProps = {
  row: Row<CustomerGroup>;
};

/*
 * Render react-table row for the customer groups table.
 */
function CustomerGroupsTableRow(props: CustomerGroupsTableRowProps) {
  const { row } = props;

  const navigate = useNavigate();
  const notification = useNotification();
  const { mutate } = useAdminDeleteCustomerGroup(row.original.id);
  const { t } = useTranslation();

  const actions: ActionType[] = [
    {
      label: t('customer-group-table-details', 'Details'),
      onClick: () => navigate(row.original.id),
      icon: <DetailsIcon size={20} />,
    },
    {
      label: t('customer-group-table-delete', 'Delete'),
      onClick: () => {
        mutate(undefined, {
          onSuccess: () => {
            notification(
              t('customer-group-table-success', 'Success'),
              t('customer-group-table-group-deleted', 'Group deleted'),
              'success',
            );
          },
          onError: () => {
            notification(
              t('customer-group-table-error', 'Error'),
              t('customer-group-table-failed-to-delete-the-group', 'Failed to delete the group'),
              'error',
            );
          },
        });
      },
      icon: <TrashIcon size={20} />,
      variant: 'danger',
    },
  ];

  return (
    <Table.Row
      color={'inherit'}
      actions={actions}
      linkTo={`/a/customers/groups/${props.row.original.id}`}
      {...props.row.getRowProps()}
    >
      {props.row.cells.map((cell, index) => (
        <Table.Cell {...cell.getCellProps()}>{cell.render('Cell', { index })}</Table.Cell>
      ))}
    </Table.Row>
  );
}

/* ******************************************** */
/* ************* TABLE CONTAINERS ************* */
/* ******************************************** */

type CustomerGroupsTableProps = ReturnType<typeof useQueryFilters> & {
  customerGroups: CustomerGroup[];
  count: number;
  isLoading?: boolean;
};

/*
 * Root component of the customer groups table.
 */
function CustomerGroupsTable(props: CustomerGroupsTableProps) {
  const { customerGroups, queryObject, count, paginate, setQuery, isLoading } = props;
  const { t } = useTranslation();

  const tableConfig: TableOptions<CustomerGroup> = {
    columns: CUSTOMER_GROUPS_TABLE_COLUMNS,
    data: customerGroups || [],
    initialState: {
      pageSize: queryObject.limit,
      pageIndex: queryObject.offset / queryObject.limit,
    },
    pageCount: Math.ceil(count / queryObject.limit),
    manualPagination: true,
    autoResetPage: false,
  };

  const table: TableInstance<CustomerGroup> = useTable(tableConfig, useSortBy, usePagination);

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
    if (page >= 1 && page <= table.numPages) {
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

  // ********* RENDER *********

  return (
    <TableContainer
      isLoading={isLoading}
      hasPagination
      numberOfRows={queryObject.limit}
      pagingState={{
        count: count,
        offset: queryObject.offset,
        pageSize: queryObject.offset + table.rows.length,
        title: t('customer-group-table-customer-groups', 'Customer groups'),
        currentPage: table.state.pageIndex + 1,
        pageCount: table.pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: table.canNextPage,
        hasPrev: table.canPreviousPage,
        gotoPage: handlePageInput,
      }}
    >
      <Table enableSearch handleSearch={handleSearch} searchValue={queryObject.q} {...table.getTableProps()}>
        {/* HEAD */}
        <Table.Head>
          {table.headerGroups?.map((headerGroup, ind) => (
            <CustomerGroupsTableHeaderRow key={ind} headerGroup={headerGroup} />
          ))}
        </Table.Head>

        {/* BODY */}
        <Table.Body {...table.getTableBodyProps()}>
          {table.rows.map(row => {
            table.prepareRow(row);
            return <CustomerGroupsTableRow row={row} key={row.id} />;
          })}
        </Table.Body>
      </Table>
    </TableContainer>
  );
}

/*
 * A container component for the customers group table.
 * Handles data fetching and query params persistence.
 */
function CustomerGroupsTableContainer() {
  const params = useQueryFilters(defaultQueryProps);

  const { customer_groups, isLoading, count = 0 } = useAdminCustomerGroups(params.queryObject);

  useSetSearchParams(params.representationObject);

  const showPlaceholder = !customer_groups?.length && !params.queryObject.q;

  if (showPlaceholder) {
    if (!isLoading) {
      return <CustomerGroupsPlaceholder />;
    } else {
      return null;
    }
  }

  return <CustomerGroupsTable count={count} customerGroups={customer_groups || []} isLoading={isLoading} {...params} />;
}

export default CustomerGroupsTableContainer;
