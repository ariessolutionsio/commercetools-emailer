import FlatButton from '@commercetools-uikit/flat-button';
import { BackIcon } from '@commercetools-uikit/icons';
import { useHistory, useLocation } from 'react-router';
import useBasePath from '../../hooks/useBasePath';
import Text from '@commercetools-uikit/text';
import type { Maybe, TCustomObject } from '../../types/generated/ctp';
import { DeleteTemplateModal } from '../shared/modals/DeleteTemplateModal';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import PrimaryButton from '@commercetools-uikit/primary-button';

import styles from './Emailer.module.css';

interface EmailerTemplateHeaderProps {
  templateData?: Maybe<TCustomObject>;
  isActionDisabled: boolean;
  onSaveClick: () => void;
  onDelete: () => void;
}

export const EmailerTemplateHeader = ({
  templateData,
  isActionDisabled,
  onSaveClick,
  onDelete,
}: EmailerTemplateHeaderProps) => {
  const { push } = useHistory();
  const location = useLocation();
  const basePath = useBasePath();
  const linkToDashboard = `${basePath}/templates-list`;

  const params = new URLSearchParams(location.search);
  const templateId = params.get('templateId');

  return (
    <>
      <div className={styles['template-header-navigation']}>
        <FlatButton
          as="button"
          onClick={() => push(linkToDashboard)}
          label="Back to Template List"
          icon={<BackIcon />}
        />
      </div>
      <div className={styles['template-header-content']}>
        <Text.Headline as="h2">
          {templateId ? 'Edit Email Template' : 'Create Email Template'}
        </Text.Headline>
        <div className={styles['template-header-actions']}>
          {templateData?.id && (
            <DeleteTemplateModal
              templateData={{
                id: templateData?.id,
                version: templateData?.version,
              }}
              onDelete={() => onDelete()}
            >
              {({ isDeleting, handleDeleteClick }) => (
                <SecondaryButton
                  label="Delete"
                  onClick={handleDeleteClick}
                  isDisabled={isDeleting}
                />
              )}
            </DeleteTemplateModal>
          )}
          <PrimaryButton
            label={templateId ? 'Update' : 'Save'}
            onClick={onSaveClick}
            isDisabled={isActionDisabled}
          />
        </div>
      </div>
    </>
  );
};
