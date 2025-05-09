import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useUnsavedChangesWarning } from './useUnsavedChangesWarning';

interface UnsavedChangesModalProps {
  hasUnsavedChanges: boolean;
}

export const UnsavedChangesModal = ({
  hasUnsavedChanges,
}: UnsavedChangesModalProps) => {
  const { showModal, handleConfirmNavigation, handleCloseModal } =
    useUnsavedChangesWarning({ hasUnsavedChanges });

  return (
    <ConfirmationDialog
      title="Unsaved changes"
      isOpen={showModal}
      onClose={handleCloseModal}
      onCancel={handleCloseModal}
      onConfirm={handleConfirmNavigation}
    >
      <Spacings.Stack scale="m">
        <Text.Body>
          You have unsaved changes. Are you sure you want to leave?
        </Text.Body>
      </Spacings.Stack>
    </ConfirmationDialog>
  );
};
