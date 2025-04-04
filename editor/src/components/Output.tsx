import { useState } from "react";
import { MdOutlineZoomInMap, MdOutlineZoomOutMap } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

interface OutputProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

const Output = ({ htmlCode, cssCode, jsCode }: OutputProps) => {
  const [srcDoc, setSrcDoc] = useState("");
  const [zoom, setZoom] = useState(false);

  const handleClick = () => {
    setSrcDoc(`
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `);
  };

  const handleZoomChange = () => {
    setZoom(!zoom);
  };

  const handleCloseZoom = () => {
    setZoom(false);
  };

  return (
    <>
      {zoom && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-md z-10 flex justify-center items-center"
          onClick={handleCloseZoom}
        >
          <div
            className="bg-zinc-950 w-[80vw] h-[80vh] rounded-lg text-white border-2 border-gray-500 flex flex-col transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 bg-gray-700 p-2 items-center">
              <h3 className="text-lg font-semibold">Output</h3>
              <div className="flex ml-auto gap-2">
                <button
                  onClick={handleZoomChange}
                  className="cursor-pointer hover:bg-gray-600 p-1 rounded"
                >
                  <MdOutlineZoomOutMap size={24} />
                </button>
                <button
                  onClick={handleCloseZoom}
                  className="cursor-pointer hover:bg-gray-600 p-1 rounded"
                >
                  <RxCross2 size={24} />
                </button>
              </div>
            </div>

            <iframe
              className="w-full h-full bg-white overflow-auto"
              srcDoc={srcDoc}
              title="Output"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      )}

      {!zoom && (
        <div className="flex flex-col justify-center items-center gap-6 mb-12">
          <div>
            <button
              onClick={handleClick}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-2 rounded mb-2 cursor-pointer"
            >
              Show Output
            </button>
          </div>

          <div className="bg-zinc-950 sm:h-[30rem] sm:w-[35rem] rounded-xl text-white py-2 px-2 border-2 border-gray-500 h-96 w-96 overflow-auto relative transition-all duration-300">
            <button
              onClick={handleZoomChange}
              className="absolute top-2 right-2 text-black hover:bg-gray-300 p-1 rounded cursor-pointer"
            >
              <MdOutlineZoomInMap size={24} />
            </button>

            <iframe
              className="w-full h-full bg-white overflow-auto"
              srcDoc={srcDoc}
              title="Output"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Output;
