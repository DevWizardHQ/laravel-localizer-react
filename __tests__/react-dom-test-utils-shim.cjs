// Shim for react-dom/test-utils removed in React 19.
// @testing-library/react imports this unconditionally but only uses `act`
// as a fallback when React.act is unavailable — React 19 ships act on React directly.
const { act } = require('react');
module.exports = { act };
