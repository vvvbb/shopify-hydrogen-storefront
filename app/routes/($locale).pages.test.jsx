import { useLoaderData } from 'react-router';
import { CartForm } from '@shopify/hydrogen';
import { data } from '@shopify/remix-oxygen';

// import invariant from 'tiny-invariant';


/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({ context }) {
  const { cart } = context;
  return await cart.get();
}

export default function Cart() {
  /** @type {LoaderReturnData} */
  const cart = useLoaderData();

  const { currencyCode, amount } = cart.cost.totalAmount;

  console.log('cart', cart);

  return (
    <div className="cart">
      <h1>Cart</h1>
      <div>
        <u>Cart {cart.totalQuantity} items:</u><b> {amount}{currencyCode}</b>
        <br />
        <br />

        <u>Cart Total:</u><b> {amount}{currencyCode}</b>
        <br />
        <br />

        <u>Cart Note:</u><b> {cart.note}</b>
        <br />
        <br />

        <u>Cart Attributes:</u><b> {cart.attributes.map(attr => `${attr.key}: ${attr.value}`).join(', ')}</b>
        <br />
        <br />



        <ul className=''>
          {cart.lines.nodes.map((line) => (
            <li className='list-decimal list-inside' key={line.id}>
              {line.merchandise.product.title}  - {line.id} <br />
              {line.quantity} qty * {line.cost.amountPerQuantity.amount} = {line.cost.totalAmount.amount}{line.cost.totalAmount.currencyCode} <br />
              {line.attributes.map(attr => (
                <span key={attr.key}>{attr.key}: {attr.value} </span>
              ))}
              <br />

              <CartForm
                route="/cart"
                action={CartForm.ACTIONS.LinesRemove}
                inputs={
                  { lineIds: [line.id] }
                }
              >
                <button className="bg-red-300 px-2 py-1 rounded-full text-white text-xs">
                  Remove item
                </button>
              </CartForm>


            </li>
          ))}
        </ul>
      </div>

      <div className='flex gap-4'>
        <AddToCartButton
          lines={[
            {
              merchandiseId: "gid://shopify/ProductVariant/39547092631667",
              quantity: 1
            }
          ]}
        />
        <UpdateCartItemsButton
          lines={[
            {
              id: cart.lines.nodes[2]?.id,
              // id: "gid://shopify/CartLine/835186c3-0e1d-4d32-babf-70c9bf792aa8?cart=hWN37pcbkZpjxLzDaouqAgC3",
              quantity: 1
            }
          ]}
        />
        <UpdateCartNoteButton
          note={"This is my updated note!"}
        />
        <AttributeUpdateForm
          attributes={[
            {
              key: "Color",
              value: "Blue"
            },
            {
              key: "Size",
              value: "M"
            }
          ]}
        />
      </div>


      <div className='mt-8 p-4 border border-gray-300'>
         <AddProductWithNoteButton
          merchandiseId="gid://shopify/ProductVariant/39547092631667"
          quantity={1}
          note="Added with custom note!"
        />

      </div>
    </div>
  );
}

export function AddToCartButton({ lines }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={
        { lines }
      }
    >
      <button className="bg-red-500 px-4 py-2 rounded text-white">
        Add to cart
      </button>
    </CartForm>
  );
}

export function UpdateCartItemsButton({ lines }) {
  return (
    <CartForm
      route="/pages/test"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={
        { lines }
      }
    >
      <button className="bg-green-500 px-4 py-2 rounded text-white">
        Update cart qty
      </button>
    </CartForm>
  );
}

export function UpdateCartNoteButton({ note }) {
  return (
    <CartForm
      action={CartForm.ACTIONS.NoteUpdate}
      inputs={{
        note
      }}
      className="flex flex-wrap gap-2 items-center"
    >
      <input type="text" name="note" />
      <button className="bg-blue-500 px-4 py-2 rounded text-white">
        Update cart note
      </button>
    </CartForm>
  );
}


export function AttributeUpdateForm({ attributes }) {
  return (
    <CartForm
      action={CartForm.ACTIONS.AttributesUpdateInput}
      inputs={
        { attributes }
      }
    >
      <button className="bg-cyan-600 px-4 py-2 rounded text-white">
        Update attribute
      </button>
    </CartForm>
  );
}


export function AddProductWithNoteButton({ merchandiseId, quantity = 1, note }) {
  return (
    <CartForm
      route="/pages/test"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{
        lines: [{ merchandiseId, quantity }],
        note
      }}
    >
      <button className="bg-purple-600 px-4 py-2 rounded text-white hover:bg-purple-700">
        Add Product + Note
      </button>
    </CartForm>
  );
}


export async function action({ request, context }) {
  const { cart } = context;

  const formData = await request.formData();
  const { action, inputs } = CartForm.getFormInput(formData);

  let result;

  console.log('action inputs', action, inputs);

  switch (action) {
    case CartForm.ACTIONS.NoteUpdate:
    case "NoteUpdate":
      const note = String(formData.get('note') || '');
      result = await cart.updateNote(note);
      break;
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      // If note is provided, update it after adding lines
      if (inputs.note) {
        result = await cart.updateNote(inputs.note);
      }
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.AttributesUpdateInput:
      result = await cart.updateAttributes(inputs.attributes);
      break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }


  console.log('action result', result);

  // The Cart ID might change after each mutation, so update it each time.
  const headers = cart.setCartId(result.cart.id);

  console.log("action headers", headers);


  return data(
    {
      cart: result.cart
    },
    { status: 200, headers },
  );

  return json(
    result,
    { status: 200, headers },
  );
}