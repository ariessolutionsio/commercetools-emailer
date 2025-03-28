import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Link from '@editorjs/link';
import Embed from '@editorjs/embed';
import { EmailTemplateValue } from './types';
import { TCustomObject } from '../../types/generated/ctp';

export const initEditor = async (
  container: HTMLDivElement,
  templateData: TCustomObject | null
) => {
  try {
    const initialData = templateData
      ? JSON.parse((templateData.value as unknown as EmailTemplateValue).body)
      : {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Start creating your email template...',
              },
            },
          ],
        };

    return new EditorJS({
      holder: container,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            inlineToolbar: true
          }
        },
        list: { 
          class: List, 
          inlineToolbar: true,
          config: {
            inlineToolbar: true,
            defaultStyle: 'unordered',
            types: ['unordered', 'ordered']
          }
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
          config: {
            inlineToolbar: true
          }
        },
        link: { 
          class: Link, 
          inlineToolbar: true,
          config: {
            inlineToolbar: true
          }
        },
        embed: { 
          class: Embed, 
          inlineToolbar: true,
          config: {
            inlineToolbar: true
          }
        },
      },
      inlineToolbar: true,
      data: initialData,
    });
  } catch (error) {
    console.error('Error initializing EditorJS:', error);
    throw error;
  }
}; 