/*
	Installed from https://reactbits.dev/tailwind/
*/

const ShinyText = ({ text, disabled = false, speed = 5, className = '', color = 'lightblue' }) => {
  const animationDuration = `${speed}s`;

  // Define stronger colors based on input
  const getStrongColor = (baseColor) => {
    const colorMap = {
      'lightblue': '#0ea5e9', // bright blue
      '#e5e7eb': '#3b82f6', // bright blue for subtitle
      'white': '#ffffff',
      '#ffffff': '#ffffff'
    };
    return colorMap[baseColor] || baseColor;
  };

  const strongColor = getStrongColor(color);

  return (
    <div
      className={`inline-block ${disabled ? '' : 'shiny-animation'} ${className}`}
      style={{
        background: `linear-gradient(90deg, ${strongColor} 0%, rgba(255,255,255,1) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,1) 70%, ${strongColor} 100%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textFillColor: 'transparent',
        animation: disabled ? 'none' : `shiny-move ${animationDuration} linear infinite`,
        filter: 'brightness(1.2) contrast(1.3)',
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         shine: {
//           '0%': { 'background-position': '100%' },
//           '100%': { 'background-position': '-100%' },
//         },
//       },
//       animation: {
//         shine: 'shine 5s linear infinite',
//       },
//     },
//   },
//   plugins: [],
// };