/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useHistory, useLocation } from 'react-router-dom'
import Constraints from '@commercetools-uikit/constraints'
import FlatButton from '@commercetools-uikit/flat-button'
import Label from '@commercetools-uikit/label'
import LoadingSpinner from '@commercetools-uikit/loading-spinner'
import Spacings from '@commercetools-uikit/spacings'
import Text from '@commercetools-uikit/text'
import SelectField from '@commercetools-uikit/select-field'
import PrimaryButton from '@commercetools-uikit/primary-button'
import SecondaryButton from '@commercetools-uikit/secondary-button'
import { BackIcon } from '@commercetools-uikit/icons'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  useCustomObjectUpdater,
  useCustomObjectFetcher,
  useCustomObjectsFetcher,
} from '../../hooks/use-custom-objects-connector/use-custom-object-connector'
import { useShowNotification } from '@commercetools-frontend/actions-global'
import { DOMAINS } from '@commercetools-frontend/constants'
import { EmailTemplateCreatorProps, EmailType } from './types'
import { emailTypes } from './constants'
import useDeleteTemplate from '../../hooks/useDeleteTemplate'
import useBasePath from '../../hooks/useBasePath'
import {
  EmailEditor,
  EmailEditorProvider,
  type IEmailTemplate,
} from 'easy-email-editor'
import { StandardLayout } from 'easy-email-extensions'
import { cloneDeep } from 'lodash'
import {
  ConfirmationDialog,
  useModalState,
} from '@commercetools-frontend/application-components'
import { mergeTags } from './mergeTags'
import {
  standardBlocks,
  layoutBlocks,
  createInitialValues,
} from './editorConfig'
import { processMergeTags } from './utils/mergeTagProcessor'
import { processSubjectMergeTags } from './utils/subjectMergeTagProcessor'
import SubjectWithMergeTags from './SubjectWithMergeTags'
import { CONTAINER } from '../../constants'

// Import styles
import 'easy-email-editor/lib/style.css'
import 'easy-email-extensions/lib/style.css'
import '@arco-design/web-react/dist/css/arco.css'
import { filterEmailTypesWithCustomObjects } from '../../helpers'

interface EmailTemplateValue {
  type: string
  subject: string
  body: any
}

const EmailTemplateCreator = (props: EmailTemplateCreatorProps) => {
  const { push } = useHistory()
  const location = useLocation()
  const { execute: updateCustomObject, loading: isUpdating } =
    useCustomObjectUpdater()
  const showNotification = useShowNotification()
  const basePath = useBasePath()
  const confirmationModalState = useModalState()
  const submitRef =
    useRef<() => Promise<IEmailTemplate | undefined> | undefined>() // Ref to hold the submit function

  // Get templateId from URL query params
  const params = new URLSearchParams(location.search)
  const templateId = params.get('templateId')

  // Fetch template data if templateId exists
  const {
    customObject: templateData,
    loading: isLoadingTemplate,
    refetch,
  } = templateId
    ? useCustomObjectFetcher({
        id: templateId,
      })
    : { customObject: null, loading: false }

  const { handleDelete, isDeleting } = useDeleteTemplate(() =>
    refetch ? refetch() : null
  )

  const { customObjectsPaginatedResult } = useCustomObjectsFetcher({
    limit: 500,
    offset: 0,
    container: CONTAINER,
  })

  const filteredEmailTypes = filterEmailTypesWithCustomObjects(
    customObjectsPaginatedResult,
    emailTypes
  )

  const [emailType, setEmailType] = useState('')
  const [subject, setSubject] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form with template data when it's loaded
  useEffect(() => {
    if (templateData && templateId) {
      const templateValue = templateData.value as unknown as EmailTemplateValue
      setEmailType(templateValue.type)
      setSubject(templateValue.subject)
    }
  }, [templateData])

  // Prepare initial values for the editor
  const initialValues = useMemo(() => {
    if (templateData) {
      const templateValue = templateData.value as any
      try {
        const bodyContent = JSON.parse(templateValue.body)

        console.log('bodyContent', bodyContent)
        return {
          subject: templateValue.subject,
          content: cloneDeep(bodyContent),
        }
      } catch (e) {
        console.error('Error parsing template body:', e)
        return createInitialValues(templateValue.subject)
      }
    }

    return createInitialValues(subject)
  }, [templateData])

  const handleDeleteClick = () => {
    if (!templateData) {
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: 'Template not found',
      })
      return
    }
    confirmationModalState.openModal()
  }

  const handleConfirmDelete = useCallback(() => {
    if (!templateData) return
    handleDelete({
      id: templateData.id,
      version: templateData.version,
      type: templateData.value.type as string,
      subject: templateData.value.subject as string,
    })
    confirmationModalState.closeModal()
  }, [templateData, handleDelete, confirmationModalState])

  const handleSave = useCallback(
    async (values: any) => {
      if (!emailType || !subject) {
        showNotification({
          kind: 'error',
          domain: DOMAINS.SIDE,
          text: 'All fields are required!',
        })
        return
      }

      setIsSaving(true)

      try {
        if (!values || !values.content) {
          throw new Error('Editor content is missing')
        }

        const cleanContent = cloneDeep(values.content)

        const emailTemplateData = {
          container: 'email-templates',
          key: emailType,
          value: JSON.stringify({
            type: emailType,
            subject,
            body: JSON.stringify(cleanContent),
          }),
        }

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
              })
              push(`${basePath}/templates-list`)
            },
            onError: () => {
              showNotification({
                kind: 'error',
                domain: DOMAINS.SIDE,
                text: 'Error updating template',
              })
            },
          })
        } else {
          // Create new template
          await updateCustomObject({
            draft: emailTemplateData,
            onCompleted: () => {
              showNotification({
                kind: 'success',
                domain: DOMAINS.SIDE,
                text: 'Template saved successfully!',
              })
              push(`${basePath}/templates-list`)
            },
            onError: () => {
              showNotification({
                kind: 'error',
                domain: DOMAINS.SIDE,
                text: 'Error saving template',
              })
            },
          })
        }
      } catch (error) {
        console.error('Error saving template:', error)
        showNotification({
          kind: 'error',
          domain: DOMAINS.SIDE,
          text: 'Error saving template',
        })
      } finally {
        setIsSaving(false)
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
  )

  if (isLoadingTemplate) {
    return <LoadingSpinner />
  }

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
          <FlatButton
            as='button'
            onClick={() => push(props.linkToDashboard || '')}
            label='Back to Template List'
            icon={<BackIcon />}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text.Headline as='h2'>
            {templateId ? 'Edit Email Template' : 'Create Email Template'}
          </Text.Headline>
          <div style={{ display: 'flex', gap: '10px' }}>
            {templateId && (
              <SecondaryButton
                label='Delete'
                onClick={handleDeleteClick}
                isDisabled={isDeleting}
              />
            )}
            <PrimaryButton
              label={templateId ? 'Update' : 'Save'}
              onClick={() => submitRef.current?.()} // Call the submit function via the ref
              isDisabled={!emailType || !subject || isSaving || isUpdating}
            />
          </div>
        </div>
      </Spacings.Stack>

      <Constraints.Horizontal max='scale'>
        <Spacings.Stack scale='m'>
          <SelectField
            title='Email Type'
            value={emailType}
            options={filteredEmailTypes}
            onChange={event => setEmailType(event.target.value as string)}
            placeholder='Select an email type'
            isRequired
            isOptionDisabled={opt => {
              const option = opt as EmailType
              return option.isUsed
            }}
          />

          <div>
            <Label>Subject</Label>
            <SubjectWithMergeTags
              value={subject}
              onChange={setSubject}
              placeholder='Enter email subject'
            />
            {subject && (
              <div style={{ marginTop: '20px' }}>
                <Spacings.Stack scale='xs'>
                  <Label>Subject Preview</Label>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '4px',
                      border: '1px solid #e6e6e6',
                    }}
                  >
                    <Text.Body>{processSubjectMergeTags(subject)}</Text.Body>
                  </div>
                </Spacings.Stack>
              </div>
            )}
          </div>

          <div style={{ width: '100%', height: 'calc(100vh - 300px)' }}>
            <EmailEditorProvider
              data={initialValues}
              height={'100%'}
              autoComplete
              dashed={false}
              mergeTags={mergeTags}
              onSubmit={handleSave}
              onBeforePreview={(html: string) => {
                return processMergeTags(html)
              }}
            >
              {({ values = {} }, { submit }) => {
                submitRef.current = submit // Assign the submit function to the ref
                return (
                  <>
                    <ConfirmationDialog
                      title='Confirm template deletion'
                      isOpen={confirmationModalState.isModalOpen}
                      onClose={confirmationModalState.closeModal}
                      onCancel={confirmationModalState.closeModal}
                      onConfirm={handleConfirmDelete}
                    >
                      <Spacings.Stack scale='m'>
                        <Text.Body>
                          Are you sure you want to delete this template? This
                          action cannot be undone.
                        </Text.Body>
                      </Spacings.Stack>
                    </ConfirmationDialog>

                    <StandardLayout
                      showSourceCode={false}
                      categories={[
                        {
                          label: 'Content',
                          active: true,
                          blocks: standardBlocks,
                        },
                        {
                          label: 'Layout',
                          active: false,
                          blocks: layoutBlocks,
                        },
                        {
                          label: 'Custom',
                          active: false,
                          blocks: [],
                        },
                      ]}
                    >
                      <EmailEditor />
                    </StandardLayout>
                  </>
                )
              }}
            </EmailEditorProvider>
          </div>

          {(isSaving || isUpdating || isDeleting) && <LoadingSpinner />}
        </Spacings.Stack>
      </Constraints.Horizontal>
    </Spacings.Stack>
  )
}

EmailTemplateCreator.displayName = 'EmailTemplateCreator'

export default EmailTemplateCreator
