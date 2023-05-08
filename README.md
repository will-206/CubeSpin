# CubeSpin
![cubes](https://user-images.githubusercontent.com/20939293/236776005-cdc9dce7-a564-44cf-a689-e421a60f3185.gif)


This is my attempt to recreate the animation from this reddit post in JavaScript
https://v.redd.it/kodek387rdq11

Credit to the original animator: https://beesandbombs.tumblr.com/

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="bGmaQJa" data-user="will-206" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/will-206/pen/bGmaQJa">
  Rotating Cube</a> by <a href="https://codepen.io/will-206">@will-206</a>
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

This code creates an animation of 3D rotating cubes pattern on an HTML canvas. The cubes are projected onto a 2D plane using isometric projection. The cubes are arranged in a spiral pattern around the center and rotate 90 degrees in a sequence based on distance from the center, with each cube starting its rotation slightly later than the previous one. The animation runs in a loop, restarting after a set interval.

Optimizations: 

Frame rate limiting: The code limits the frame rate to 30 FPS by checking the time elapsed between frames before redrawing the scene. This helps prevent unnecessary computations and reduces CPU usage.

Off-canvas culling: The code checks if a cube's position is within the visible canvas area before drawing it. If a cube is off-canvas, it is not drawn, saving computational resources by not rendering unnecessary elements.

Face culling: The code omits drawing the right and bottom faces of the cube, as they are never visible in the isometric view. This reduces the number of faces to be drawn, improving rendering performance.

Efficient cube rotation calculation: The cube's rotation progress is calculated based on the elapsed time and the total rotation time, ensuring smooth rotation transitions while reducing unnecessary computations.
 
Here's <span><a href="https://codepen.io/will-206/pen/WNaMaRq">another version</a>, where the translation direction and rotation axis changes by 120 degrees every cycle. 


![cubes2small](https://user-images.githubusercontent.com/20939293/236800410-17725706-58ee-4fd3-ab82-5da62e5173e9.gif)


