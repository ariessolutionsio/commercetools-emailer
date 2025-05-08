import { EmailEditor } from 'easy-email-editor';
import { StandardLayout } from 'easy-email-extensions';
import { standardBlocks, layoutBlocks } from './editorConfig';

export const EmailEditorLayout = () => {
  return (
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
  );
};
