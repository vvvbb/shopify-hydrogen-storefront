import { Await, useLoaderData, Link } from 'react-router';
import { Image } from '@shopify/hydrogen';
import { Suspense } from 'react';


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function BlocSeo({ products, inverse = false }) {
  const css_reverse = inverse ? 'md:flex-row-reverse' : 'md:flex-row';
  const randomNumber = getRandomInt(1);

  return (

    <div className={`bloc-seo flex flex-col bg-lime-500 ${css_reverse}`}>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <>
              {response
                ?
                <span className='bloc-seo-image relative flex-1'>
                  <Image
                    alt={response.products.nodes[randomNumber]?.featuredImage?.altText || "alt text"}
                    // aspectRatio="1/1"
                    src={response.products.nodes[randomNumber].featuredImage.url}
                    // loading={loading}
                    loading="lazy"
                    sizes="(min-width: 45em) 400px, 100vw"
                  />
                  <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 text-black'>
                    {response.products.nodes[randomNumber].title}
                  </span>
                </span>
                : null}
            </>
          )}
        </Await>
      </Suspense>

      <div className='grid grid-cols-6 flex-1'>
        <div className='col-start-2 col-end-6
        flex flex-col justify-center items-center'>
          <h4 className='text-2xl font-bold'>Hello Bloc Seo</h4>
          <p className='text-justify'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis deleniti deserunt dicta accusantium, quibusdam atque saepe? Adipisci, earum! Molestiae asperiores quidem, nemo error reprehenderit magnam velit voluptatum quae autem animi!
          </p>
        </div>
      </div>

    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
