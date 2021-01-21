"use-strict"

    console.log("test")
    let TWINKLE = {
        notes: [{
            pitch: 50,
            startTime: 0.0,
            endTime: 0.1
        }, ],
        totalTime: 1
    };
    const player = new mm.Player();

    let noteSeq = [];
    noteSeq.push($(".white"));
    console.log(noteSeq);

    $(".white").click(function () {
        let key = $(".white");
        // console.log(key);

        noteSeq.forEach(element => {
            for (let i = 0; i < element; i++) {
                TWINKLE.notes[0].pitch++;
                console.log("runt");
            }
            TWINKLE.notes[0].pitch += 5;
            console.log(TWINKLE.notes[0].pitch);
            console.log(element);
        });

        player.start(TWINKLE);
        console.log(key.attr("data-note"));
    });
