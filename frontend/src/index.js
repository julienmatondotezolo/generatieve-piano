"use-strict"


window.onload = () =>{
    //test
    

     
    // const genie = new mm.PianoGenie(CONSTANTS.GENIE_CHECKPOINT);
    // console.log(genie);
      const mvae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/trio_4bar');
      const player = new mm.Player();
      console.log(player);
      
      $(".key").click(function() {
        let key = $(this);
        mvae.initialize().then(() => {
            mvae.sample(2).then((samples) => player.start(samples[element]));
          });
        console.log(key.attr("data-note"));
      });

}
