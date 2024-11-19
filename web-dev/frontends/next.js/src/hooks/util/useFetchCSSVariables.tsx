// ========================================
// IMPORTS
// ========================================

// ========================
// React
// ========================
import { 
    useState, 
    useEffect,
} from "react"

// ========================================
// FETCH CSS VARIABLES
// ========================================

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
            // Get the value of the CSS variable
            const value = getCSSVariable(variable)

            // If the variable is found, set it in state
            if (value) 
                fetchedVariables[variable] = value
            
            // If the variable is not found, log an error
            else 
                console.error(`CSS variable ${variable} not found`)
        })

        // Set the CSS variables in state
        setCSSVariables(fetchedVariables)
    }, [])

    // Return the CSS variables
    return cssVariables
}

// ========================================
// EXPORT
// ========================================
export default useFetchCSSVariables