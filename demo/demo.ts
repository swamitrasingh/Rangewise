import { formatDateTime, formatDateTimeRange } from './formatters.js';

declare const flatpickr: any;

document.addEventListener("DOMContentLoaded", () => {

    /**
     * Helper function to setup Flatpickr with custom Apply/Cancel buttons.
     */
    function setupFlatpickrWithButtons(
        selector: string,
        options: any,
        onApply: (selectedDates: Date[]) => void
    ) {
        let committedDates: Date[] = [];

        return flatpickr(selector, {
            ...options,
            onReady: function (selectedDates: Date[], dateStr: string, instance: any) {
                // Create custom button container
                const btnContainer = document.createElement("div");
                btnContainer.className = "flex justify-end space-x-2 p-3 border-t border-gray-200 bg-gray-50 mt-2";

                // Cancel Button
                const cancelBtn = document.createElement("button");
                cancelBtn.type = "button";
                cancelBtn.textContent = "Cancel";
                cancelBtn.className = "px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded transition-colors";
                cancelBtn.onclick = (e) => {
                    e.stopPropagation();
                    // Revert to previously committed dates
                    instance.setDate(committedDates);
                    instance.close();
                };

                // Apply Button
                const applyBtn = document.createElement("button");
                applyBtn.type = "button";
                applyBtn.textContent = "Apply";
                applyBtn.className = "px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors";
                applyBtn.onclick = (e) => {
                    e.stopPropagation();
                    // Commit current selection
                    committedDates = [...instance.selectedDates];
                    onApply(committedDates);
                    instance.close();
                };

                btnContainer.appendChild(cancelBtn);
                btnContainer.appendChild(applyBtn);
                instance.calendarContainer.appendChild(btnContainer);
            }
        });
    }

    // --- Calendar 1: Single Date/Time ---
    const outputLabel1 = document.getElementById("outputLabel");

    setupFlatpickrWithButtons("#calendar1", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    }, (selectedDates) => {
        if (outputLabel1) {
            outputLabel1.textContent = formatDateTime(selectedDates[0] || null);
            outputLabel1.classList.add('text-blue-500');
            setTimeout(() => outputLabel1.classList.remove('text-blue-500'), 300);
        }
    });


    // --- Calendar 2: Start & End Range ---
    const outputLabel2 = document.getElementById("outputLabel2");

    let rangeStart: Date;
    let rangeEnd: Date;

    const updateRangeLabel = () => {
        if (outputLabel2) {
            outputLabel2.textContent = formatDateTimeRange(rangeStart, rangeEnd);
            outputLabel2.classList.add('text-purple-500');
            setTimeout(() => outputLabel2.classList.remove('text-purple-500'), 300);
        }
    };

    let fpStart: any;
    let fpEnd: any;

    fpStart = setupFlatpickrWithButtons("#calendar2_start", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    }, (selectedDates) => {
        rangeStart = selectedDates[0] || null;
        updateRangeLabel();

        // Ensure End Date cannot be before Start Date
        if (rangeStart && fpEnd) {
            fpEnd.set("minDate", rangeStart);
        }
    });

    fpEnd = setupFlatpickrWithButtons("#calendar2_end", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    }, (selectedDates) => {
        rangeEnd = selectedDates[0] || null;
        updateRangeLabel();
    });
});
