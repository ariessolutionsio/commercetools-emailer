import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useMemo, useState } from 'react';
import FlatButton from '@commercetools-uikit/flat-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import DataTable, { TColumn } from '@commercetools-uikit/data-table';
import { useCustomObjectsFetcher } from '../../hooks/use-custom-objects-connector/use-custom-object-connector';
import { CONTAINER } from '../../constants';
import SearchTextInput from '@commercetools-uikit/text-input';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon, EditIcon } from '@commercetools-uikit/icons';
import Tooltip from '@commercetools-uikit/tooltip';
import { RowData, SortState } from './types';
import useDeleteTemplate from '../../hooks/useDeleteTemplate';
import useBasePath from '../../hooks/useBasePath';
import { Logo } from '../images/logo';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

declare global {
  interface Window {
    app: {
      logoMustBeVisible: string;
    };
  }
}

const TemplatesList = () => {
  const intl = useIntl();
  const { push } = useHistory();
  const [sort, setSort] = useState<SortState>({
    key: 'name',
    dir: undefined,
  });
  const [searchValue, setSearchValue] = useState<string>('');
  const basePath = useBasePath();

  const { customObjectsPaginatedResult, loading, error, refetch } =
    useCustomObjectsFetcher({
      limit: 500,
      offset: 0,
      container: CONTAINER,
    });
  const { handleDelete, isDeleting } = useDeleteTemplate(() => refetch());

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

  const { environment } = useApplicationContext<{
    logoMustBeVisible?: unknown;
  }>();

  const logoMustBeVisible =
    String(environment.logoMustBeVisible).toLowerCase() === 'true';

  const tableData = useMemo(() => {
    return customObjectsPaginatedResult?.results || [];
  }, [customObjectsPaginatedResult]);

  const rows = useMemo<RowData[]>(
    () =>
      tableData.map((row) => {
        try {
          return {
            id: row.id,
            type: String(row.value.type),
            subject: String(row.value.subject),
            version: row.version,
          };
        } catch (error) {
          console.error('Error parsing template data:', error);
          return {
            id: row.id,
            type: String(row.value.type || ''),
            subject: String(row.value.subject || ''),
            version: row.version,
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

  const onDeleteClick = (template: RowData) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${template.subject}" template?`
    );

    if (isConfirmed) {
      handleDelete(template);
    }
  };

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
        shouldIgnoreRowClick: false,
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
        key: 'actions',
        isSortable: false,
        label: intl.formatMessage({ id: 'actions', defaultMessage: 'Actions' }),
        shouldIgnoreRowClick: true,
        isCondensed: true,
        renderItem: (row: RowData) => (
          <Spacings.Inline scale="s">
            <Tooltip placement="top" title="Edit Template">
              <IconButton
                label="Edit"
                icon={<EditIcon />}
                onClick={() => push(`${basePath}/creator?templateId=${row.id}`)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Delete Template">
              <IconButton
                label="Delete"
                icon={<BinLinearIcon />}
                onClick={() => onDeleteClick(row)}
                disabled={isDeleting}
              />
            </Tooltip>
          </Spacings.Inline>
        ),
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
          sortedBy={sort.key}
          sortDirection={sort.dir}
          onSortChange={onSortRequest}
        />
      )}
      <Spacings.Stack scale="m" alignItems="center">
        {logoMustBeVisible && <Logo />}
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

TemplatesList.displayName = 'TemplatesList';

export default TemplatesList;
