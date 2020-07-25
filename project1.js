  /*
  MERT SARAÇ
  21401480
  REF:
  https://codepen.io/grsmith/pen/zNGPoX
  https://www.youtube.com/watch?v=S0QZJgNTtEw
  */
  var beginningVal = true;
  var bufferId;
  var program;
  var t;
  var gl;
  var points;
  var colors = [
    vec4(0.0, 0.0, 0.0, 1.0 ),  // black
    vec4(0.0, 0.8, 0.83, 1.0), //river
    vec4(0.6, 0.1, 0.0, 1.0), //house part1
    vec4(0.7, 0.1, 0.0, 1.0), //house part2
    vec4(0.1 ,0.8  , 0.1, 1.0 ), // tree green
    vec4(1.0, 0.0, 0.0, 1.0), //red
    vec4(0.5, 0.5, 0.5, 1.0) //gray
];
  var circleRadius = 0.075;
  var rockRadius = 0.050;
  var selected = 0;
  var attractor = [];
  var circles = [];
  var riverW;
  var generateButton = document.getElementById("generatescene");


  window.onload = function init(){
      var canvas = document.getElementById( "gl-canvas" );
       gl = WebGLUtils.setupWebGL( canvas );    
       if ( !gl ) { alert( "WebGL isn't available" ); 
        }        

  //  Configure WebGL   
  //    
      gl.viewport( 0, 0, canvas.width, canvas.height );
      gl.clearColor( 0, 1.0, 0, 1.0 );   //background color
       
  //  Load shaders and initialize attribute buffers

      program = initShaders( gl, "vertex-shader", "fragment-shader" );
      gl.useProgram( program );        

  // Load the data into the GPU        

      bufferId = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
      
  	
  // Associate out shader variables with our data buffer

        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );    
        uniformfcolor = gl.getUniformLocation(program, "fcolor");
        //gl.clear( gl.COLOR_BUFFER_BIT ); 

        /*
        River(randomNumGenerator(), uniformfcolor);

        renderHouse(randomNumGenerator(), randomNumGenerator(), 0.1);

        renderCircle(randomNumGenerator(), randomNumGenerator(), 0.1, bufferId, program);
        
        renderTree(randomNumGenerator(), randomNumGenerator(), bufferId, program)


        */

        canvas.addEventListener("mousedown", function(event){
        t  = vec2(2*event.clientX/canvas.width-1, 
           2*(canvas.height-event.clientY)/canvas.height-1);
        console.log("Coord: " + t + "type: " + selected);
        attractor.push(t[0]);
        attractor.push(t[1]);
        attractor.push(selected);
        
        for (var i = 0; i < attractor.length; i++) {
          console.log(attractor[i]);
        };

    } );


        
      generateCircleAreas(bufferId, program);

  };
/*
  function generateButton() {
    generateButton = document.getElementById("generatescene");
    generateButton.addEventListener("click", function () {
    generateOthers(bufferId, program);
    console.log("button pushed!");
    });
  }
*/
  function randomNumGenerator(min, max) {
    var x = (Math.floor(Math.random() * max) + min ) / 100 // TEKRAR BAK!!!
    //console.log(x);
    return x;
  }

  function collisonDetector(x1, y1, x2, y2, radius) {
    if ( Math.sqrt( ( x2-x1 ) * ( x2-x1 )  + ( y2-y1 ) * ( y2-y1 ) ) < ( radius + radius ) ) 
    {
      //console.log("COLLISION DETECTED!");
      return true;
    }
    return false;
  }

  function generateCircleAreas(bufferId, program){
     gl.clear( gl.COLOR_BUFFER_BIT ); 
    gl.clearColor( 0, 1.0, 0, 1.0 );   //background color
     
       // gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
      //  gl.enableVertexAttribArray( vPosition );    
        
       


    var maxwidth = parseFloat(document.getElementById("max_width").value);
    var minwidth = parseFloat(document.getElementById("min_width").value);
      riverW = maxwidth;
    renderRiver(riverW, uniformfcolor);

    var xCoord = randomNumGenerator( (riverW + circleRadius) * 100 , (1 - (2 * circleRadius) - riverW) * 100 );
    circles.push(xCoord);
    //console.log(" circle x is " + circles[0]);
    var yCoord = randomNumGenerator( circleRadius * 100, (1 - (2 * circleRadius)) * 100 );
    circles.push(yCoord);
    //console.log(" circle y is " + circles[1]);
    renderCircle(xCoord, yCoord, circleRadius, bufferId, program); // (+,+)

  /*
  for (var i = 0; i < 2; i++){
    xCoord = randomNumGenerator( (riverW + circleRadius) * 100 , (1 - (2 * circleRadius) - riverW) * 100 );
    circles.push(xCoord);
    yCoord = randomNumGenerator( circleRadius * 100, (1 - (2 * circleRadius)) * 100 );
    circles.push(yCoord);
    renderCircle(xCoord, yCoord, circleRadius, bufferId, program); // (+,+)
  } 
  */

    var overlapping = false,
    NumCircles = 100,
    protection = 120,
    counter = 0;
  
    while (circles.length < NumCircles &&
         counter < protection) {

    xCoord = randomNumGenerator( (riverW + circleRadius) * 100 , (1 - (2 * circleRadius) - riverW) * 100 );
    yCoord = randomNumGenerator( circleRadius * 100, (1 - (2 * circleRadius)) * 100 );
    overlapping = false;
    
    // check that it is not overlapping with any existing circle
    // another brute force approach
    for (var i = 0; i < 2 * circles.length; i = i + 2) {
      
      if ( collisonDetector(circles[i], circles[i+1], xCoord, yCoord, circleRadius) ) {
        // They are overlapping
        overlapping = true;
        // do not add to array
        break;
      }
    }
    // add valid circles to array
    if (!overlapping) {
      circles.push(xCoord);
      circles.push(yCoord);  
      //renderHouse(xCoord, yCoord, 0.050); 
      //console.log("rendered house " + i);     
    }
    
    counter++;
  }

  if (beginningVal == true){
    for (var i = 0; i < 2* circles.length; i = i + 2) {
    renderCircle(-circles[i], circles[i+1], circleRadius, bufferId, program);
    renderRock (-circles[i], circles[i+1], rockRadius, 6, bufferId, program) 
    renderCircle(circles[i], -circles[i+1], circleRadius, bufferId, program);
    renderHouse(circles[i], -circles[i+1], 0.050);
    renderCircle(-circles[i], -circles[i+1], circleRadius, bufferId, program);
    renderHouse(-circles[i], -circles[i+1], 0.050);
    renderCircle(circles[i], circles[i+1], circleRadius, bufferId, program);
    renderTree(circles[i], circles[i+1], bufferId, program);
    beginningVal = false;
  }
  }
  
  
  var clength = circles.length;

  
  for (var i = 0; i < clength; i = i + 2) {
    circles.push(-circles[i]);
    circles.push(-circles[i+1]);
  }

  for (var i = 0; i < clength; i = i + 2) {
    circles.push(circles[i]);
    circles.push(-circles[i+1]); 
  }

  for (var i = 0; i < clength; i = i + 2) {
    circles.push(-circles[i]);
    circles.push(circles[i+1]);
  }
  /*
  for (var i = 0; i < clength; i = i + 2) {
    console.log("clength: " + clength + "circles.length: " + circles.length );
  }
  */

  /*
   for (var i = 0; i < 2* circles.length; i = i + 2) {
    renderCircle(circles[i], circles[i+1], circleRadius, bufferId, program);
    }
  */
    /*
    for (var i = 0; i < 2* circles.length; i = i + 2) {
    console.log( Math.sqrt( ( attractor[i]-circles[i] ) * ( attractor[i]-circles[i] )  + ( attractor[i+1]-circles[i+1] ) * ( attractor[i+1]-circles[i+1] ) ) );
    }
    */

    //generateOthers(bufferId, program);

  for (var i = 0; i < circles.length; i = i + 2) {
    //renderHouse(circles[i], circles[i+1], 0.050);
    
  }
  
}

  function renderCircle(f, s, radius){

    var vertices = [];
    for (var i = 0.0; i <= 360; i += 4) {
        // degrees to radians
        var j = i * Math.PI / 180;
        // X Y Z 

        var vert1 = [
            Math.sin(j) * radius + f,
            Math.cos(j) * radius + s, 
        ];
        var center = [
            Math.sin(j) * radius / 1.1 + f,
            Math.cos(j) * radius / 1.1 + s,  
        ];
        vertices = vertices.concat(vert1);
        vertices = vertices.concat(center);
    }

    var n = vertices.length / 2;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.uniform4fv(uniformfcolor, colors[0]); //color

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

  } 

 function renderFilledCircle (f, s, radius, color){

    var vertices = [];
    for (var i = 0.0; i <= 360; i += 4) {
        // degrees to radians
        var j = i * Math.PI / 180;
        // X Y Z

        var vert1 = [
            Math.sin(j) * radius + f,
            Math.cos(j) * radius + s,
        ];
        var center = [
            f,
            s 
        ];
        vertices = vertices.concat(vert1);
        vertices = vertices.concat(center);
    }

    var n = vertices.length / 2;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.uniform4fv(uniformfcolor, colors[color] ); //color

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

 }

 function renderRock (f, s, radius, color){

    var vertices = [];
    var counter = 0;
    var count = Math.random() * 100;
    for (var i = 0.0; i <= 360; i += 1) {
        // degrees to radians
        var j = i * Math.PI / 180;
       // j=j +j*Math.random();
        // X Y Z

        var vert1 = [
            Math.sin(j) * radius + f,
            Math.cos(j) * radius + s,
        ];
        var center = [
            f,
            s 
        ];
       // vert1= rotate(f,s, vert1[i],vert1[i+1],Math.random()*20);

        if (i % 72== 0){
          counter++;
          if(counter == count)
            break;


          vertices = vertices.concat(vert1);
          vertices = vertices.concat(center);
        }

    }
    var rot_ang = 50*Math.random();

    for(var i = 0;  i <vertices.length; i = i+2){
      var tmp = rotate(f,s,vertices[i],vertices[i+1], rot_ang);
      vertices[i] = tmp[0];
       vertices[i+1] = tmp[1];
    }

    var n = vertices.length / 2;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.uniform4fv(uniformfcolor, colors[color] ); //color

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

 }

 function renderTree(f, s) {
    renderFilledCircle(f, s, 0.07, 4);

    f = f + 0.02 * Math.random();
    s = s + 0.03;

    renderFilledCircle(f, s, 0.007, 5);

    f = f - 0.02;
    s = s - 0.03;

    renderFilledCircle(f, s, 0.007, 5);

    f = f - 0.03;
    s = s - 0.02;

    renderFilledCircle(f, s, 0.007, 5);

    f = f + 0.02;
    s = s + 0.1;

    //renderFilledCircle(f, s, 0.007, 5);
 }

  function renderHouse(x, y, addition){
      var x1 = x;
      var x2 = x + addition;
      var y1 = y;
      var y2 = y + addition;
      var ang = 360*Math.random();

      vertices2 = [
        rotate(x1 ,y1,x1,y1,ang),
        rotate(x1 ,y1,x1,y2,ang),
        rotate(x1 ,y1,x2,y2,ang),
        rotate(x1 ,y1,x2,y1,ang)

      ];

      gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
      gl.bufferSubData(gl.ARRAY_BUFFER, new Float32Array(vertices2), flatten(vertices2));
      gl.uniform4fv(uniformfcolor, colors[2]);
      gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);


      y1a = y1 - addition;
      y2a = y2 - addition;

      vertices2 = [
        rotate(x1 ,y1,x1,y1a,ang),
        rotate(x1 ,y1,x1,y2a,ang),
        rotate(x1 ,y1,x2,y2a,ang),
        rotate(x1 ,y1,x2,y1a,ang)

      ];
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
      gl.bufferSubData(gl.ARRAY_BUFFER, new Float32Array(vertices2), flatten(vertices2));
      gl.uniform4fv(uniformfcolor, colors[3]);
      gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);

  } 

  function renderRiver(width ,uniformfcolor) {

    var vertices = [
          vec2( -width , -1 ),
          vec2( -width ,  1 ),
          vec2(  width ,  1 ),
          vec2(  width , -1 )
    ];

    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); 
      //gl.clear( gl.COLOR_BUFFER_BIT ); 
    gl.uniform4fv(uniformfcolor, colors[1]);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
     //gl.drawArrays(gl.TRIANGLES,3,3)
  }

function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

  function selectRock() {
    selected = 1;
  }

  function selectHouse() {
    selected = 2;
  }

  function selectTree() {
    selected = 3;
  }

  function generateOthers() {
  var total_prob =[];
  var possibRock = [];
  var possibHouse = [];
  var possibTree = [];

   gl.clear( gl.COLOR_BUFFER_BIT ); 
  //gl.clearColor( 0, 1.0, 0, 1.0 );   //background color
  //var riverW = parseFloat(document.getElementById("max_width").value *Math.random())+parseFloat(document.getElementById("min_width").value *Math.random());
    renderRiver(riverW, uniformfcolor);
    for (var i = 0; i < circles.length; i = i + 2) {
    renderCircle(circles[i], circles[i+1], circleRadius, bufferId, program);
    console.log("cccc");
    }


  /*
  for (var i = 0; i < 2; i++){
    xCoord = randomNumGenerator( (riverW + circleRadius) * 100 , (1 - (2 * circleRadius) - riverW) * 100 );
    circles.push(xCoord);
    yCoord = randomNumGenerator( circleRadius * 100, (1 - (2 * circleRadius)) * 100 );
    circles.push(yCoord);
    renderCircle(xCoord, yCoord, circleRadius, bufferId, program); // (+,+)
  } 
  */


  console.log("generated others are called");
  console.log(circles.length);

  for(var i =0; i < attractor.length;i++) {
    console.log(attractor[i]);
  }
    

  for (var i = 0; i < circles.length; i = i + 2) {
    //renderHouse(circles[i], circles[i+1], 0.050);
     console.log("bbbbbbb");
    for(var j= 0; j<attractor.length;j = j+3) {
      console.log("aaaaaaaa" + attractor[j+2]);
      if(attractor[j+2] == 1) {
         possibRock[i] = 1 / (Math.sqrt( ( attractor[j]-circles[i] ) * ( attractor[j]-circles[i] )  + ( attractor[j+1]-circles[i+1] ) * ( attractor[j+1]-circles[i+1] ) ));
         console.log(possibRock[i]);
      } 
      if(attractor[j+2] == 2) {
        possibHouse[i] = 1 / (Math.sqrt( ( attractor[j]-circles[i] ) * ( attractor[j]-circles[i] )  + ( attractor[j+1]-circles[i+1] ) * ( attractor[j+1]-circles[i+1] ) ));
        console.log(possibHouse[i]);
      }
      if(attractor[j+2] == 3) {
        possibTree[i] = 1 / (Math.sqrt( ( attractor[j]-circles[i] ) * ( attractor[j]-circles[i] )  + ( attractor[j+1]-circles[i+1] ) * ( attractor[j+1]-circles[i+1] ) ));
        console.log(possibTree[i]);
      }
        
       total_prob[i] = total_prob[i] + possibRock[j] + possibTree[j] +possibHouse[j];
    }
  }
  
  for (var i = 0; i < circles.length; i = i + 2) {
    console.log("*****" + attractor[i]);
    if(possibHouse[i]>possibRock[i]){
      renderHouse(circles[i], circles[i+1], 0.050);
      console.log("house");
    }
    else if (possibRock[i] > possibTree[i]) {
      renderRock (circles[i], circles[i+1], rockRadius, 6, bufferId, program);
    }
    else {
      renderTree(circles[i], circles[i+1], bufferId, program);
      console.log("rock");
    }
    
  }
}













