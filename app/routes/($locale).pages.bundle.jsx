
import { useLoaderData } from 'react-router';
import { ProductItem } from '~/components/ProductItem';
import React, { useState } from 'react';
import {CartForm} from '@shopify/hydrogen';
import { data } from '@shopify/remix-oxygen';


export async function loader({ context }) {
  const [{ products }, { collections }] = await Promise.all([
    context.storefront.query(ALL_PRODUCTS_QUERY),
    context.storefront.query(ALL_COLLECTIONS_QUERY),
  ]);
  return {
    products: products?.nodes || [],
    categories: collections?.nodes || [],
  };
}

export default function BundlePage() {
  const { products, categories } = useLoaderData();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showTextarea, setShowTextarea] = useState(false);
  const [bundleMessage, setBundleMessage] = useState("Hello world");

  // Filter products by selected category (collection)
  const filteredProducts = selectedCategory
    ? products.filter(product =>
        product.collections &&
        product.collections.nodes.some(col => col.id === selectedCategory)
      )
    : products;
  // Handle product selection
  const handleProductClick = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      if (selectedProducts.length >= 5) return; // Prevent selecting more than 5
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Helper for selection status
  const isProductSelected = (productId) => selectedProducts.includes(productId);

  return (
  <div className="bundle-page relative min-h-screen">
  <h1 className="text-2xl font-bold mb-8">All Products</h1>
      {!showTextarea && (
        <div className="mb-4">
          <span className="mr-4 font-bold">Filter by category:</span>
          <div role="radiogroup" className="flex flex-wrap gap-2">
            <label className='px-5 py-2 border-1 border-gray-300 rounded-full cursor-pointer has-checked:bg-indigo-50'>
              <input                
                hidden
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ''}
                onChange={() => setSelectedCategory('')}
              />
              All Categories
            </label>
            {categories.map(category => (
              <label className='px-5 py-2 border-1 border-gray-300 rounded-full cursor-pointer has-checked:bg-indigo-50' key={category.id}>
                <input
                  hidden
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={selectedCategory === category.id}
                  onChange={() => setSelectedCategory(category.id)}
                />
                {category.title}
              </label>
            ))}
          </div>
        </div>
      )}
  <div className={selectedProducts.length === 5 ? "mb-4 font-bold text-green-600" : "mb-4 font-bold"}>
        Selected products: {selectedProducts.length} (max 5)
        {selectedProducts.length === 5 && <span style={{ marginLeft: '1rem', color: 'green' }}>Maximum reached</span>}
      </div>

      {!showTextarea && (
        <div className="products-grid grid gap-8 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, 220px)' }}>
          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map(product => (
              <div
                key={product.variants?.nodes?.[0]?.id}
                onClick={() => handleProductClick(product.variants?.nodes?.[0]?.id)}
                className={`rounded-lg transition-all duration-200 ${isProductSelected(product.variants?.nodes?.[0]?.id) ? 'border-4 border-blue-500 shadow-lg' : 'border border-gray-200'} ${selectedProducts.length >= 5 && !isProductSelected(product.variants?.nodes?.[0]?.id) ? 'opacity-50' : ''} cursor-${selectedProducts.length < 5 || isProductSelected(product.variants?.nodes?.[0]?.id) ? 'pointer' : 'not-allowed'}`}
              >
                <ProductItem product={product} disableLink />
              </div>
            ))
          )}
        </div>
      )}

      {showTextarea && (
        <div className="mx-auto max-w-xl my-8">
          <label htmlFor="bundle-textarea" className="block mb-4 font-bold">Gift message for your bundle:</label>
          <textarea
            id="bundle-textarea"
            rows={6}
            className="w-full p-4 text-lg rounded-lg border border-gray-300"
            placeholder="Write your custom gift message here..."
            value={bundleMessage}
            onChange={e => setBundleMessage(e.target.value)}
          />
        </div>
      )}


      {/* Sticky bottom bar */}
      <div className="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-200 shadow-lg p-4 text-center text-lg z-50 flex items-center justify-center gap-8">
        {selectedProducts.length < 2
          ? `Select at least ${2 - selectedProducts.length} more product${2 - selectedProducts.length === 1 ? '' : 's'} to continue.`
          : selectedProducts.length > 5
            ? 'You can select up to 5 products.'
            : showTextarea
              ? <>
                  <button
                    type="button"
                    className="px-8 py-3 text-lg bg-gray-600 text-white rounded-lg shadow-md transition-colors hover:bg-gray-700 mr-4"
                    onClick={() => setShowTextarea(false)}
                  >
                    Previous
                  </button>
                  <AddToCartButton
                    lines={selectedProducts.map(productId => ({ merchandiseId: productId, quantity: 1 }))}
                    bundleMessage={bundleMessage}
                    disabled={selectedProducts.length === 0 || !bundleMessage}
                    onSuccess={() => {
                      alert('Products added to cart with your message!');
                      setShowTextarea(false);
                      setSelectedProducts([]);
                      setBundleMessage("");
                    }}
                  />
                </>
              : <>
                  <span>{`You can select ${5 - selectedProducts.length} more product${5 - selectedProducts.length === 1 ? '' : 's'}.`}</span>
                  <button
                    type="button"
                    className="px-8 py-3 text-lg bg-blue-600 text-white rounded-lg shadow-md transition-colors hover:bg-blue-700"
                    onClick={() => setShowTextarea(true)}
                  >
                    Next Step
                  </button>
                </>
        }
      </div>
    </div>
  );
}

export function AddToCartButton({lines, bundleMessage, disabled, onSuccess}) {
  const [loading, setLoading] = useState(false);
  return (
    <CartForm
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{ lines, note: bundleMessage }}
      onSubmit={() => setLoading(true)}
      onSuccess={() => {
        setLoading(false);
        if (onSuccess) onSuccess();
      }}
      onError={() => setLoading(false)}
    >
      <button
        type="submit"
        className={`px-8 py-3 text-lg rounded-lg shadow-md transition-colors text-white mr-4 ${disabled || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}`}
        disabled={disabled || loading}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </CartForm>
  );
}


export async function action({ request, context }) {
  const { cart } = context;

  const formData = await request.formData();
  const { action, inputs } = CartForm.getFormInput(formData);

  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      // If note is provided, update it after adding lines
      if (inputs.note) {
        result = await cart.updateNote(inputs.note);
      }
      break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  // The Cart ID might change after each mutation, so update it each time.
  const headers = cart.setCartId(result.cart.id);

  return data(
    {
      cart: result.cart
    },
    { status: 200, headers },
  );

}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    products(first: 50, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        featuredImage {
          id
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        collections(first: 5) {
          nodes {
            id
            title
          }
        }
        variants(first: 10) {
          nodes {
            id
            title
            sku
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

const ALL_COLLECTIONS_QUERY = `#graphql
  query AllCollections($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    collections(first: 20, sortKey: TITLE) {
      nodes {
        id
        title
    }
  }
}
`;
