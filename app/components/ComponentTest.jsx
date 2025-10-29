import React from 'react';
  import { useCart } from '@shopify/hydrogen-react';

  
  export default function ComponentTest() {
  const { lines, totalQuantity, cost } = useCart();
	return (
		<div className="p-4 bg-gray-100 rounded">
			<h2 className="text-xl font-bold mb-2">ComponentTest</h2>
			<p>This is a basic test component.</p>

      <br />
      <br />
      
      <br />

      <h1>Your Cart</h1>
      <p>Total Items: {totalQuantity}</p>
      <p>Total Cost: {cost?.totalAmount?.amount}</p>
      <ul>
        {lines?.map((line) => (
          <li key={line.id}>
            {line.quantity} x {line.merchandise.title} - ${line.cost.totalAmount.amount}
          </li>
        ))}
      </ul>

		</div>
	);
}
