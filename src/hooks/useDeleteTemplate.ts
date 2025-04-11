import { useState } from 'react';
import { DOMAINS } from '@commercetools-frontend/constants';
import { useCustomObjectDeleter } from './use-custom-objects-connector/use-custom-object-connector';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { RowData } from '../components/templates-list/types';

type UseDeleteTemplate = (handleCompleted: () => void) => {
  handleDelete: (templateData: RowData | undefined) => Promise<void>;
  isDeleting: boolean;
};

const useDeleteTemplate: UseDeleteTemplate = (handleCompleted) => {
  const showNotification = useShowNotification();
  const [isDeleting, setIsDeleting] = useState(false);
  const { execute } = useCustomObjectDeleter();

  const handleDelete = async (templateData: RowData | undefined) => {
    if (!templateData) {
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: 'Template not found',
      });
      return;
    }

    if (!templateData.id) {
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: 'Please enter a template ID',
      });
      return;
    }

    setIsDeleting(true);
    try {
      await execute({
        id: templateData.id,
        version: templateData.version,
        onCompleted: () => {
          showNotification({
            kind: 'success',
            domain: DOMAINS.SIDE,
            text: 'Template deleted successfully!',
          });
          handleCompleted();
        },
        onError: () => {
          showNotification({
            kind: 'error',
            domain: DOMAINS.SIDE,
            text: 'Error deleting template',
          });
        },
      });
    } catch (error) {
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: 'Error deleting template',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
};

export default useDeleteTemplate;
