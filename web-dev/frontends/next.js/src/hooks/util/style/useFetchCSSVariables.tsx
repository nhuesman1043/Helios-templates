// React
import { useState, useEffect } from "react"

// Hook to fetch CSS variables
const useFetchCSSVariables = () => {
    // State to store CSS variables
    const [cssVariables, setCSSVariables] = useState<{ [key: string]: string }>({})

    // Fetch CSS variables on mount
    useEffect(() => {
        // Function to get CSS variable value
        const getCSSVariable = (variableName: string) => {
            return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim()
        }

        // List of CSS variables to fetch
        const variablesToFetch = [
            "--background-primary", 
            "--border-primary", 
            "--text-primary"
        ]

        // Fetch the CSS variables and set them in state
        const fetchedVariables: { [key: string]: string } = {}
        variablesToFetch.forEach(variable => {
            const value = getCSSVariable(variable)
            if (value) {
                fetchedVariables[variable] = value
            } else {
                console.error(`CSS variable ${variable} not found`)
            }
        })

        setCSSVariables(fetchedVariables)
    }, [])

    return cssVariables
}

export default useFetchCSSVariables