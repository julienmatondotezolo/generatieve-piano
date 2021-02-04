// FUNCTION TO GENERATE QR CODE AND APPEND TO DOM //

export let generateQrCode = (newUrl) => {

    // FUNCTION TO GENERATE URL //

    let imageSource = `http://api.qrserver.com/v1/create-qr-code/?data=${newUrl}&size=200x200`;

    $("#popup-container").append(`
        <div id="img-container">
            <img src="./images/paino-logo.png" alt="" width="200" height="62.5">
        </div>

        <div id="title-container">
            <h3>Copy provided address and send it to the other person.</h3>

            <div id="input-container">
                <input type="text" id="input" value="${newUrl}">
            </div>
            <p>Or you can scan it on the other device:</p>
            <img src="${imageSource}">
        </div>

        <div id="title-container">
            <button id="copy-button" class="btn">Join room</button>
        </div>
    `);

    let input = document.getElementById('input');
    input.select();
    input.setSelectionRange(0, 99999); // for mobile device
    document.execCommand("copy");
    console.log('text copied!');

    copyText(newUrl);
};

let copyText = (url) => {
    document.getElementById('copy-button').addEventListener('click', () => {
        window.location = url
    })
}
