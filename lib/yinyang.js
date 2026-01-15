// --- Yin Yang Base ---

const YinYangCalculator = (function() {
    function getSolarTerm(year, termIndex) {
        const baseDate = new Date(Date.UTC(1900, 0, 0, 6, 2, 5)); // 1900-01-01T06:02:05Z
        const baseJD = baseDate.getTime();
        const period = 365.2422 * 24 * 60 * 60 * 1000;
        const offset = [
            0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 
            263431, 286282, 309283, 332410, 355654, 378997, 402454, 426006, 449659, 473384, 497193, 521081
        ];
        const yearOffset = (year - 1900) * period;
        const termTime = baseJD + yearOffset + offset[termIndex] * 60 * 1000;
        return new Date(termTime);
    }

    return {
        calculateYinYang: function(date) {
            const year = date.getFullYear();
            const prevWinter = getSolarTerm(year - 1, 0);   // 上一年冬至
            const summer = getSolarTerm(year, 12);         // 今年夏至
            const currWinter = getSolarTerm(year, 0);      // 今年冬至

            if (date >= prevWinter && date < summer) {
                return "阳遁";
            } else if (date >= summer && date < currWinter) {
                return "阴遁";
            } else {
                return "阳遁"; // date >= currWinter
            }
        }
    };
})();
