import { createFormatter } from "../src/index";

/**
 * 1. Define the Application's Formats
 * 
 * This represents a centralized configuration file where developers 
 * can maintain all date and range formats used across the application.
 */
export const formatRegistry = {
    demo: {
        singleDate: {
            type: "date" as const,
            // Example options for single date
            options: {
                hour12: true,
                compactAmPm: true,
                hideMinutes: true
            }
        },
        dateRange: {
            type: "range" as const,
            locale: "en-US", // (Optional) specify locale here or rely on library default
            
            // 👇 Showcasing all available formatting options for developers
            options: { 
                spaced: true,        // True: "10:00 – 12:00", False: "10:00–12:00"
                hour12: true,        // Force 12-hour AM/PM format
                compactAmPm: true,   // Use "am"/"pm" instead of " AM"/" PM"
                hideMinutes: false,  // Hide minutes if they are ":00" (e.g. 10am instead of 10:00am)
                // now: new Date()   // (Optional) override the "current time" reference for testing relative dates like "Today"
            }
        }
    }
} as const;

/**
 * 2. Create and Export the format() function
 * 
 * This creates a type-safe format function bound to the registry.
 * The rest of the application imports this `format` function.
 */
export const format = createFormatter(formatRegistry);
