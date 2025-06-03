import { EmailEditor } from 'easy-email-editor';
import { StandardLayout } from 'easy-email-extensions';
import { standardBlocks, layoutBlocks, customBlocks } from './editorConfig';

const CATEGORIES = [
  {
    label: 'Content',
    active: true,
    blocks: standardBlocks,
  },
  {
    label: 'Layout',
    active: true,
    blocks: layoutBlocks,
  },
  {
    label: 'Custom',
    active: true,
    blocks: customBlocks,
    displayType: 'grid' as const,
  },
];

export const EmailEditorLayout = () => {
  return (
    <StandardLayout showSourceCode={false} categories={CATEGORIES}>
      <EmailEditor />
    </StandardLayout>
  );
};
