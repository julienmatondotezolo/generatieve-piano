"use-strict"

window.onload = () => {

    console.log("code runs");
    pianoKey();
}

function pianoKey() {
    const model = new mm.MusicVAE(
        'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/trio_4bar');
    const player = new mm.Player();
    player.start(TWINKLE_TWINKLE);
    player.stop();

    $(".key").click(function() {
        let key = $(this)
        let keyNote = key.attr("data-note");
        console.log(keyNote);
      });

}