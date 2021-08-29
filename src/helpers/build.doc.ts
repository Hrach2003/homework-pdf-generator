import { jsPDF } from "jspdf";

export const buildDoc = (file: File) => {
  const doc = new jsPDF();

  doc.text("asdfasdfasd", 20, 20);

  const blobPdf = doc.output("blob");
  // const blobPdf = file;

  const urlCreator = window.URL || window.webkitURL;
  const result = urlCreator.createObjectURL(blobPdf);
  console.log("result: ", result);
  return result;
};
