import {historyData} from "./api.js";

// Function to fetch and display a random event with its country  
function fetchRandomEvent() {
    historyData.load({
        callback: async function (data) {
            const events = data.data.Events;
            const randomEvent = events[Math.floor(Math.random() * events.length)];

            // Display the event and country  
            const eventContainer = document.getElementById('event');
            eventContainer.innerHTML = `  
                            <p><strong>Fact:</strong> ${randomEvent.html}</p>  
                        `;
        }
    });
}

// Fetch a random event when the page loads
window.onload = fetchRandomEvent;

window.parent.postMessage({ action: "ready" }, "*");

window.console = new Proxy(console, {
    get(target, prop) {
        if (['log', 'warn', 'error'].includes(prop)) {
            return new Proxy(target[prop], {
                apply(fn, thisArg, args) {
                    fn.apply(thisArg, args);
                    window.parent.postMessage({
                        action: 'console',
                        type: prop,
                        args: args.map((arg) => {
                            try {
                                return JSON.stringify(arg).replace(/^["']|["']$/g, '');
                            } catch (e) {
                                return arg;
                            }
                        })
                    }, '*');
                }
            });
        }
        return target[prop];
    }
});  
