// const withGoogleFonts = require('next-google-fonts');
module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["cdn3d.iconscout.com"],
  },
};
// module.exports = withGoogleFonts({
//   googleFonts: {
//     fonts: [
//       {
//         family: 'Plus Jakarta Sans',
//         weights: ['300', '400', '500', '600', '700', '800'],
//       },
//     ],
//     display: 'swap',
//   },
// });
const withGoogleFonts = require("next-google-fonts");

// module.exports = withGoogleFonts({
//   googleFonts: {
//     fonts: [
//       {
//         family: 'Plus Jakarta Sans',
//         weights: ['300', '400', '500', '600', '700', '800'],
//       },
//     ],
//     display: 'swap',
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// });
