import express, { Router } from "express"
import { handleCalculation } from "../controllers/calculate.controller"

const calculateRouter: Router = express.Router()

calculateRouter.post("/calculate", handleCalculation)

export default calculateRouter