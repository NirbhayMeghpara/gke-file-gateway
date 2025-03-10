import fs, { promises as fsPromises } from "fs";
import Papa from "papaparse";

export const checkFileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fsPromises.access(filePath);
    return true;
  } catch (err) {
    return false;
  }
};

export const checkCSVFormat = (filePath: string): Promise<boolean> => {
  return new Promise((resolve) => {
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
          console.log("Invalid headers:", headers)
          resolve(false)
          return
        }

        // Check each row has both product and amount and amount is a number
        const invalidRow = results.data.some((row: any) => {
          return !row.product || !row.amount || isNaN(Number(row.amount))
        })

        console.log("Invalid row:", invalidRow)

        resolve(!invalidRow)
      },
      error: () => {
        resolve(false)
      },
    })
  })
}


