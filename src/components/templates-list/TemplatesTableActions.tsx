import Tooltip from '@commercetools-uikit/tooltip';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon, EditIcon } from '@commercetools-uikit/icons';
import { useHistory } from 'react-router';
import useBasePath from '../../hooks/useBasePath';
import { type RowData } from './types';
import { DeleteTemplateModal } from '../shared/modals/DeleteTemplateModal';

interface Props {
  row: RowData;
  onDelete: () => void;
}

export const TemplatesTableActions = ({ row, onDelete }: Props) => {
  const { push } = useHistory();
  const basePath = useBasePath();

  return (
    <>
      <Tooltip placement="top" title="Edit Template">
        <IconButton
          label="Edit"
          icon={<EditIcon />}
          onClick={() => push(`${basePath}/creator?templateId=${row.id}`)}
        />
      </Tooltip>
      <Tooltip placement="top" title="Delete Template">
        <DeleteTemplateModal templateData={row} onDelete={() => onDelete()}>
          {({ isDeleting, handleDeleteClick }) => (
            <IconButton
              label="Delete"
              icon={<BinLinearIcon />}
              onClick={handleDeleteClick}
              disabled={isDeleting}
            />
          )}
        </DeleteTemplateModal>
      </Tooltip>
    </>
  );
};
