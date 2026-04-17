import { format } from './formatConfig.js';

declare const flatpickr: any;

document.addEventListener("DOMContentLoaded", () => {
    // --- Calendar 1: Single Date/Time ---
    const outputLabel1 = document.getElementById("outputLabel");

    flatpickr("#calendar1", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        onChange: (selectedDates: Date[]) => {
            if (outputLabel1) {
                // 👇 Using the centralized format function
                const date = selectedDates[0];
                outputLabel1.textContent = date ? format("demo.singleDate", { date }) : "None";
                
                // Flash effect to show it updated
                outputLabel1.classList.add('text-blue-500');
                setTimeout(() => outputLabel1.classList.remove('text-blue-500'), 300);
            }
        }
    });

    // --- Calendar 2: Start & End Range ---
    const outputLabel2 = document.getElementById("outputLabel2");

    let rangeStart: Date | undefined;
    let rangeEnd: Date | undefined;

    const updateRangeLabel = () => {
        if (outputLabel2) {
            // 👇 Using the centralized format function based on the state
            if (rangeStart && rangeEnd) {
                outputLabel2.textContent = format("demo.dateRange", { start: rangeStart, end: rangeEnd });
            } else if (rangeStart) {
                outputLabel2.textContent = `${format("demo.singleDate", { date: rangeStart })} — (Select End Date)`;
            } else if (rangeEnd) {
                outputLabel2.textContent = `(Select Start Date) — ${format("demo.singleDate", { date: rangeEnd })}`;
            } else {
                outputLabel2.textContent = "None";
            }
            
            // Flash effect to show it updated
            outputLabel2.classList.add('text-purple-500');
            setTimeout(() => outputLabel2.classList.remove('text-purple-500'), 300);
        }
    };

    const fpEnd = flatpickr("#calendar2_end", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        onChange: (selectedDates: Date[]) => {
            rangeEnd = selectedDates[0] || undefined;
            updateRangeLabel();
        }
    });

    flatpickr("#calendar2_start", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        onChange: (selectedDates: Date[]) => {
            rangeStart = selectedDates[0] || undefined;
            updateRangeLabel();

            // Ensure End Date cannot be before Start Date
            if (rangeStart && fpEnd) {
                fpEnd.set("minDate", rangeStart);
            }
        }
    });
});
