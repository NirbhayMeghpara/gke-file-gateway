import { checkCSVFormat, checkFileExists } from "../utils/validation.util"
import axios from "axios"

export const handleCalculation = async (req: any, res: any) => {
  try {
    const { file, product } = req.body

    // Validate if the input json or not
    if (!file) {
      return res.status(400).json({
        file: null,
        error: "Invalid JSON input.",
      })
    }

    // Check if the file exists on the mounted disk
    const fileExists = await checkFileExists(file)
    if (!fileExists) {
      return res.status(404).json({
        file,
        error: "File not found.",
      })
    }

    // Checking if the file is in proper CSV format
    const isCSVValid = await checkCSVFormat(file)
    if (!isCSVValid) {
      return res.status(400).json({
        file,
        error: "Input file not in CSV format.",
      })
    }

    const SUM_SERVICE_URL = process.env.SUM_SERVICE_URL || 'http://sum-server:3000';

    // Call the second server to get the sum
    try {
      const sumResponse = await  axios.post(`${SUM_SERVICE_URL}/calculate-sum`, {
        file,
        product,
      })

      // Assuming the sum is in sumResponse.data.sum
      return res.status(200).json({
        file,
        sum: sumResponse.data.sum,
      })
    } catch (axiosError: any) {
      console.error("Error calling sum-server:", axiosError)
      return res.status(500).json({
        error: "Error while calling the sum server.",
        details: axiosError.message || axiosError,
      })
    }
  } catch (error: any) {
    console.error("Internal server error:", error)
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message || error,
    })
  }
}
