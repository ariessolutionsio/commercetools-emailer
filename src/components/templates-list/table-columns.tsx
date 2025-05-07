import { useIntl } from 'react-intl';
import { type RowData } from './types';
import Spacings from '@commercetools-uikit/spacings';
import { TemplatesTableActions } from './TemplatesTableActions';
import { type TColumn } from '@commercetools-uikit/data-table';
import styles from './TemplatesList.module.css';

const highlightText = (searchValue: string, text: string) => {
  if (!searchValue) return text;

  const regex = new RegExp(`(${searchValue})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === searchValue.toLowerCase() ? (
      <span key={index} className={styles['highlight-text']}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

interface TemplatesListColumnsProps {
  searchValue: string;
  intl: ReturnType<typeof useIntl>;
  onDelete: () => void;
}

export const getTableColumns = ({
  searchValue,
  intl,
  onDelete,
}: TemplatesListColumnsProps): TColumn<RowData>[] => [
  {
    key: 'type',
    label: intl.formatMessage({ id: 'type', defaultMessage: 'Type' }),
    isSortable: true,
    shouldIgnoreRowClick: false,
    align: 'left',
    // isCondensed: true,
    renderItem: (row: RowData) => <div>{row.type}</div>,
    disableResizing: true,
  },
  {
    key: 'subject',
    isSortable: true,
    label: intl.formatMessage({ id: 'subject', defaultMessage: 'Subject' }),
    renderItem: (row: RowData) => (
      <div>{highlightText(searchValue, row.subject)}</div>
    ),
  },
  {
    key: 'actions',
    isSortable: false,
    label: intl.formatMessage({ id: 'actions', defaultMessage: 'Actions' }),
    shouldIgnoreRowClick: true,
    // isCondensed: true,
    renderItem: (row: RowData) => (
      <Spacings.Inline scale="s">
        <TemplatesTableActions row={row} onDelete={onDelete} />
      </Spacings.Inline>
    ),
  },
];
