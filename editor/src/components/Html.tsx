import { Editor, loader } from "@monaco-editor/react";
import htmlLogo from "../assets/html-icon.svg";
import { useEffect, useState } from "react";
import { MdOutlineZoomInMap, MdOutlineZoomOutMap } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

interface HtmlProps {
  htmlCode: string;
  setHtmlCode: React.Dispatch<React.SetStateAction<string>>;
}

const Html = ({ htmlCode, setHtmlCode }: HtmlProps) => {
  const [zoom, setZoom] = useState(false);

  const handleZoomChange = () => {
    setZoom(!zoom);
  };

  const handleCloseZoom = () => {
    setZoom(false);
  };

  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.languages.html.htmlDefaults.setOptions({
        format: {
          tabSize: 2,
          insertSpaces: true,
          wrapLineLength: 120,
          preserveNewLines: true,
          indentInnerHtml: false,
          unformatted: "wbr",
          contentUnformatted: "pre,code,textarea",
          maxPreserveNewLines: undefined,
          indentHandlebars: false,
          extraLiners: "",
          wrapAttributes: "auto",
          endWithNewline: false, // ✅ add this line
        },
        suggest: { html5: true },
      });
    });
  }, []);

  return (
    <>
      {/* Background Blur Effect */}
      {zoom && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-md z-10 flex justify-center items-center"
          onClick={handleCloseZoom}
        >
          <div
            className="bg-zinc-950 w-[80vw] h-[80vh] rounded-lg text-white border-2 border-gray-500 flex flex-col transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to parent
          >
            <div className="flex gap-4 bg-gray-700 p-2 items-center">
              <img src={htmlLogo} alt="HTML Logo" className="w-6 h-6" />
              <h3>HTML</h3>
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
              language="html"
              value={htmlCode}
              onChange={(value) => setHtmlCode(value || "")}
              options={{
                automaticLayout: true,
                quickSuggestions: true,
                wordBasedSuggestions: "currentDocument",
                formatOnType: true,
                formatOnPaste: true,
              }}
            />
          </div>
        </div>
      )}

      {/* Normal (Non-Zoomed) Editor */}
      {!zoom && (
        <div className="bg-zinc-950 sm:h-96 sm:w-96 h-96 w-96 rounded text-white border-2 border-gray-500 flex flex-col transition-all duration-300 ease-in-out">
          <div className="flex gap-4 bg-gray-700 p-2 items-center">
            <img src={htmlLogo} alt="HTML Logo" className="w-6 h-6" />
            <h3>HTML</h3>
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
            language="html"
            value={htmlCode}
            onChange={(value) => setHtmlCode(value || "")}
            options={{
              automaticLayout: true,
              quickSuggestions: true,
              wordBasedSuggestions: "currentDocument",
              formatOnType: true,
              formatOnPaste: true,
            }}
          />
        </div>
      )}
    </>
  );
};

export default Html;
