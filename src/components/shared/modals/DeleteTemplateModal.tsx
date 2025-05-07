import {
  ConfirmationDialog,
  useModalState,
} from '@commercetools-frontend/application-components';
import useDeleteTemplate from '../../../hooks/useDeleteTemplate';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';

interface DeleteTemplateModalProps {
  children: (props: {
    isDeleting: boolean;
    handleDeleteClick: () => void;
  }) => React.ReactNode;
  templateData: {
    id: string;
    version: number;
  };
  onDelete?: () => void;
}

export const DeleteTemplateModal = ({
  children,
  templateData,
  onDelete,
}: DeleteTemplateModalProps) => {
  const confirmationModalState = useModalState();
  const { handleDelete, isDeleting } = useDeleteTemplate(() => onDelete?.());

  if (!templateData.id) return null;

  const handleConfirmDelete = () => {
    handleDelete({
      id: templateData.id,
      version: templateData.version,
    });
    confirmationModalState.closeModal();
  };

  const handleDeleteClick = () => {
    confirmationModalState.openModal();
  };

  return (
    <>
      {children({
        isDeleting,
        handleDeleteClick,
      })}
      <ConfirmationDialog
        title="Confirm template deletion"
        isOpen={confirmationModalState.isModalOpen}
        onClose={confirmationModalState.closeModal}
        onCancel={confirmationModalState.closeModal}
        onConfirm={handleConfirmDelete}
      >
        <Spacings.Stack scale="m">
          <Text.Body>
            Are you sure you want to delete this template? This action cannot be
            undone.
          </Text.Body>
        </Spacings.Stack>
      </ConfirmationDialog>
    </>
  );
};
