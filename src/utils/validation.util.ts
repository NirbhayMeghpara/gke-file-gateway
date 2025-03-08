import fs, { promises as fsPromises } from "fs";
import Papa from "papaparse";

const MOUNTED_DISK_PATH = "/mnt/disk";

export const checkFileExists = async (fileName: string): Promise<boolean> => {
  try {
    const filePath = `${MOUNTED_DISK_PATH}/${fileName}`;
    await fsPromises.access(filePath);
    return true;
  } catch (err) {
    return false;
  }
};

export const checkCSVFormat = (fileName: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const filePath = `${MOUNTED_DISK_PATH}/${fileName}`
    const fileStream = fs.createReadStream(filePath, "utf8")

    Papa.parse(fileStream, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Check if we have any data at all
        if (results.data.length === 0) {
          resolve(false)
          return
        }

        // Check headers
        const headers = Object.keys(results.data[0] || {})
        if (headers.length !== 2 || !headers.includes("product") || !headers.includes("amount")) {
          resolve(false)
          return
        }

        // Check each row has both product and amount and amount is a number
        const invalidRow = results.data.some((row: any) => {
          return !row.product || !row.amount || isNaN(Number(row.amount))
        })

        resolve(!invalidRow)
      },
      error: () => {
        resolve(false)
      },
    })
  })
}


