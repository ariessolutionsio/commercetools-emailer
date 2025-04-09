import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import Constraints from '@commercetools-uikit/constraints';
import FlatButton from '@commercetools-uikit/flat-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import SelectField from '@commercetools-uikit/select-field';
import TextInput from '@commercetools-uikit/text-input';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { BackIcon } from '@commercetools-uikit/icons';
import { useState, useRef, useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import {
  useCustomObjectUpdater,
  useCustomObjectFetcher,
} from '../../hooks/use-custom-objects-connector/use-custom-object-connector';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';
import { EmailTemplateCreatorProps } from './types';
import { emailTypes } from './constants';
import { initEditor } from './editor-config';
import useDeleteTemplate from '../../hooks/useDeleteTemplate';
import useBasePath from '../../hooks/useBasePath';

interface EmailTemplateValue {
  type: string;
  subject: string;
  body: string;
}

const EmailTemplateCreator = (props: EmailTemplateCreatorProps) => {
  const intl = useIntl();
  const { push } = useHistory();
  const location = useLocation();
  const editorRef = useRef<EditorJS>();
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { execute: updateCustomObject, loading: isUpdating } =
    useCustomObjectUpdater();
  const showNotification = useShowNotification();
  const basePath = useBasePath();

  // Get templateId from URL query params
  const params = new URLSearchParams(location.search);
  const templateId = params.get('templateId');

  // Fetch template data if templateId exists
  const {
    customObject: templateData,
    loading: isLoadingTemplate,
    refetch,
  } = templateId
    ? useCustomObjectFetcher({
        id: templateId,
      })
    : { customObject: null, loading: false };
  const { handleDelete, isDeleting } = useDeleteTemplate(() =>
    refetch ? refetch() : null
  );

  const [emailType, setEmailType] = useState('');
  const [subject, setSubject] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with template data when it's loaded
  useEffect(() => {
    if (templateData && templateId) {
      const templateValue = templateData.value as unknown as EmailTemplateValue;
      setEmailType(templateValue.type);
      setSubject(templateValue.subject);
    }
  }, [templateData, templateId]);

  // Initialize Editor.js
  useEffect(() => {
    let isMounted = true;

    const initializeEditor = async () => {
      if (!editorContainerRef.current) return;

      try {
        // Destroy existing editor instance if it exists
        if (editorRef.current) {
          await editorRef.current.destroy();
        }

        const newEditor = await initEditor(
          editorContainerRef.current,
          templateData || null
        );

        if (isMounted) {
          editorRef.current = newEditor;
          console.log('EditorJS initialized successfully');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error initializing EditorJS:', error);
        }
      }
    };

    const timer = setTimeout(initializeEditor, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, [templateData]);

  const handleDeleteClick = () => {
    if (!templateData) {
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: 'Template not found',
      });
      return;
    }
    handleDelete({
      id: templateData.id,
      version: templateData.version,
      type: String(templateData.value.type),
      subject: String(templateData.value.subject),
      body: String(templateData.value.body),
    });
  };

  const handleSave = async () => {
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
      if (!editorRef.current) {
        throw new Error('Editor not initialized');
      }

      const editorData = await editorRef.current.save();

      const emailTemplateData = {
        container: 'email-templates',
        key: emailType,
        value: JSON.stringify({
          type: emailType,
          subject,
          body: JSON.stringify(editorData),
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
            setIsSaving(false);
            editorRef.current?.clear();
            showNotification({
              kind: 'success',
              domain: DOMAINS.SIDE,
              text: 'Template saved successfully!',
            });
            push(`${basePath}/templates-list`);
          },
          onError: () => {
            setIsSaving(false);
            editorRef.current?.clear();
            showNotification({
              kind: 'error',
              domain: DOMAINS.SIDE,
              text: 'Error saving template',
            });
          },
        });
      }
    } catch (error) {
      setIsSaving(false);
      editorRef.current?.clear();
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: 'Error saving template',
      });
    }
  };

  if (isLoadingTemplate) {
    return <LoadingSpinner />;
  }

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <FlatButton
            as="button"
            onClick={() => push(props.linkToDashboard || '')}
            label={intl.formatMessage({
              id: 'back',
              defaultMessage: 'Back to Template List',
            })}
            icon={<BackIcon />}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <PrimaryButton
              label={templateId ? 'Update Template' : 'Save Template'}
              onClick={handleSave}
              isDisabled={!emailType || !subject || isSaving || isUpdating}
            />
            {templateId && (
              <PrimaryButton
                label="Delete Template"
                onClick={handleDeleteClick}
                isDisabled={isDeleting}
                tone="critical"
              />
            )}{' '}
          </div>
        </div>
        <Text.Headline
          as="h2"
          intlMessage={{
            id: 'title',
            defaultMessage: templateId
              ? 'Edit Email Template'
              : 'Create Email Template',
          }}
        />
      </Spacings.Stack>

      <Constraints.Horizontal max={13}>
        <Spacings.Stack scale="m">
          <SelectField
            title="Email Type"
            value={emailType}
            options={emailTypes}
            onChange={(event) => setEmailType(event.target.value as string)}
            placeholder="Select an email type"
            isRequired
          />

          <TextInput
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Enter email subject"
          />

          <div
            ref={editorContainerRef}
            style={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '20px',
              minHeight: '400px',
              height: '500px',
              position: 'relative',
              zIndex: 0,
              backgroundColor: '#ffffff',
              overflow: 'auto',
            }}
          />

          {(isSaving || isUpdating || isDeleting) && <LoadingSpinner />}
        </Spacings.Stack>
      </Constraints.Horizontal>
    </Spacings.Stack>
  );
};

EmailTemplateCreator.displayName = 'EmailTemplateCreator';

export default EmailTemplateCreator;
