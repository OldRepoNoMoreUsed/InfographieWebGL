var vertexBuffer = null;
var indexBuffer = null;
var colorBuffer = null;

var indices = [];
var vertices = [];
var colors = [];

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function renderLoop(){
    requestAnimationFrame(renderLoop);
    drawScene();
}

function initProgram(){
    var vertexShaderSource = document.getElementById("vertexShader").textContent;
    var fragmentShaderSource = document.getElementById("fragmentShader").textContent;

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    var program = gl.createProgram(); 
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success){
        return program;
    }
    console.log(gl.getprograminfoLog(program));
    gl.deleteProgram(program);
}

function createShader(gl, id){
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function initShaderParameters(prg){
    prg.vertexPositionAttribute = gl.getAttribLocation(prg, "aVertexPosition");
    gl.enableVertexAttribArray(prg.vertexPositionAttribute);
    prg.colorAttribute = gl.getAttribLocation(prg, "aColor");
    gl.enableVertexAttribArray(prg.colorAttribute);
    prg.pMatrixuniform = gl.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixuniform = gl.getUniformLocation(prg, 'uMVMatrix')
}

function initBuffers(){
    vertices.push(-1.0, -1.0, 0.0);
    vertices.push(1.0, -1.0, 0.0);
    vertices.push(0.0, 1.0, 0.0);

    colors.push(1.0, 0.0, 0.0, 1.0);
    colors.push(0.0, 1.0, 0.0, 1.0);
    colors.push(0.0, 0.0, 1.0, 1.0);

    indices.push(0, 1, 2);
    
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    indexBuffer = gl.createBuffer();
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);
}

function drawScene(){
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    mat4.identity(pMatrix);
    mat4.identity(mvMatrix);

    gl.uniformMatrix4fv(prg.pMatrixuniform, false, pMatrix);
    gl.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(prg.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.vertexAttribPointer(prg.colorAttribute, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

function initWebGL(){
    //Get gl context
    const canvas = document.querySelector("#webgl-canvas");
    const gl = canvas.getContext("webgl");
    if(!gl){
        alert("Unable to initialize WebGL");
        return;
    }
    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    var prog = initProgram();
    gl.useProgram(prg);
    initShaderParameters(prg);

    initBuffers();
    renderLoop();
}