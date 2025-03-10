import express, { Router } from "express"
import { handleCalculation, handleFileStorage } from "../controllers/calculate.controller"

const calculateRouter: Router = express.Router()

calculateRouter.post("/store-file", handleFileStorage)
calculateRouter.post("/calculate", handleCalculation)

export default calculateRouter