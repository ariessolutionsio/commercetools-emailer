import { useIntl } from 'react-intl';
import { useMemo, useState } from 'react';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import { useCustomObjectsFetcher } from '../../hooks/use-custom-objects-connector/use-custom-object-connector';
import { CONTAINER } from '../../constants';
import SearchTextInput from '@commercetools-uikit/text-input';
import { RowData } from './types';
import { TemplatesTable } from './TemplatesTable';
import { TemplatesListHeader } from './TemplatesListHeader';

const TemplatesList = () => {
  const intl = useIntl();
  const [searchValue, setSearchValue] = useState<string>('');

  const { customObjectsPaginatedResult, loading, error, refetch } =
    useCustomObjectsFetcher({
      limit: 500,
      offset: 0,
      container: CONTAINER,
    });

  const onDelete = () => refetch();

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

  if (error) return <div>{error.message}</div>;

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <TemplatesListHeader />
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
        <TemplatesTable
          rows={rows}
          searchValue={searchValue}
          onDelete={onDelete}
        />
      )}
    </Spacings.Stack>
  );
};

TemplatesList.displayName = 'TemplatesList';

export default TemplatesList;
