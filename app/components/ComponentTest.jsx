import React from 'react';

  export default function ComponentTest({ cart }) {
  const { lines, totalQuantity, cost, status, id, note, checkoutUrl } = cart;

	return (
		<div className="p-4 bg-gray-100 rounded">
			<h2 className="text-xl font-bold mb-2">ComponentTest</h2>
			<p>This is a basic test component.</p>
      <br />

      <h1>Your Cart</h1>
      <p>Total Items: {totalQuantity}</p>
      <p>Total Cost: {cost?.totalAmount?.amount}</p>
      <p>Note : {note}</p>
      <p>id : {id}</p>
      {/* <p>Checkout URL : {checkoutUrl}</p> */}
       <ul>
        {lines?.nodes.map((line) => (
          <li key={line.id}>
            {line.quantity} x {line.merchandise.title} - ${line.cost.totalAmount.amount}
          </li>
        ))}
      </ul> 

		</div>
	);
}
