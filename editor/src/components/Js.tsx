import { Editor } from "@monaco-editor/react";
import JsLogo from "../assets/javascript-programming-language-icon.svg";
import { useState } from "react";
import { MdOutlineZoomInMap, MdOutlineZoomOutMap } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

interface JsProps {
  jsCode: string;
  setJsCode: React.Dispatch<React.SetStateAction<string>>;
}

const Js = ({ jsCode, setJsCode }: JsProps) => {
  const [zoom, setZoom] = useState(false);

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
              <img src={JsLogo} alt="JavaScript Logo" className="w-6 h-6" />
              <h3>JavaScript</h3>
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

            <Editor
              height="100%"
              theme="vs-dark"
              language="javascript"
              value={jsCode}
              onChange={(value) => setJsCode(value || "")}
              options={{
                automaticLayout: true,
                quickSuggestions: true,
                wordBasedSuggestions: "currentDocument",
                formatOnType: true,
                formatOnPaste: true,
              }}
              beforeMount={(monaco) => {
                monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                  {
                    noSemanticValidation: false,
                    noSyntaxValidation: false,
                  }
                );
              }}
            />
          </div>
        </div>
      )}

      {!zoom && (
        <div className="bg-zinc-950 sm:h-96 sm:w-96 h-96 w-96 rounded text-white border-2 border-gray-500 flex flex-col transition-all duration-300">
          <div className="flex gap-4 bg-gray-700 p-2 items-center">
            <img src={JsLogo} alt="JavaScript Logo" className="w-6 h-6" />
            <h3>JavaScript</h3>
            <button
              onClick={handleZoomChange}
              className="cursor-pointer hover:bg-gray-600 p-1 rounded ml-auto"
            >
              <MdOutlineZoomInMap size={24} />
            </button>
          </div>

          <Editor
            height="100%"
            theme="vs-dark"
            language="javascript"
            value={jsCode}
            onChange={(value) => setJsCode(value || "")}
            options={{
              automaticLayout: true,
              quickSuggestions: true,
              wordBasedSuggestions: "currentDocument",
              formatOnType: true,
              formatOnPaste: true,
            }}
            beforeMount={(monaco) => {
              monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                {
                  noSemanticValidation: false,
                  noSyntaxValidation: false,
                }
              );
            }}
          />
        </div>
      )}
    </>
  );
};

export default Js;
