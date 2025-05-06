import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import SearchTextInput from '@commercetools-uikit/text-input';
import { useCustomObjectsFetcher } from '../../hooks/use-custom-objects-connector/use-custom-object-connector';
import { CONTAINER } from '../../constants';
import { RowData } from './types';
import { TemplatesTable } from './TemplatesTable';
import { TemplatesListHeader } from './TemplatesListHeader';
import messages from './messages';

const TemplatesList = () => {
  const intl = useIntl();
  const [searchValue, setSearchValue] = useState<string>('');

  const { customObjectsPaginatedResult, loading, error, refetch } =
    useCustomObjectsFetcher({
      limit: 500,
      offset: 0,
      container: CONTAINER,
    });

  const rows: RowData[] = useMemo(
    () =>
      customObjectsPaginatedResult?.results?.map((row) => ({
        id: row.id,
        type: String(row?.value?.type ?? ''),
        subject: String(row?.value?.subject ?? ''),
        version: row.version,
      })) ?? [],

    [customObjectsPaginatedResult]
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
        <LoadingSpinner scale="l">
          <FormattedMessage {...messages.loading} />
        </LoadingSpinner>
      ) : (
        <TemplatesTable
          rows={rows}
          searchValue={searchValue}
          onDelete={() => refetch()}
        />
      )}
    </Spacings.Stack>
  );
};

TemplatesList.displayName = 'TemplatesList';

export default TemplatesList;
