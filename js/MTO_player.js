new domReady(function () {
    let a = document.createElement("audio");
    a.setAttribute("src","");

    mapPlayer(a);

    function mapPlayer(audio){
        let playBtn = $("#btn_start");
        let skipBtn = $("#btn_skip");
        let volume = $("#btn_volume");
        let currentTime = 40;

        playBtn.onmousedown = function(){
            this.className = "btn-start btn-active";
            if(!this.active){
                this.active = true;
                this.style.backgroundPosition = "-118px -218px";
                audio.play();
                audio.currentTime = currentTime;
            }
            else {
                this.active = false;
                this.style.backgroundPosition = "0 -218px";
                audio.pause();
            }
        };
        playBtn.onmouseup = function(){
            this.className = "btn-start";
        }
    }
});