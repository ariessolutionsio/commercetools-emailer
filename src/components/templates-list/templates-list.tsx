import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import FlatButton from '@commercetools-uikit/flat-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { BackIcon } from '@commercetools-uikit/icons';
import DataTable, { TColumn } from '@commercetools-uikit/data-table';
import { useCustomObjectsFetcher } from '../../hooks/use-custom-objects-connector/use-custom-object-connector';
import { CONTAINER } from '../../constants';

type RowData = {
  id: string;
  type: string;
  subject: string;
  body: string;
};

const TemplatesList = ({ linkToDashboard }: { linkToDashboard?: string }) => {
  const intl = useIntl();
  const { push } = useHistory();
  const location = useLocation();

  const basePath = location.pathname.split('/').slice(0, -1).join('/');

  const { customObjectsPaginatedResult, loading, error } =
    useCustomObjectsFetcher({
      limit: 500,
      offset: 0,
      container: CONTAINER,
    });

  const tableData = customObjectsPaginatedResult?.results || [];

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

  const tableColumns: TColumn<RowData>[] = useMemo(
    () => [
      {
        key: 'type',
        label: intl.formatMessage({ id: 'type', defaultMessage: 'Type' }),
        isSortable: true,
        shouldIgnoreRowClick: true,
        align: 'center',
        isCondensed: true,
        renderItem: (row: RowData) => <div>{row.type}</div>,
        disableResizing: true,
      },
      {
        key: 'subject',
        label: intl.formatMessage({ id: 'subject', defaultMessage: 'Subject' }),
      },
      {
        key: 'body',
        label: intl.formatMessage({ id: 'body', defaultMessage: 'Body' }),
      },
    ],
    [intl]
  );

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

  if (error) return <div>{error.message}</div>;

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton
          as="button"
          onClick={() => push(linkToDashboard || '')}
          label={TEXT.back}
          icon={<BackIcon />}
        />
        <Text.Headline
          as="h2"
          intlMessage={{ id: 'title', defaultMessage: TEXT.title }}
        />
      </Spacings.Stack>

      {loading ? (
        <LoadingSpinner scale="l">{TEXT.loading}</LoadingSpinner>
      ) : (
        <DataTable
          rows={rows}
          columns={tableColumns}
          onRowClick={(row) => push(`${basePath}/creator?templateId=${row.id}`)}
        />
      )}
    </Spacings.Stack>
  );
};

TemplatesList.displayName = 'TemplatesList';

export default TemplatesList;
