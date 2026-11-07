const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");

let bg = null;

let player = null;

let guide = [];

let dragging = false;

let reflectionCount = 6;

const BALL_RADIUS = 25;

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if(bg){

        ctx.drawImage(
            bg,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    if(
        document.getElementById(
            "showWall"
        ).checked
    ){
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;

        ctx.strokeRect(
            BALL_RADIUS,
            BALL_RADIUS,
            canvas.width - BALL_RADIUS * 2,
            canvas.height - BALL_RADIUS * 2
        );
    }

    if(player){

        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 5;

        ctx.beginPath();

        ctx.arc(
            player.x,
            player.y,
            35,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }

    if(guide.length > 1){

        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.moveTo(
            guide[0].x,
            guide[0].y
        );

        guide.forEach(p=>{
            ctx.lineTo(p.x,p.y);
        });

        ctx.stroke();

        guide.forEach((p,index)=>{

            if(index===0)return;

            ctx.fillStyle =
            "black";

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                12,
                0,
                Math.PI*2
            );

            ctx.fill();

            ctx.fillStyle =
            "white";

            ctx.fillText(
                index,
                p.x-3,
                p.y+4
            );
        });
    }
}

function getPos(e){

    const rect =
    canvas.getBoundingClientRect();

    return {

        x:
        (e.clientX-rect.left)
        * canvas.width
        / rect.width,

        y:
        (e.clientY-rect.top)
        * canvas.height
        / rect.height
    };
}

imageInput.addEventListener(
"change",
e=>{

    const file =
    e.target.files[0];

    if(!file) return;

    const img =
    new Image();

    img.onload=()=>{

        bg = img;

        canvas.width =
        img.width;

        canvas.height =
        img.height;

        controls.style.display =
        "block";

        draw();
    };

    img.src =
    URL.createObjectURL(file);
});

canvas.addEventListener(
"click",
e=>{

    if(dragging) return;

    player =
    getPos(e);

    draw();
});

canvas.addEventListener(
"pointerdown",
()=>{

    if(player){
        dragging = true;
    }
});

canvas.addEventListener(
"pointerup",
()=>{
    dragging = false;
});

canvas.addEventListener(
"pointermove",
e=>{

    if(
        !dragging ||
        !player
    ) return;

    updateGuide(
        getPos(e)
    );
});

function updateGuide(target){

    guide = [];

    let x = player.x;
    let y = player.y;

    let dx =
    player.x - target.x;

    let dy =
    player.y - target.y;

    const len =
    Math.hypot(dx,dy);

    if(len < 1) return;

    dx /= len;
    dy /= len;

    const angle =
    (
        Math.atan2(dx,-dy)
        *180
        /Math.PI
        +360
    )%360;

    angleText.textContent =
    `角度 ${angle.toFixed(1)}°`;

    guide.push({x,y});

    for(
        let i=0;
        i<reflectionCount;
        i++
    ){

        let tx=Infinity;
        let ty=Infinity;

        if(dx>0)
            tx=
            (canvas.width
            -BALL_RADIUS
            -x)/dx;

        if(dx<0)
            tx=
            (BALL_RADIUS
            -x)/dx;

        if(dy>0)
            ty=
            (canvas.height
            -BALL_RADIUS
            -y)/dy;

        if(dy<0)
            ty=
            (BALL_RADIUS
            -y)/dy;

        const t =
        Math.min(tx,ty);

        x+=dx*t;
        y+=dy*t;

        guide.push({
            x,y
        });

        if(tx<ty){
            dx=-dx;
        }else{
            dy=-dy;
        }
    }

    draw();
}

minusBtn.onclick=()=>{

    if(reflectionCount>1){

        reflectionCount--;

        count.textContent =
        reflectionCount;
    }
};

plusBtn.onclick=()=>{

    reflectionCount++;

    count.textContent =
    reflectionCount;
};

reselectBtn.onclick=()=>{

    player = null;
    guide = [];

    draw();
};

showWall.onchange =
draw;
