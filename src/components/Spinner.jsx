const Spinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-10 h-10 border-4 border-platinum/30 border-t-platinum rounded-full animate-spin mb-4"></div>
    <p className="text-pearl/60 text-sm">{text}</p>
  </div>
);
export default Spinner;
