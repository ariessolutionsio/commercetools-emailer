import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import FlatButton from '@commercetools-uikit/flat-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import DataTable, { TColumn } from '@commercetools-uikit/data-table';
import { useCustomObjectsFetcher } from '../../hooks/use-custom-objects-connector/use-custom-object-connector';
import { CONTAINER } from '../../constants';
import SearchTextInput from '@commercetools-uikit/text-input';

type RowData = {
  id: string;
  type: string;
  subject: string;
  body: string;
};

type SortState = {
  key: string;
  dir?: 'desc' | 'asc';
};

const TemplatesList = () => {
  const intl = useIntl();
  const { push } = useHistory();
  const location = useLocation();
  const [sort, setSort] = useState<SortState>({
    key: 'name',
    dir: undefined,
  });
  const [searchValue, setSearchValue] = useState<string>('');
  const basePath = location.pathname.split('/').slice(0, -1).join('/');

  const { customObjectsPaginatedResult, loading, error } =
    useCustomObjectsFetcher({
      limit: 500,
      offset: 0,
      container: CONTAINER,
    });

  const TEXT = {
    back: intl.formatMessage({
      id: 'back',
      defaultMessage: 'Back to Dashboard',
    }),
    title: intl.formatMessage({ id: 'title', defaultMessage: 'Templates' }),
    loading: intl.formatMessage({
      id: 'loading',
      defaultMessage: 'Loading templates ...',
    }),
  };

  const tableData = useMemo(() => {
    return customObjectsPaginatedResult?.results || [];
  }, [customObjectsPaginatedResult]);

  const highlightText = (text: string) => {
    if (!searchValue) return text;

    const regex = new RegExp(`(${searchValue})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === searchValue.toLowerCase() ? (
        <span
          key={index}
          style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const rows = useMemo<RowData[]>(
    () =>
      tableData.map((row) => {
        try {
          const emailBody =
            JSON.parse(String(row.value.body))?.blocks?.[0]?.data?.text || '';
          return {
            id: row.id,
            type: String(row.value.type),
            subject: String(row.value.subject),
            body: emailBody,
          };
        } catch {
          return {
            id: row.id,
            type: '',
            subject: '',
            body: 'Invalid JSON data',
          };
        }
      }),
    [tableData]
  );

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

  const tableColumns: TColumn<RowData>[] = useMemo(() => {
    const highlightText = (text: string) => {
      if (!searchValue) return text;

      const regex = new RegExp(`(${searchValue})`, 'gi');
      const parts = text.split(regex);

      return parts.map((part, index) =>
        part.toLowerCase() === searchValue.toLowerCase() ? (
          <span
            key={index}
            style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}
          >
            {part}
          </span>
        ) : (
          part
        )
      );
    };
    return [
      {
        key: 'type',
        label: intl.formatMessage({ id: 'type', defaultMessage: 'Type' }),
        isSortable: true,
        shouldIgnoreRowClick: true,
        align: 'left',
        isCondensed: true,
        renderItem: (row: RowData) => <div>{row.type}</div>,
        disableResizing: true,
      },
      {
        key: 'subject',
        isSortable: true,
        label: intl.formatMessage({ id: 'subject', defaultMessage: 'Subject' }),
        renderItem: (row: RowData) => <div>{highlightText(row.subject)}</div>,
      },
      {
        key: 'body',
        isSortable: true,
        label: intl.formatMessage({ id: 'body', defaultMessage: 'Body' }),
        renderItem: (row: RowData) => <div>{highlightText(row.body)}</div>,
      },
    ];
  }, [intl, searchValue]);

  const onSortRequest = (key: SortState['key'], dir: SortState['dir']) => {
    setSort({
      key,
      dir,
    });
  };

  if (error) return <div>{error.message}</div>;

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text.Headline
            as="h2"
            intlMessage={{ id: 'title', defaultMessage: TEXT.title }}
          />
          <FlatButton
            as="button"
            label="Create New Template"
            onClick={() => push(`${basePath}/creator`)}
          />
        </div>
      </Spacings.Stack>

      <Spacings.Stack scale="xl">
        <SearchTextInput
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder={intl.formatMessage({
            id: 'search',
            defaultMessage: 'Search templates...',
          })}
          isDisabled={loading}
        />
      </Spacings.Stack>

      {loading ? (
        <LoadingSpinner scale="l">{TEXT.loading}</LoadingSpinner>
      ) : (
        <DataTable
          rows={sortedRows}
          columns={tableColumns}
          onRowClick={(row) => push(`${basePath}/creator?templateId=${row.id}`)}
          sortedBy={sort.key}
          sortDirection={sort.dir}
          onSortChange={onSortRequest}
        />
      )}
    </Spacings.Stack>
  );
};

TemplatesList.displayName = 'TemplatesList';

export default TemplatesList;
