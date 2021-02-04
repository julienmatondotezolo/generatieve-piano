// FUNCTION TO GENERATE QR CODE AND APPEND TO DOM //

export let generateQrCode =  (newUrl) => {
    
    // FUNCTION TO GET URL //

    console.log(newUrl);

   let imageSource = `http://api.qrserver.com/v1/create-qr-code/?data=${newUrl}&size=200x200`;

            let div = document.createElement("div");
            div.id = 'pop-up';
            let popupContainer = document.getElementById("popup-container");
            popupContainer.appendChild(div);
            
            let popup = document.getElementById('pop-up');
            popup.style.backgroundColor = 'white';
            popup.innerHTML = `
            
            <div id="img-container">
                    <img src="./images/paino-logo.png" alt="" width="200" height="62.5">

                </div>
                <div id="title-container">
                    <p>Share the code to your friends by copying the link by using the QR-Code</p>

                    <div id="input-container">
                        <input type="text" id="input" value="${newUrl}">
                    </div>

                    <button id="copy-button">Copy to clipboard!</button>
                    <p>Or you can scan it on the other device:</p>
                    <img src="${imageSource}">

            `
            copyText();
};

let copyText = () => {
    document.getElementById('copy-button').addEventListener('click', () => {
        let input = document.getElementById('input');
        input.select();
        input.setSelectionRange(0, 99999); // for mobile device
        document.execCommand("copy");
        console.log('text copied!');
     })
}