import { useHistory, useLocation } from 'react-router-dom';
import Constraints from '@commercetools-uikit/constraints';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  useCustomObjectUpdater,
  useCustomObjectFetcher,
} from '../../hooks/use-custom-objects-connector/use-custom-object-connector';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';
import useBasePath from '../../hooks/useBasePath';
import { EmailEditorProvider, type IEmailTemplate } from 'easy-email-editor';
import cloneDeep from 'lodash/cloneDeep';
import { mergeTags } from './mergeTags';
import { createInitialValues } from './editorConfig';
import { processMergeTags } from './utils/mergeTagProcessor';
import { EmailerTemplateHeader } from './EmailerTemplateHeader';
import { EmailerTypeSelector } from './EmailerTypeSelector';
import { EmailSubjectEditor } from './EmailSubjectEditor';
import { EmailEditorLayout } from './EmailEditorLayout';
import { useParsedTemplateValue } from './hooks/useParsedTemplateValue';

// Import styles
import 'easy-email-editor/lib/style.css';
import 'easy-email-extensions/lib/style.css';
import '@arco-design/web-react/dist/css/arco.css';

import styles from './Emailer.module.css';

const EmailTemplateCreator = () => {
  const { push } = useHistory();
  const location = useLocation();
  const { execute: updateCustomObject, loading: isUpdating } =
    useCustomObjectUpdater();
  const showNotification = useShowNotification();
  const basePath = useBasePath();
  const submitRef =
    useRef<() => Promise<IEmailTemplate | undefined> | undefined>(); // Ref to hold the submit function

  // Get templateId from URL query params
  const params = new URLSearchParams(location.search);
  const templateId = params.get('templateId');

  // Fetch template data if templateId exists
  const {
    customObject: templateData,
    loading: isLoadingTemplate,
    refetch,
  } = useCustomObjectFetcher({
    id: templateId,
  });

  const [emailType, setEmailType] = useState('');
  const [subject, setSubject] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const parsedTemplate = useParsedTemplateValue(templateData);

  // Initialize form with template data when it's loaded
  useEffect(() => {
    if (parsedTemplate) {
      setEmailType((prev) => prev || parsedTemplate?.type);
      setSubject((prev) => prev || parsedTemplate?.subject);
    }
  }, [parsedTemplate]);

  // Prepare initial values for the editor
  const initialValues = useMemo(() => {
    if (!parsedTemplate) return createInitialValues('');

    return {
      subject: parsedTemplate.subject,
      content: cloneDeep(parsedTemplate.body),
    };
  }, [parsedTemplate]);

  const handleSave = useCallback(
    async (values) => {
      if (!emailType || !subject) {
        showNotification({
          kind: 'error',
          domain: DOMAINS.SIDE,
          text: 'All fields are required!',
        });
        return;
      }

      setIsSaving(true);

      try {
        if (!values || !values.content) {
          throw new Error('Editor content is missing');
        }

        const cleanContent = cloneDeep(values.content);

        const emailTemplateData = {
          container: 'email-templates',
          key: emailType,
          value: JSON.stringify({
            type: emailType,
            subject,
            body: JSON.stringify(cleanContent),
          }),
        };

        if (templateData) {
          // Update existing template
          await updateCustomObject({
            draft: {
              ...emailTemplateData,
              version: templateData.version,
            },
            onCompleted: () => {
              showNotification({
                kind: 'success',
                domain: DOMAINS.SIDE,
                text: 'Template updated successfully!',
              });
              push(`${basePath}/templates-list`);
            },
            onError: () => {
              showNotification({
                kind: 'error',
                domain: DOMAINS.SIDE,
                text: 'Error updating template',
              });
            },
          });
        } else {
          // Create new template
          await updateCustomObject({
            draft: emailTemplateData,
            onCompleted: () => {
              showNotification({
                kind: 'success',
                domain: DOMAINS.SIDE,
                text: 'Template saved successfully!',
              });
              push(`${basePath}/templates-list`);
            },
            onError: () => {
              showNotification({
                kind: 'error',
                domain: DOMAINS.SIDE,
                text: 'Error saving template',
              });
            },
          });
        }
      } catch (error) {
        console.error('Error saving template:', error);
        showNotification({
          kind: 'error',
          domain: DOMAINS.SIDE,
          text: 'Error saving template',
        });
      } finally {
        setIsSaving(false);
      }
    },
    [
      emailType,
      subject,
      templateData,
      updateCustomObject,
      showNotification,
      push,
      basePath,
    ]
  );

  if (isLoadingTemplate) {
    return <LoadingSpinner />;
  }

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <EmailerTemplateHeader
          templateData={templateData}
          isActionDisabled={!emailType || !subject || isSaving || isUpdating}
          onActionClick={() => submitRef.current?.()}
          onDelete={() => refetch?.()}
        />
      </Spacings.Stack>

      <Constraints.Horizontal max="scale">
        <Spacings.Stack scale="m">
          <EmailerTypeSelector
            emailType={emailType}
            setEmailType={setEmailType}
          />

          <EmailSubjectEditor subject={subject} setSubject={setSubject} />

          <div className={styles['email-editor-container']}>
            <EmailEditorProvider
              data={initialValues}
              height={'100%'}
              autoComplete
              dashed={false}
              mergeTags={mergeTags}
              onSubmit={handleSave}
              onBeforePreview={(html: string) => {
                return processMergeTags(html);
              }}
            >
              {(_, { submit }) => {
                submitRef.current = submit; // Assign the submit function to the ref
                return <EmailEditorLayout />;
              }}
            </EmailEditorProvider>
          </div>

          {(isSaving || isUpdating) && <LoadingSpinner />}
        </Spacings.Stack>
      </Constraints.Horizontal>
    </Spacings.Stack>
  );
};

EmailTemplateCreator.displayName = 'EmailTemplateCreator';

export default EmailTemplateCreator;
