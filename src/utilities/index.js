
// This is used to perform temporary animations on canvas objects.
export function animateCanvasObject(numFrames, timePerFrame, animation, whendone) {

  var frame = 0;  // Store current frame number
  var time = 0;   // Store total elapsed time

  // Arrange to call displayNextFrame() every timePerFrame milliseconds.
  // This will display each of the frames of the animation.
  var intervalId = setInterval(displayNextFrame, timePerFrame);

  // The call to animateCanvasObject() returns now, but the previous line ensures that
  // the following nested function will be invoked once for each frame
  // of the animation.
  function displayNextFrame() {
  
    if (frame >= numFrames) {                   // First, see if we're done
      clearInterval(intervalId);                // If so, stop calling ourselves
      if (whendone) {			
        for(var whendoneItem in whendone) {
          whendone[whendoneItem](frame, time);  // Invoke whendone function
        }
      }
      return;                                   // And we're finished
    }

    // Now loop through all properties defined in the animation object
    for(var animationItem in animation) {
      // For each property, call its animation function, passing the
      // frame number and the elapsed time. Use the return value of the
      // function as the new value of the corresponding style property
      // of the specified element. Use try/catch to ignore any
      // exceptions caused by bad return values.
      try {                
        animation[animationItem](frame, time);
      } catch(e) {}
    }

    frame++;               // Increment the frame number
    time += timePerFrame;  // Increment the elapsed time
  }
}

// I use the function below to determine if the goodGuyFire has hit the badGuy. 
// It calculates the distance (squared) between the centres of two circles, and compares this with the sum (squared) of the radii of the circles
export function hitTest1(obj1, obj2) {

  // Both obj1 and obj2 are circles, so to determine if one has hit the other, I first find the distance apart squared (using Pythagoras' theorem)...
  var distanceApartSquared = (obj1.xPos - obj2.xPos) * (obj1.xPos - obj2.xPos) + (obj1.yPos - obj2.yPos) * (obj1.yPos - obj2.yPos);

  // ...then i compare this value with the sum of the two radii, squared. If this value is less, then there has been a collision. 
  // Note: In the 
  if (distanceApartSquared <= (obj1.radius + obj2.radius) * (obj1.radius + obj2.radius)) {
    return true;
  }

  return false;
}

// I use the function below to determine if the badGuyFire has hit the goodGuy. 
// To simplify the calculations, I consider the badGuyFire (obj2) to be a point located at the badGuyFire's centre. Thus, detecting a "hit" becomes a matter of 
// determining if the point is inside the goodGuy (obj1), represented here as a polygon. 
export function hitTest2(obj1, obj2) {

  var length = obj1.vertices.length;

  // goodGuy will be represented by "polygon" 
  var polygon = [length];

  for (var i = 0; i < length; i++) {
    polygon[i] = {};
    polygon[i].x = obj1.vertices[i].x + obj1.xPos; // Each vertex is stored as a fixed value. Don't forget to offset it by the appropriate amount! 
    polygon[i].y = obj1.vertices[i].y + obj1.yPos;
  }

  // badGuyFire will be represented by "point"
  var point = { x: obj2.xPos, y: obj2.yPos };

  // Is "point" inside "polygon" ?
  return pointInPolygon(polygon, point);
}

// To determine if a point falls within a polygon, the following function makes use of the Ray-casting algorithm. 
// A full discussion of the theory and code behind the Ray-casting algorithm can be found here: http://rosettacode.org/wiki/Ray-casting_algorithm
export function pointInPolygon(polygon, point) {

  var length = polygon.length;
  var currentSegment = [];
  var intersectCount = 0;

  for (var i = 0; i < length; i++) {

    currentSegment[0] = polygon[i];
    currentSegment[1] = (i == length - 1 ? polygon[0] : polygon[i + 1]);

    if (ray_intersects_segment(currentSegment, point)) {
      intersectCount++;
    }
  }

  return intersectCount % 2 == 1;
}

export function	ray_intersects_segment(segment, P) {

  //for a full discussion of this function, please see: http://rosettacode.org/wiki/Ray-casting_algorithm

  //P : the point from which the ray starts
  var Py = P.y;
  var Px = P.x;

  var Ay, Ax, By, Bx;
  var m_red, m_blue;
  var epsilon = 0.001;

  //A : the end-point of the segment with the smallest y coordinate
  //    (A must be "above" B)
  //B : the end-point of the segment with the greatest y coordinate
  //    (B must be "below" A)

  // Note: this is different to the diagram on the web page above. On that page, Y increases in value as you go upwards. 
  // But on the canvas, Y increases in value as you go down. So you must "flip" those red and blue lines in the X-axis.

  if (segment[0].y > segment[1].y) {
    Bx = segment[0].x;
    By = segment[0].y;
    Ax = segment[1].x;
    Ay = segment[1].y;
  } else {
    Ax = segment[0].x;
    Ay = segment[0].y;
    Bx = segment[1].x;
    By = segment[1].y;
  }

  if ((Py == Ay) || (Py == By)) {
    Py = Py + epsilon;
  }
  if ((Py < Ay) || (Py > By)) {
    return false;
  } else if (Px > Math.max(Ax, Bx)) {
    return false;
  } else { 
    if (Px < Math.min(Ax, Bx)) {
      return true;
    } else {
      if (Ax != Bx) {
        m_red = (By - Ay) / (Bx - Ax);
      } else {
        m_red = Number.POSITIVE_INFINITY;
      }
      if (Ax != Px) {
        m_blue = (Py - Ay) / (Px - Ax);
      } else {
        m_blue = Number.POSITIVE_INFINITY;
      }
      if ((m_blue != Number.POSITIVE_INFINITY) && (m_red != Number.POSITIVE_INFINITY)) {
        if ((m_red > 0) && (m_blue < 0)) {
          return true;
        } else if ((m_red > 0) && (m_blue > m_red)) {
          return true;
        } else if ((m_red < 0) && (m_blue < 0) && (m_blue > m_red)) {
          return true;
        } else {
          return false;
        }
      } else if ((m_red == Number.POSITIVE_INFINITY) && (m_blue < 0)) {
        return true;
      } else if ((m_blue == Number.POSITIVE_INFINITY) && (m_red > 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
}
