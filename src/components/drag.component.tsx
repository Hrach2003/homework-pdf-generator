import classNames from "classnames";
import jsPDF from "jspdf";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toBase64 } from "../helpers/toBase64";
import { FileListDND } from "./filelist.component";

export const ImageDropzone = () => {
  const doc = useRef(new jsPDF());
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const centeredText = useCallback((text: string, y: number) => {
    const textWidth =
      (doc.current.getStringUnitWidth(text) * doc.current.getFontSize()) /
      doc.current.internal.scaleFactor;
    const textOffset = (doc.current.internal.pageSize.width - textWidth) / 2;
    doc.current.text(text, textOffset, y);
  }, []);

  const generatePDF = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(async (file) => {
      const result = await toBase64(file);
      if (typeof result !== "string") return;

      const fileType = file.name.split(".").pop()!;

      const pdfWidth = doc.current.internal.pageSize.getWidth();
      const pdfHeight = doc.current.internal.pageSize.getHeight();
      const pageInfo = doc.current.getCurrentPageInfo();

      const imgProps = doc.current.getImageProperties(result);

      const imgAreaWidth = pdfWidth;
      const imgAreaHeight = pdfHeight - 24;

      const widthRatio = imgAreaWidth / imgProps.width;
      const heightRatio = imgAreaHeight / imgProps.height;
      const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

      const imgWidth = imgProps.width * ratio;
      const imgHeight = imgProps.height * ratio;

      const marginX = (imgAreaWidth - imgWidth) / 2;
      const marginY = (imgAreaHeight - imgHeight) / 2 + 12;

      doc.current.addImage(
        result,
        fileType,
        marginX,
        marginY,
        imgWidth,
        imgHeight
      );

      doc.current.setFontSize(15);
      centeredText(`- ${file.name} -`, 8);

      doc.current.setFontSize(10);
      centeredText(`- ${pageInfo.pageNumber} -`, pdfHeight - 2);

      doc.current.addPage();
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    await new Promise((resolve, reject) => {
      try {
        generatePDF(files);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
    doc.current.save(`${fileName}.pdf`);
    setLoading(false);
  };

  const onDrop = useCallback(
    async <T extends File>(acceptedFiles: T[]) => {
      setFiles((f) => [...f, ...acceptedFiles]);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div
        {...getRootProps()}
        className={classNames(
          "md:w-3/5 mx-2 md:h-80 h-40 md:mt-20 mt-2 md:mx-auto px-3 flex items-center justify-center rounded-xl bg-gray-50 ring-4 ring-inset ring-gray-200 border-dashed border-2 border-gray-700 shadow-2xl",
          {
            " bg-indigo-400 text-gray-50": isDragActive,
          }
        )}
      >
        <input {...getInputProps({ accept: "image/*" })} />
        {isDragActive ? (
          <span className=" text-9xl">+</span>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <div className="text-center mt-4">
        <input
          className="px-4 py-3 rounded-lg shadow-lg outline-none"
          type="text"
          onChange={(e) => setFileName(e.target.value)}
          value={fileName}
          placeholder="Your file name"
        ></input>
      </div>

      <FileListDND setFiles={setFiles} files={files} />
      <div className="text-center mt-4">
        <button
          disabled={loading}
          className={classNames(
            "px-4 py-2 bg-indigo-600 focus:ring-4 ring-indigo-300 text-gray-50 rounded-lg",
            {
              "bg-opacity-40": loading,
            }
          )}
          onClick={() => handleSave()}
        >
          Save
        </button>
      </div>
    </>
  );
};
