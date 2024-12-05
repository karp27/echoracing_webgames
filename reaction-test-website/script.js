document.addEventListener('DOMContentLoaded', () => {
    const message = document.getElementById('message');
    const startButton = document.getElementById('start-button');
    const nextButton = document.getElementById('next-button');
    const lights = document.querySelectorAll('.light');
    const numTestsInput = document.getElementById('num-tests');
    const stopwatchImage = document.getElementById('stopwatch-image');
    let startTime;
    let timeout;
    let lightTimers = [];
    let isTestRunning = false;
    let allowEarlyClick = false;
    let testCount = 0;
    let numTests = 1;
    let reactionTimes = [];

    const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const resetTest = () => {
        isTestRunning = false;
        allowEarlyClick = false;
        lights.forEach(light => light.style.backgroundColor = 'grey');
        startButton.style.display = 'block';
        nextButton.style.display = 'none';
    };

    const startNextTest = () => {
        startButton.style.display = 'none';
        nextButton.style.display = 'none';
        message.textContent = 'Get ready...';
        allowEarlyClick = false;
        isTestRunning = false;

        lights.forEach(light => light.style.backgroundColor = 'grey');

        let totalDelay = 0;
        lights.forEach((light, index) => {
            let delay = randomDelay(1400, 2800);
            totalDelay += delay;
            lightTimers[index] = setTimeout(() => {
                light.style.backgroundColor = 'red';
                if (index === lights.length - 1) {
                    message.textContent = 'Wait for lights out...';
                    timeout = setTimeout(() => {
                        lights.forEach(light => light.style.backgroundColor = 'grey');
                        message.textContent = 'Go!';
                        startTime = Date.now();
                        isTestRunning = true;
                    }, randomDelay(2000, 5000));
                }
            }, totalDelay);
        });

        setTimeout(() => {
            allowEarlyClick = true;
        }, 500);
    };

    const displayResults = () => {
        const bestTime = Math.min(...reactionTimes);
        const worstTime = Math.max(...reactionTimes);
        const avgTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;

        message.innerHTML = `
            <p>Best Time: ${bestTime} ms</p>
            <p>Worst Time: ${worstTime} ms</p>
            <p>Average Time: ${avgTime.toFixed(2)} ms</p>
            <p>Click start to try again.</p>
        `;
    };

    startButton.addEventListener('click', () => {
        testCount = 0;
        reactionTimes = [];
        numTests = parseInt(numTestsInput.value, 10);
        if (isNaN(numTests) || numTests < 1) {
            message.textContent = 'Please enter a valid number of tests.';
            return;
        }
        startNextTest();
    });

    nextButton.addEventListener('click', () => {
        startNextTest();
    });

    stopwatchImage.addEventListener('click', () => {
        if (!isTestRunning) {
            message.textContent = 'Click "Start" to begin.';
            resetTest();
        }
    });

    document.body.addEventListener('click', () => {
        if (isTestRunning) {
            const reactionTime = Date.now() - startTime;
            reactionTimes.push(reactionTime);
            testCount++;

            message.textContent = `Your reaction time is ${reactionTime} ms.`;

            if (testCount < numTests) {
                nextButton.style.display = 'block';
            } else {
                displayResults();
                resetTest();
            }

            isTestRunning = false;
        } else if (allowEarlyClick && startButton.style.display === 'none') {
            clearTimeout(timeout);
            lightTimers.forEach(timer => clearTimeout(timer));
            message.textContent = 'Too soon! Click "Start" to try again.';
            resetTest();
        }
    });
});
