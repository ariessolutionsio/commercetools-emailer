import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import DataTable from '@commercetools-uikit/data-table';

import { getTableColumns } from './table-columns';
import { type RowData, type SortState } from './types';

interface TemplatesTableProps {
  rows: RowData[];
  searchValue: string;
  onDelete: () => void;
}

export const TemplatesTable = ({
  rows,
  searchValue,
  onDelete,
}: TemplatesTableProps) => {
  const intl = useIntl();
  const [sort, setSort] = useState<SortState>({
    key: 'name',
    dir: undefined,
  });

  const onSortRequest = (key: SortState['key'], dir: SortState['dir']) => {
    setSort({
      key,
      dir,
    });
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [rows, searchValue]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const aValue = a[sort.key as keyof RowData];
      const bValue = b[sort.key as keyof RowData];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.dir === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  }, [filteredRows, sort]);

  const tableColumns = getTableColumns({
    searchValue,
    intl,
    onDelete,
  });

  return (
    <DataTable
      rows={sortedRows}
      columns={tableColumns}
      sortedBy={sort.key}
      sortDirection={sort.dir}
      onSortChange={onSortRequest}
    />
  );
};
