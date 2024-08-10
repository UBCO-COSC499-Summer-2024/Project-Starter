import { useEffect, useRef } from "react";
import PSPDFKit from "pspdfkit";

const PDFViewer = ({ documentUrl, onBack, theme }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const loadPdf = async () => {
      try {
        if (!documentUrl) {
          console.error("No documentUrl provided");
          return;
        }
        console.log("Loading PDF from:", documentUrl);

        await PSPDFKit.load({
          container,
          document: documentUrl,
          baseUrl: `${window.location.origin}/pspdfkit-lib/`, // Ensure this is correct
          licenseKey: 'bVokaUl6HlFBZDXwKap8roEs0ElgE6AdHEYW0d6l8YHUezahrqrIs72q9KGkW5EaFO5AldQmOHn7z8293OF3DlRrUkGXc12i9QxBrH8R7xJ50RHkCoiLpFnyd276pnd3pLRRdWlZ8khIvDc10gdlDdsNdBWre7ijHbt6CcwTKjIYAGl5waU4KY2axvadDHAo3qPE5099JC9BLw', // Add your license key here
          disableWebAssemblyStreaming: true,
        });
        console.log("PDF loaded successfully from:", documentUrl);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();

    return () => {
      if (PSPDFKit) {
        PSPDFKit.unload(container);
      }
    };
  }, [documentUrl]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h2 className="text-2xl font-bold mb-4">Answer Key PDF</h2>
      <button
        onClick={onBack}
        className={`w-full px-4 py-2 rounded transition duration-200 mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-gray-300 text-black hover:bg-blue-400'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7M21 12H3" />
        </svg>
        Back
      </button>
      <div ref={containerRef} style={{ width: "100%", height: "calc(100vh - 96px)" }} />
    </div>
  );
};

export default PDFViewer;
