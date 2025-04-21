import { BlockManager, BasicType, AdvancedType } from 'easy-email-core';
import { LineItemsBlockForManager } from './blocks/LineItemsBlock';

// Registrar los bloques personalizados
BlockManager.registerBlocks({ 
  'line-items': LineItemsBlockForManager
});

// Standard blocks for the email editor
export const standardBlocks = [
  {
    type: BasicType.TEXT,
    payload: BlockManager.getBlockByType(BasicType.TEXT)!.create({}),
  },
  {
    type: BasicType.BUTTON,
    payload: BlockManager.getBlockByType(BasicType.BUTTON)!.create({}),
  },
  {
    type: BasicType.SOCIAL,
    payload: BlockManager.getBlockByType(BasicType.SOCIAL)!.create({}),
  },
  {
    type: BasicType.DIVIDER,
    payload: BlockManager.getBlockByType(BasicType.DIVIDER)!.create({}),
  },
  {
    type: BasicType.SPACER,
    payload: BlockManager.getBlockByType(BasicType.SPACER)!.create({}),
  },
  {
    type: BasicType.WRAPPER,
    payload: BlockManager.getBlockByType(BasicType.WRAPPER)!.create({}),
  },
  {
    type: BasicType.IMAGE,
    payload: BlockManager.getBlockByType(BasicType.IMAGE)!.create({}),
  },
  {
    type: 'line-items',
    payload: LineItemsBlockForManager.create({}),
  }
];

// Layout blocks for the email editor
export const layoutBlocks = [
  {
    type: AdvancedType.SECTION,
    payload: BlockManager.getBlockByType(AdvancedType.SECTION)!.create({}),
  },
  {
    type: AdvancedType.GROUP,
    payload: BlockManager.getBlockByType(AdvancedType.GROUP)!.create({}),
  },
  {
    type: AdvancedType.COLUMN,
    payload: BlockManager.getBlockByType(AdvancedType.COLUMN)!.create({}),
  },
];

// Create initial values for the editor
export const createInitialValues = (subject: string) => ({
  subject: subject,
  content: BlockManager.getBlockByType(BasicType.PAGE)!.create({}),
}); 