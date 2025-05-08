import Label from '@commercetools-uikit/label';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import SubjectWithMergeTags from './SubjectWithMergeTags';
import { processSubjectMergeTags } from './utils/subjectMergeTagProcessor';

interface EmailSubjectEditorProps {
  subject: string;
  setSubject: (subject: string) => void;
}

export const EmailSubjectEditor = ({
  subject,
  setSubject,
}: EmailSubjectEditorProps) => {
  return (
    <div>
      <Label>Subject</Label>
      <SubjectWithMergeTags
        value={subject}
        onChange={setSubject}
        placeholder="Enter email subject"
      />
      {subject && (
        <div style={{ marginTop: '20px' }}>
          <Spacings.Stack scale="xs">
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
  );
};
