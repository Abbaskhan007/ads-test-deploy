import Head from "next/head";

const StripePricingTable = ({ pricingTableId, publishableKey }) => (
  <Head>
    <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
    <script
      dangerouslySetInnerHTML={{
        __html: `
        var stripe = Stripe('${publishableKey}');
        var pricingTable = document.querySelector('stripe-pricing-table');
        pricingTable.setAttribute('stripe-key', '${publishableKey}');
        pricingTable.setAttribute('table', '${pricingTableId}');
        pricingTable.setAttribute('mode', 'payment');
        pricingTable.setAttribute('currency', 'usd');
        pricingTable.addEventListener('click', function (event) {
          stripe
            .redirectToCheckout({
              lineItems: [{ price: event.detail.priceId, quantity: 1 }],
              mode: 'payment',
              successUrl: 'https://yourdomain.com/success',
              cancelUrl: 'https://yourdomain.com/cancel',
            })
            .then(function (result) {
              if (result.error) {
                console.log(result.error);
              }
            });
        });
      `,
      }}
    ></script>

    
<script
      dangerouslySetInnerHTML={{
        __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
      }}
    />
    <script
      async
      src="https://r.wdfl.co/rw.js"
      data-rewardful="6e34fc"
    ></script>
  </Head>
);

export default StripePricingTable;
