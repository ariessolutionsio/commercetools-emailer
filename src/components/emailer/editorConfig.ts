import { BlockManager, BasicType, AdvancedType } from 'easy-email-core';
import { LineItemsBlockForManager } from './blocks/LineItemsBlock';

// Registrar los bloques personalizados
BlockManager.registerBlocks({
  'line-items': LineItemsBlockForManager,
});

export const customBlocks = [
  {
    type: 'line-items',
    payload: LineItemsBlockForManager.create({}),
  },
];

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
    type: BasicType.IMAGE,
    payload: BlockManager.getBlockByType(BasicType.IMAGE)!.create({}),
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
  // Bloques adicionales agregados
  {
    type: BasicType.HERO,
    payload: BlockManager.getBlockByType(BasicType.HERO)!.create({}),
  },
  {
    type: BasicType.CAROUSEL,
    payload: BlockManager.getBlockByType(BasicType.CAROUSEL)!.create({}),
  },
  {
    type: BasicType.ACCORDION,
    payload: BlockManager.getBlockByType(BasicType.ACCORDION)!.create({}),
  },
  {
    type: BasicType.TABLE,
    payload: BlockManager.getBlockByType(BasicType.TABLE)!.create({}),
  },
  {
    type: BasicType.NAVBAR,
    payload: BlockManager.getBlockByType(BasicType.NAVBAR)!.create({}),
  },
  {
    type: BasicType.RAW,
    payload: BlockManager.getBlockByType(BasicType.RAW)!.create({}),
  },
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

// Advanced blocks for more complex functionality
export const advancedBlocks = [
  {
    type: AdvancedType.TEXT,
    payload: BlockManager.getBlockByType(AdvancedType.TEXT)!.create({}),
  },
  {
    type: AdvancedType.IMAGE,
    payload: BlockManager.getBlockByType(AdvancedType.IMAGE)!.create({}),
  },
  {
    type: AdvancedType.BUTTON,
    payload: BlockManager.getBlockByType(AdvancedType.BUTTON)!.create({}),
  },
  {
    type: AdvancedType.DIVIDER,
    payload: BlockManager.getBlockByType(AdvancedType.DIVIDER)!.create({}),
  },
  {
    type: AdvancedType.SPACER,
    payload: BlockManager.getBlockByType(AdvancedType.SPACER)!.create({}),
  },
  {
    type: AdvancedType.SOCIAL,
    payload: BlockManager.getBlockByType(AdvancedType.SOCIAL)!.create({}),
  },
  {
    type: AdvancedType.NAVBAR,
    payload: BlockManager.getBlockByType(AdvancedType.NAVBAR)!.create({}),
  },
  {
    type: AdvancedType.HERO,
    payload: BlockManager.getBlockByType(AdvancedType.HERO)!.create({}),
  },
  {
    type: AdvancedType.CAROUSEL,
    payload: BlockManager.getBlockByType(AdvancedType.CAROUSEL)!.create({}),
  },
  {
    type: AdvancedType.ACCORDION,
    payload: BlockManager.getBlockByType(AdvancedType.ACCORDION)!.create({}),
  },
  {
    type: AdvancedType.TABLE,
    payload: BlockManager.getBlockByType(AdvancedType.TABLE)!.create({}),
  },
  {
    type: AdvancedType.WRAPPER,
    payload: BlockManager.getBlockByType(AdvancedType.WRAPPER)!.create({}),
  },
];

// Create initial values for the editor
export const createInitialValues = (subject: string) => ({
  subject: subject,
  content: BlockManager.getBlockByType(BasicType.PAGE)!.create({}),
});
