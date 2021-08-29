export const toBase64 = (file: File) => {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (file) => {
      if (file.target) resolve(file.target.result);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
