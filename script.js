document.addEventListener('DOMContentLoaded', () => {
    const calculateMolarityBtn = document.getElementById('calculate-molarity');

    if (calculateMolarityBtn) {
        calculateMolarityBtn.addEventListener('click', () => {
            const soluteMass = parseFloat(document.getElementById('solute-mass').value);
            const molecularWeight = parseFloat(document.getElementById('molecular-weight').value);
            let solutionVolume = parseFloat(document.getElementById('solution-volume').value);
            const volumeUnit = document.getElementById('volume-unit').value;

            if (isNaN(soluteMass) || isNaN(molecularWeight) || isNaN(solutionVolume)) {
                alert('Please enter valid numbers in all fields.');
                return;
            }

            // Convert volume to Liters if necessary
            if (volumeUnit === 'mL') {
                solutionVolume /= 1000;
            }

            if (solutionVolume <= 0 || molecularWeight <= 0) {
                alert('Volume and molecular weight must be positive values.');
                return;
            }

            const molarity = soluteMass / (molecularWeight * solutionVolume);

            document.getElementById('molarity-result').textContent = `${molarity.toFixed(4)} M`;
        });
    }
});