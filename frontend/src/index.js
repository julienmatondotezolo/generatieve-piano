"use-strict"

console.log("is running")
let TWINKLE = {
    notes: [{
        pitch: 50,
        startTime: 0.0,
        endTime: 0.1
    }, ],
    notesB: [{
        pitch: 70,
    }, ],
    totalTime: 1
};

const player = new mm.Player();

let noteSeq = [];
noteSeq.push($(".white"));
console.log(noteSeq);

let noteSeqBlack = [];
noteSeqBlack.push($(".black"));
console.log(noteSeqBlack);

    $(".white").click(function () {
        playNotes();
        
    });

console.log(document.getElementsByTagName("data-note"));

let clicked = false;

$(".key").mouseup(function () {
    clicked = false;
    console.log('clicked: ', clicked)
}).mousedown(function () {
    clicked = true;
    console.log('clicked: ', clicked)
    $('.key').mouseenter(function (e) {
        if ($(".key:hover").length != 0 && clicked) {
            console.log('Hold: ', true)
            playNotes();
        }
    }).mouseleave(function () {
        console.log('Hold: ', false)
    })

    
});

function playNotes(){
    player.stop(TWINKLE);
        let key = $(".white");
        
        noteSeq.forEach(element => {
            for (let i = 0; i < element; i++) {
                TWINKLE.notes[0].pitch++;
                console.log("runt");
            }
            TWINKLE.notes[0].pitch += 2;
            console.log(TWINKLE.notes[0].pitch);
            console.log(element);
        });
        player.start(TWINKLE);
    console.log(key.attr("data-note"));
}