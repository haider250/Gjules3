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

    const calculateDilutionBtn = document.getElementById('calculate-dilution');
    const solveForRadios = document.querySelectorAll('input[name="solve-for"]');
    const dilutionInputs = {
        m1: document.getElementById('m1'),
        v1: document.getElementById('v1'),
        m2: document.getElementById('m2'),
        v2: document.getElementById('v2'),
    };

    const updateDilutionInputs = () => {
        const solveFor = document.querySelector('input[name="solve-for"]:checked').value;
        for (const key in dilutionInputs) {
            dilutionInputs[key].disabled = key === solveFor;
            if (key === solveFor) {
                dilutionInputs[key].value = ''; // Clear the value of the disabled input
            }
        }
    };

    solveForRadios.forEach(radio => radio.addEventListener('change', updateDilutionInputs));

    if (calculateDilutionBtn) {
        calculateDilutionBtn.addEventListener('click', () => {
            const solveFor = document.querySelector('input[name="solve-for"]:checked').value;
            const m1 = parseFloat(dilutionInputs.m1.value);
            const v1 = parseFloat(dilutionInputs.v1.value);
            const m2 = parseFloat(dilutionInputs.m2.value);
            const v2 = parseFloat(dilutionInputs.v2.value);

            let result;
            let resultUnit = '';

            try {
                switch (solveFor) {
                    case 'm2':
                        if (isNaN(m1) || isNaN(v1) || isNaN(v2)) throw new Error('Invalid input');
                        if (v2 === 0) throw new Error('Final volume (V₂) cannot be zero.');
                        result = (m1 * v1) / v2;
                        resultUnit = 'M';
                        break;
                    case 'v1':
                        if (isNaN(m1) || isNaN(m2) || isNaN(v2)) throw new Error('Invalid input');
                        if (m1 === 0) throw new Error('Initial concentration (M₁) cannot be zero.');
                        result = (m2 * v2) / m1;
                        break;
                    case 'm1':
                        if (isNaN(v1) || isNaN(m2) || isNaN(v2)) throw new Error('Invalid input');
                        if (v1 === 0) throw new Error('Initial volume (V₁) cannot be zero.');
                        result = (m2 * v2) / v1;
                        resultUnit = 'M';
                        break;
                    case 'v2':
                        if (isNaN(m1) || isNaN(v1) || isNaN(m2)) throw new Error('Invalid input');
                        if (m2 === 0) throw new Error('Final concentration (M₂) cannot be zero.');
                        result = (m1 * v1) / m2;
                        break;
                }
                document.getElementById('dilution-result').textContent = `${result.toFixed(4)} ${resultUnit}`;
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Initial state setup
    updateDilutionInputs();

    const calculateWvBtn = document.getElementById('calculate-wv');
    if (calculateWvBtn) {
        calculateWvBtn.addEventListener('click', () => {
            const soluteMass = parseFloat(document.getElementById('solute-mass-wv').value);
            const solutionVolume = parseFloat(document.getElementById('solution-volume-wv').value);

            if (isNaN(soluteMass) || isNaN(solutionVolume)) {
                alert('Please enter valid numbers for mass and volume.');
                return;
            }

            if (solutionVolume <= 0) {
                alert('Solution volume must be a positive value.');
                return;
            }

            const wvPercent = (soluteMass / solutionVolume) * 100;
            document.getElementById('wv-result').textContent = `${wvPercent.toFixed(2)}%`;
        });
    }

    const calculateVvBtn = document.getElementById('calculate-vv');
    if (calculateVvBtn) {
        calculateVvBtn.addEventListener('click', () => {
            const soluteVolume = parseFloat(document.getElementById('solute-volume-vv').value);
            const solutionVolume = parseFloat(document.getElementById('solution-volume-vv').value);

            if (isNaN(soluteVolume) || isNaN(solutionVolume)) {
                alert('Please enter valid numbers for both volumes.');
                return;
            }

            if (solutionVolume <= 0) {
                alert('Total solution volume must be a positive value.');
                return;
            }

            const vvPercent = (soluteVolume / solutionVolume) * 100;
            document.getElementById('vv-result').textContent = `${vvPercent.toFixed(2)}%`;
        });
    }

    const chemicalSelect = document.getElementById('chemical-select');
    const safetyWarningDiv = document.getElementById('safety-warning');

    const safetyWarnings = {
        'HCl': '<strong>Safety Warning:</strong> Always add acid to water slowly. Wear appropriate personal protective equipment (PPE), including gloves and safety glasses.',
        'NaOH': '<strong>Safety Warning:</strong> Sodium hydroxide is hygroscopic and can absorb moisture from the air, affecting its mass. It is also highly corrosive. Handle with care and wear PPE.',
        'H2O2': '<strong>Safety Warning:</strong> Hydrogen peroxide can decompose when exposed to light or heat. Store in a dark, cool place. Avoid contact with skin and eyes.'
    };

    if (chemicalSelect) {
        chemicalSelect.addEventListener('change', () => {
            const selectedChemical = chemicalSelect.value;
            if (safetyWarnings[selectedChemical]) {
                safetyWarningDiv.innerHTML = safetyWarnings[selectedChemical];
                safetyWarningDiv.style.display = 'block';
            } else {
                safetyWarningDiv.style.display = 'none';
            }
        });
    }
});