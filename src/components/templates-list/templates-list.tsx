import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useMemo, useState } from 'react'
import FlatButton from '@commercetools-uikit/flat-button'
import LoadingSpinner from '@commercetools-uikit/loading-spinner'
import Spacings from '@commercetools-uikit/spacings'
import Text from '@commercetools-uikit/text'
import DataTable from '@commercetools-uikit/data-table'
import { useCustomObjectsFetcher } from '../../hooks/use-custom-objects-connector/use-custom-object-connector'
import { CONTAINER } from '../../constants'
import SearchTextInput from '@commercetools-uikit/text-input'
import { RowData, SortState } from './types'
import useDeleteTemplate from '../../hooks/useDeleteTemplate'
import useBasePath from '../../hooks/useBasePath'
import { getTableColumns } from './table-columns'

const TemplatesList = () => {
  const intl = useIntl()
  const { push } = useHistory()
  const [sort, setSort] = useState<SortState>({
    key: 'name',
    dir: undefined,
  })
  const [searchValue, setSearchValue] = useState<string>('')
  const basePath = useBasePath()

  const { customObjectsPaginatedResult, loading, error, refetch } =
    useCustomObjectsFetcher({
      limit: 500,
      offset: 0,
      container: CONTAINER,
    })
  const { handleDelete, isDeleting } = useDeleteTemplate(() => refetch())

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
  }

  const tableData = useMemo(() => {
    return customObjectsPaginatedResult?.results || []
  }, [customObjectsPaginatedResult])

  const rows = useMemo<RowData[]>(
    () =>
      tableData.map(row => {
        try {
          return {
            id: row.id,
            type: String(row.value.type),
            subject: String(row.value.subject),
            version: row.version,
          }
        } catch (error) {
          console.error('Error parsing template data:', error)
          return {
            id: row.id,
            type: String(row.value.type || ''),
            subject: String(row.value.subject || ''),
            version: row.version,
          }
        }
      }),
    [tableData]
  )

  const filteredRows = useMemo(() => {
    return rows.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchValue.toLowerCase())
      )
    )
  }, [rows, searchValue])

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const aValue = a[sort.key as keyof RowData]
      const bValue = b[sort.key as keyof RowData]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.dir === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      return 0
    })
  }, [filteredRows, sort])

  const tableColumns = getTableColumns({
    searchValue,
    intl,
    isDeleting,
    onDelete: handleDelete,
  })

  const onSortRequest = (key: SortState['key'], dir: SortState['dir']) => {
    setSort({
      key,
      dir,
    })
  }

  if (error) return <div>{error.message}</div>

  return (
    <Spacings.Stack scale='xl'>
      <Spacings.Stack scale='xs'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text.Headline
            as='h2'
            intlMessage={{ id: 'title', defaultMessage: TEXT.title }}
          />
          <FlatButton
            as='button'
            label='Create New Template'
            onClick={() => push(`${basePath}/creator`)}
          />
        </div>
      </Spacings.Stack>

      <Spacings.Stack scale='xl'>
        <SearchTextInput
          value={searchValue}
          onChange={event => setSearchValue(event.target.value)}
          placeholder={intl.formatMessage({
            id: 'search',
            defaultMessage: 'Search templates...',
          })}
          isDisabled={loading}
        />
      </Spacings.Stack>

      {loading ? (
        <LoadingSpinner scale='l'>{TEXT.loading}</LoadingSpinner>
      ) : (
        <DataTable
          rows={sortedRows}
          columns={tableColumns}
          sortedBy={sort.key}
          sortDirection={sort.dir}
          onSortChange={onSortRequest}
        />
      )}
    </Spacings.Stack>
  )
}

TemplatesList.displayName = 'TemplatesList'

export default TemplatesList
