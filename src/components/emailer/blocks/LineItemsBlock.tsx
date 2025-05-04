import React from 'react';
import {
  IBlockData,
  BasicType,
  components,
  IBlock,
  RecursivePartial,
} from 'easy-email-core';
import { omit } from 'lodash';

const { Section, Column, Text } = components;

export type ILineItemsBlockData = IBlockData<
  {
    'background-color': string;
    'text-color': string;
  },
  {
    text: string;
    items: Array<{
      productName: string;
      productQuantity: number;
      productSubTotal: string;
    }>;
    styles: {
      section: {
        padding: string;
        'background-color': string;
      };
      header: {
        text: {
          'font-size': string;
          padding: string;
          'font-weight': string;
        };
      };
      item: {
        section: {
          padding: string;
        };
        productName: {
          'font-size': string;
          'font-weight': string;
          padding: string;
          align: string;
        };
        details: {
          section: {
            padding: string;
          };
          quantity: {
            'font-size': string;
            padding: string;
            align: string;
            width: string;
          };
          subtotal: {
            'font-size': string;
            padding: string;
            align: string;
            width: string;
          };
        };
      };
    };
  }
>;

export function LineItemsBlock(
  props: RecursivePartial<ILineItemsBlockData['attributes']> & {
    value?: ILineItemsBlockData['data']['value'];
    children?: React.ReactNode;
  }
) {
  const { value = { text: 'Order Confirmation', items: [] }, ...rest } = props;
  const attributes = {
    'background-color': '#ffffff',
    'text-color': '#000000',
    ...omit(rest, ['children', 'value']),
  };

  return (
    <Section padding="20px" background-color={attributes['background-color']}>
      <Column>
        <Text
          color={attributes['text-color']}
          font-size="20px"
          padding="0 0 20px 0"
          font-weight="bold"
          value={{ content: value.text }}
        />

        {value.items && value.items.length > 0 ? (
          value.items.map((item, index) => (
            <Section key={index} padding="0 0 20px 0">
              <Column>
                <Text
                  color={attributes['text-color']}
                  font-size="16px"
                  font-weight="bold"
                  padding="0 0 5px 0"
                  align="left"
                  word-break="break-word"
                  value={{ content: item.productName }}
                />
                <Section padding="0">
                  <Column width="50%">
                    <Text
                      color={attributes['text-color']}
                      font-size="14px"
                      padding="0"
                      align="left"
                      value={{
                        content: 'Quantity: ' + String(item.productQuantity),
                      }}
                    />
                  </Column>
                  <Column width="50%">
                    <Text
                      color={attributes['text-color']}
                      font-size="14px"
                      padding="0"
                      align="right"
                      value={{ content: item.productSubTotal }}
                    />
                  </Column>
                </Section>
                {index < value.items.length - 1 && (
                  <Section padding="10px 0 0 0">
                    <Column>
                      <Text
                        color="#e0e0e0"
                        padding="0"
                        value={{ content: '________________________________' }}
                      />
                    </Column>
                  </Section>
                )}
              </Column>
            </Section>
          ))
        ) : (
          <Section padding="0">
            <Column>
              <Text
                color={attributes['text-color']}
                padding="10px"
                align="center"
                value={{ content: '<em>No items in this order</em>' }}
              />
            </Column>
          </Section>
        )}
      </Column>
    </Section>
  );
}

export const LineItemsBlockForManager: IBlock = {
  name: 'Items List',
  type: 'line-items',
  validParentType: [
    BasicType.PAGE,
    BasicType.WRAPPER,
    BasicType.SECTION,
    BasicType.GROUP,
    BasicType.COLUMN,
  ],
  create(payload?: RecursivePartial<ILineItemsBlockData>) {
    const defaultData: ILineItemsBlockData = {
      type: 'line-items',
      data: {
        value: {
          text: 'Order Confirmation',
          items: [
            {
              productName: 'Product 1',
              productQuantity: 2,
              productSubTotal: '$49.99',
            },
          ],
          styles: {
            section: {
              padding: '20px',
              'background-color': '#ffffff',
            },
            header: {
              text: {
                'font-size': '20px',
                padding: '0 0 20px 0',
                'font-weight': 'bold',
              },
            },
            item: {
              section: {
                padding: '0 0 20px 0',
              },
              productName: {
                'font-size': '16px',
                'font-weight': 'bold',
                padding: '0 0 5px 0',
                align: 'left',
              },
              details: {
                section: {
                  padding: '0',
                },
                quantity: {
                  'font-size': '14px',
                  padding: '0',
                  align: 'left',
                  width: '50%',
                },
                subtotal: {
                  'font-size': '14px',
                  padding: '0',
                  align: 'right',
                  width: '50%',
                },
              },
            },
          },
        },
      },
      attributes: {
        'background-color': '#ffffff',
        'text-color': '#000000',
      },
      children: [],
    };

    return {
      ...defaultData,
      ...payload,
    } as ILineItemsBlockData;
  },
  render(params: { data: ILineItemsBlockData }) {
    const data = params.data as ILineItemsBlockData;
    return <LineItemsBlock value={data.data.value} {...data.attributes} />;
  },
};
