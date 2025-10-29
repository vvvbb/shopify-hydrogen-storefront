import {json} from '@shopify/hydrogen';

const CART_CREATE_MUTATION = `#graphql
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: {lines: $lines}) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
              quantity
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function action({request, context}) {
  let productId, quantity;
  try {
    const body = await request.json();
    productId = body.productId;
    quantity = body.quantity || 1;
  } catch (e) {
    // fallback for form submissions
    const formData = await request.formData();
    productId = formData.get('productId');
    quantity = formData.get('quantity') || 1;
  }
  const variables = {
    lines: [
      {
        merchandiseId: productId,
        quantity: Number(quantity),
      },
    ],
  };
  const response = await context.storefront.mutate(CART_CREATE_MUTATION, {
    variables,
  });
  return json(response);
}
