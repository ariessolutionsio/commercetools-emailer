import Tooltip from '@commercetools-uikit/tooltip'
import IconButton from '@commercetools-uikit/icon-button'
import { BinLinearIcon, EditIcon } from '@commercetools-uikit/icons'
import { useHistory } from 'react-router'
import useBasePath from '../../hooks/useBasePath'
import { type RowData } from './types'

interface Props {
  row: RowData
  isDeleting: boolean
  onDelete: (template: RowData) => void
}

export const TemplatesTableActions = ({ row, isDeleting, onDelete }: Props) => {
  const { push } = useHistory()
  const basePath = useBasePath()

  const onDeleteClick = (template: RowData) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${template.subject}" template?`
    )

    if (isConfirmed) {
      onDelete(template)
    }
  }

  return (
    <>
      <Tooltip placement='top' title='Edit Template'>
        <IconButton
          label='Edit'
          icon={<EditIcon />}
          onClick={() => push(`${basePath}/creator?templateId=${row.id}`)}
        />
      </Tooltip>
      <Tooltip placement='top' title='Delete Template'>
        <IconButton
          label='Delete'
          icon={<BinLinearIcon />}
          onClick={() => onDeleteClick(row)}
          disabled={isDeleting}
        />
      </Tooltip>
    </>
  )
}
