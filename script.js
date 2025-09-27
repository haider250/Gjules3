document.addEventListener('DOMContentLoaded', () => {
    const calculateMolarityBtn = document.getElementById('calculate-molarity');

    if (calculateMolarityBtn) {
        const unitConversionModal = document.getElementById('unit-conversion-modal');
        const closeBtn = unitConversionModal.querySelector('.close-button');

        calculateMolarityBtn.addEventListener('click', () => {
            const soluteMass = parseFloat(document.getElementById('solute-mass').value);
            const molecularWeight = parseFloat(document.getElementById('molecular-weight').value);
            let solutionVolume = parseFloat(document.getElementById('solution-volume').value);
            const volumeUnit = document.getElementById('volume-unit').value;

            if (isNaN(soluteMass) || isNaN(molecularWeight) || isNaN(solutionVolume)) {
                alert('Please enter valid numbers in all fields.');
                return;
            }

            // Convert volume to Liters if necessary and show modal
            if (volumeUnit === 'mL' && solutionVolume > 0) {
                unitConversionModal.style.display = 'flex';
                solutionVolume /= 1000;
            }

            if (solutionVolume <= 0 || molecularWeight <= 0) {
                alert('Volume and molecular weight must be positive values.');
                return;
            }

            const molarity = soluteMass / (molecularWeight * solutionVolume);

            document.getElementById('molarity-result').textContent = `${molarity.toFixed(4)} M`;
        });

        closeBtn.onclick = function() {
            unitConversionModal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == unitConversionModal) {
                unitConversionModal.style.display = "none";
            }
        }
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

    const chemicalDatabase = {
        'HCl': {
            molecularWeight: 36.46,
            density: '1.18 g/mL (37% aq.)',
            boilingPoint: '110 °C (20% aq.)',
            meltingPoint: '-25 °C (37% aq.)',
            safetyWarning: '<strong>Safety Warning:</strong> Always add acid to water slowly. Wear appropriate personal protective equipment (PPE), including gloves and safety glasses.',
            properties: {
                Volatility: 'Concentrated HCl is volatile. Handle in a well-ventilated area or fume hood to avoid inhaling fumes.'
            }
        },
        'NaOH': {
            molecularWeight: 40.00,
            density: '2.13 g/cm³',
            boilingPoint: '1388 °C',
            meltingPoint: '318 °C',
            safetyWarning: '<strong>Safety Warning:</strong> Highly corrosive. Causes severe skin burns and eye damage. Wear appropriate PPE.',
            properties: {
                Hygroscopicity: 'Rapidly absorbs moisture and carbon dioxide from the air. Weigh quickly and store in a tightly sealed container. For accurate concentrations, standardization against a primary standard like KHP is recommended.',
                Instability: 'Reacts with CO₂ in the air to form sodium carbonate (Na₂CO₃), which can affect the accuracy of solutions.'
            }
        },
        'H2O2': {
            molecularWeight: 34.01,
            density: '1.45 g/cm³ (pure)',
            boilingPoint: '150.2 °C',
            meltingPoint: '-0.43 °C',
            safetyWarning: '<strong>Safety Warning:</strong> Strong oxidizer. Avoid contact with skin and eyes. Can cause burns.',
            properties: {
                Instability: 'Decomposes when exposed to light, heat, or certain metals. Store in a dark, cool, vented container.'
            }
        },
        'CaCl2': {
            molecularWeight: 110.98,
            density: '2.15 g/cm³',
            boilingPoint: '1935 °C',
            meltingPoint: '772 °C',
            safetyWarning: '<strong>Safety Warning:</strong> Causes serious eye irritation. Avoid breathing dust.',
            properties: {
                Hygroscopicity: 'Extremely hygroscopic. Anhydrous form is a common desiccant. Keep container tightly closed and handle quickly.'
            }
        },
        'KMnO4': {
            molecularWeight: 158.03,
            density: '2.7 g/cm³',
            boilingPoint: 'N/A',
            meltingPoint: '240 °C (decomposes)',
            safetyWarning: '<strong>Safety Warning:</strong> Strong oxidizer. Contact with other material may cause fire. Harmful if swallowed.',
            properties: {
                Instability: 'Decomposes in the presence of light and organic material. Solutions should be stored in dark amber bottles and are not stable long-term. Often requires standardization before use.'
            }
        },
        'AceticAcid': {
            molecularWeight: 60.05,
            density: '1.049 g/cm³',
            boilingPoint: '118.1 °C',
            meltingPoint: '16.6 °C',
            safetyWarning: '<strong>Safety Warning:</strong> Flammable liquid and vapor. Causes severe skin burns and eye damage.',
            properties: {
                Volatility: 'Glacial acetic acid is highly volatile and has a pungent odor. Use in a fume hood.'
            }
        }
    };

    const chemicalSelect = document.getElementById('chemical-select');
    const molecularWeightInput = document.getElementById('molecular-weight');
    const safetyWarningDiv = document.getElementById('safety-warning');
    const chemicalPropertiesDiv = document.getElementById('chemical-properties');

    if (chemicalSelect) {
        chemicalSelect.addEventListener('change', () => {
            const selectedChemicalKey = chemicalSelect.value;
            const chemicalData = chemicalDatabase[selectedChemicalKey];

            if (chemicalData) {
                // Auto-fill molecular weight
                molecularWeightInput.value = chemicalData.molecularWeight;

                // Display safety warning
                safetyWarningDiv.innerHTML = chemicalData.safetyWarning;
                safetyWarningDiv.style.display = 'block';

                // Display chemical properties
                let propertiesHtml = '<h3>Physical & Handling Properties</h3>';
                if (chemicalData.density) propertiesHtml += `<h4>Density</h4><p>${chemicalData.density}</p>`;
                if (chemicalData.meltingPoint) propertiesHtml += `<h4>Melting Point</h4><p>${chemicalData.meltingPoint}</p>`;
                if (chemicalData.boilingPoint) propertiesHtml += `<h4>Boiling Point</h4><p>${chemicalData.boilingPoint}</p>`;

                for (const property in chemicalData.properties) {
                    propertiesHtml += `<h4>${property}</h4><p>${chemicalData.properties[property]}</p>`;
                }
                chemicalPropertiesDiv.innerHTML = propertiesHtml;
                chemicalPropertiesDiv.style.display = 'block';
            } else {
                // Reset and hide everything if no chemical is selected
                molecularWeightInput.value = '';
                safetyWarningDiv.style.display = 'none';
                chemicalPropertiesDiv.style.display = 'none';
            }
        });
    }

    const checkQuizBtn = document.getElementById('check-quiz-answer');
    if (checkQuizBtn) {
        checkQuizBtn.addEventListener('click', () => {
            const selectedAnswer = document.querySelector('input[name="quiz-answer"]:checked');
            const feedbackDiv = document.getElementById('quiz-feedback');

            if (!selectedAnswer) {
                alert('Please select an answer.');
                return;
            }

            feedbackDiv.style.display = 'block';
            if (selectedAnswer.value === 'b') {
                feedbackDiv.className = 'feedback correct';
                feedbackDiv.innerHTML = '<strong>Correct!</strong> Dissolving the solute in a smaller amount of solvent first ensures that the final volume of the solution is accurate when you dilute it to the mark in a volumetric flask. This prevents the common error of assuming the solute volume is negligible.';
            } else {
                feedbackDiv.className = 'feedback incorrect';
                feedbackDiv.innerHTML = '<strong>Incorrect.</strong> The correct method is to dissolve the solute in a smaller volume first (Answer B). Adding solute to a full liter of solvent (C) or adding it to the flask before dissolving (A) can lead to significant errors in the final concentration because the volume of the solute itself is not accounted for.';
            }
        });
    }

    const modeToggle = document.getElementById('mode-toggle');
    if (modeToggle) {
        modeToggle.addEventListener('change', () => {
            document.body.classList.toggle('expert-mode', modeToggle.checked);
        });
    }

    const calculateMolalityBtn = document.getElementById('calculate-molality');
    if (calculateMolalityBtn) {
        calculateMolalityBtn.addEventListener('click', () => {
            const soluteMoles = parseFloat(document.getElementById('solute-moles-molality').value);
            const solventMass = parseFloat(document.getElementById('solvent-mass-molality').value);

            if (isNaN(soluteMoles) || isNaN(solventMass)) {
                alert('Please enter valid numbers for moles and mass.');
                return;
            }

            if (solventMass <= 0) {
                alert('Mass of solvent must be a positive value.');
                return;
            }

            const molality = soluteMoles / solventMass;
            document.getElementById('molality-result').textContent = `${molality.toFixed(4)} m`;
        });
    }

    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        const searchableSections = document.querySelectorAll('main > section');

        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            // First, remove highlight from all sections
            searchableSections.forEach(section => {
                section.classList.remove('highlight');
            });

            if (searchTerm.length > 2) { // Only search for terms longer than 2 characters
                searchableSections.forEach(section => {
                    const sectionText = section.textContent.toLowerCase();
                    if (sectionText.includes(searchTerm)) {
                        section.classList.add('highlight');
                    }
                });
            }
        });
    }
});