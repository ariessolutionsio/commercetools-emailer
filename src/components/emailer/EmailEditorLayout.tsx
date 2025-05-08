import { EmailEditor } from 'easy-email-editor';
import { StandardLayout } from 'easy-email-extensions';
import { standardBlocks, layoutBlocks } from './editorConfig';

const CATEGORIES = [
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
];

export const EmailEditorLayout = () => {
  return (
    <StandardLayout showSourceCode={false} categories={CATEGORIES}>
      <EmailEditor />
    </StandardLayout>
  );
};
