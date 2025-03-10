import fs from "fs/promises"
import path from "path"
import { checkCSVFormat, checkFileExists } from "../utils/validation.util"
import axios from "axios"

const STORAGE_DIR = "/nirbhay_PV_dir"
const SUM_SERVICE_URL = process.env.SUM_SERVICE_URL || "http://gke-product-calculator:3000"

// Handler for /store-file
export const handleFileStorage = async (req: any, res: any) => {
  try {
    const { file, data } = req.body

    // Validate input
    if (!file) {
      return res.status(400).json({
        file: null,
        error: "Invalid JSON input.",
      })
    }

    const filePath = path.join(STORAGE_DIR, file)

    // Write the file to persistent volume
    try {
      await fs.writeFile(filePath, data, "utf8")
      return res.status(200).json({
        file,
        message: "Success.",
      })
    } catch (error) {
      console.error("Error storing file in gke-file-gateway:", error)
      return res.status(500).json({
        file,
        error: "Error while storing the file to the storage.",
      })
    }
  } catch (error) {
    console.error("Internal server error in gke-file-gateway:", error)
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message || error,
    })
  }
}

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

    const filePath = path.join(STORAGE_DIR, file)

    const fileExists = await checkFileExists(filePath)
    if (!fileExists) {
      return res.status(404).json({
        file,
        error: "File not found."
      })
    }

    const isCSVValid = await checkCSVFormat(filePath)
    if (!isCSVValid) {
      return res.status(400).json({
        file,
        error: "Input file not in CSV format."
      })
    }

    try {
      const sumResponse = await axios.post(`${SUM_SERVICE_URL}/calculate-sum`, {
        file,
        product
      })

      return res.status(200).json({
        file,
        sum: sumResponse.data.sum
      })
    } catch (axiosError: any) {
      console.error("Error calling gke-product-calculator:", axiosError)
      return res.status(500).json({
        error: "Error while calling the sum service.",
        details: axiosError.message || axiosError
      })
    }
  } catch (error: any) {
    console.error("Internal server error in gke-file-gateway:", error)
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message || error
    })
  }
}
