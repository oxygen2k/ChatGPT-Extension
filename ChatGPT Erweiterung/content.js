console.log("Content Skript wird ausgeführt!");

function appendButton(text, promptExtension, tooltip, custom = false) {
    let button = document.createElement('button');
    button.innerText = text;
    button.title = tooltip;

    button.style.backgroundColor = "#99ccff"; 
    button.style.border = "none";              
    button.style.color = "black";              
    button.style.padding = "15px 32px";           
    button.style.textAlign = "center";         
    button.style.textDecoration = "none";      
    button.style.display = "inline-block";     
    button.style.fontSize = "16px";            
    button.style.margin = "4px 2px";           
    button.style.cursor = "pointer";     
    button.style.position = 'relative';
    
    if (!custom) {
        let circle = document.createElement('div')
        circle.style.background = 'red';
        circle.style.width = '15px';
        circle.style.height = '15px';
        circle.style.borderRadius ='50%';
        circle.style.position = 'absolute';
        circle.style.right = '2px';
        circle.style.top = '2px'
        circle.style.display = 'flex';
        circle.style.justifyContent = 'center';
        circle.style.alignItems= 'center';

        let deleteBtn = document.createElement('span');
        deleteBtn.innerHTML = " -"; // Minus-Symbol
        deleteBtn.title = "Button löschen";
        deleteBtn.style.color = "white"; // Farbe für das Minus-Symbol
        deleteBtn.style.cursor = "pointer"; 
        
        circle.onclick = function(event) {
            event.stopPropagation(); // Verhindert das Auslösen des Hauptbutton-Klick-Events

            // Button aus der Seite entfernen
            button.remove();
            
            // Button aus chrome.storage entfernen
            chrome.storage.local.get({ customButtons: [] }, function(result) {
                const index = result.customButtons.findIndex(btn => btn.text === text && btn.promptExtension === promptExtension);
                if (index > -1) {
                    result.customButtons.splice(index, 1);
                    chrome.storage.local.set({ customButtons: result.customButtons });
                }
            });
        };

        button.appendChild(circle);
        circle.appendChild(deleteBtn);
    }


    if (custom) {
        let circle = document.createElement('div')
        circle.style.background = 'green';
        circle.style.width = '15px';
        circle.style.height = '15px';
        circle.style.borderRadius ='50%';
        circle.style.position = 'absolute';
        circle.style.left = '50%';
        circle.style.top = '50%'
        circle.style.transform = 'translate(-50%,-50%)'
        circle.style.display = 'flex';
        circle.style.justifyContent = 'center';
        circle.style.alignItems= 'center';
        button.appendChild(circle)

        let addBtn = document.createElement('span');
        addBtn.innerHTML = "+"; 
        addBtn.title = "Button löschen";
        addBtn.style.color = "white"; 
        addBtn.style.cursor = "pointer"; 
        circle.appendChild(addBtn)
        button.onclick = function() {
            let customText = prompt("Gib den Text für den Button ein:");
            let customPromptExtension = prompt("Gib die dazugehörige Prompt-Erweiterung ein:");
    
            if (customText && customPromptExtension) {
                appendButton(customText, customPromptExtension, "Benutzerdefinierter Prompt");
                chrome.storage.local.get({ customButtons: [] }, function(result) {
                    result.customButtons.push({
                        text: customText,
                        promptExtension: customPromptExtension
                    });
                    chrome.storage.local.set({ customButtons: result.customButtons });
                });
            }
        }
    } else {
        button.onclick = function() {
            let promptBox = document.querySelector('#prompt-textarea');
            if (promptBox) {
                promptBox.value += ' ' + promptExtension;
            }
            // Senden-Button auslösen
            let sendButton = document.querySelector('[data-testid="send-button"]');
            if (sendButton) {
                sendButton.click();
            }
        }
    }

    document.body.appendChild(button);
}

// Laden Sie zuerst alle benutzerdefinierten Buttons
chrome.storage.local.get({ customButtons: [] }, function(result) {
    for (let buttonData of result.customButtons) {
        appendButton(buttonData.text, buttonData.promptExtension);
    }
});


appendButton("+", "", "Einen benutzerdefinierten Prompt hinzufügen", true);
appendButton("Analogie", "Erhalten Sie eine Erklärung des Themas mithilfe einer Analogie."),
appendButton("Pro/Kontra", "Erhalten Sie eine Liste der Vor- und Nachteile des Themas."),
appendButton("Zusammenfassung", "Erhalten Sie eine kurze Zusammenfassung des Themas in einem Satz."),
appendButton("Kurz", " Erklär mir das in kurz.", "Erhalten Sie eine kurze und prägnante Erklärung des Themas."),
appendButton("Technisch", " Erkläre mir das technisch.", "Erhalten Sie eine detaillierte und technische Erklärung des Themas.")