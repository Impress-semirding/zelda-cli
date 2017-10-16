
const _ = require('lodash');

// const product = (v1, v2) => {

// }
module.exports = function createLinkPoints(ptFrom, ptTo, kHeight, ptN, weight, head) {
	const points = [], vecs = [], normals = [], offsetPoints1 = [], offsetPoints2 = [];
	let fx = ptFrom.x, fy = ptFrom.y, tx = ptTo.x, ty = ptTo.y;
	let len = Math.abs(tx - fx);
	let cx = (ptFrom.x + ptTo.x) / 2;
	let cy = (ptFrom.y + ptTo.y) / 2 - len * kHeight;
	let dx = tx - fx, dy = ty - fy;
	let x, y;
	for (let i = 0; i <= 1; i += 1 / ptN) {
		x = fx + dx * i;
		y = fy + dy * i - Math.abs(i * (1 - i) * dx * kHeight);
		points.push([x, y]);
	}
  //
  let p, pNext;
	for(let i = 0; i < points.length - 1; i++){
	  p = points[i];
	  pNext = points[i + 1];
	  dx = pNext[0] - p[0];
	  dy = pNext[1] - p[1];
	  len = Math.sqrt(dx * dx + dy * dy) || 0.00001;
	  x = dx / len;
	  y = dy / len;
		vecs.push([x, y])
	}
	//
	let normal, vec, vecNext;
	normals.push(-[vecs[0][1], vecs[0][0]]);
	for(let i = 0; i < vecs.length - 1; i++){
		vec = vecs[i];
		vecNext = vecs[i + 1];
		dx = vecNext[0] - vec[0];
		dy = vecNext[1] - vec[1];
		len = Math.sqrt(dx * dx + dy * dy) || 0.00001;
	  x = dx / len;
	  y = dy / len;
	  normals.push([x, y])
	}
	//
	let nx, ny;
	const lastPoint = [];
	let pl = points.length;
	let halfPL = Math.floor(pl / 2) 
	_.forEach(points, (p, i) => {
		if(i >= pl - 1) return;
		let ki = (1 + i / pl) / 3;
		normal = normals[i];
		x = p[0];
		y = p[1];
		nx = normal[0] * weight / 2 * ki;
		ny = normal[1] * weight / 2 * ki;
		offsetPoints1.push([x + nx, y + ny]);
		offsetPoints2.push([x - nx, y - ny]);
		//
		if( i === halfPL ){
			// offsetPoints1.push([x + nx * 4, y + ny * 4])
			// offsetPoints2.push([x - nx * 4, y - ny * 4])
		}
	});
	//
  const {phiWeight} = head;
  if (head && pl > 2){
  	let vec  = vecs[vecs.length - 1];
    dx = vec[0];
    dy = vec[1];
    let normal = normals[normals.length - 1];
    let nx = normal[0];
    let ny = normal[1];
    let endp = points[points.length - 2];
    let endx = endp[0];
    let endy = endp[1];
    let headLength = weight * phiWeight;
    let phi = head.phi;
    let ox =  headLength * nx;//(-dy * Math.sin(phi) + dx * Math.cos(phi));
    let oy =  headLength * ny;//( dx * Math.sin(phi) + dy * Math.cos(phi));
    let offsetPoint1 = [endx + ox, endy + oy];
    offsetPoints1.push(offsetPoint1);
    // points.push(offsetPoint1);
    //
    let endVec = vecs[vecs.length - 1];
    lastPoint.push([endx + endVec[0] * headLength * 1.5, endy + endVec[1] * headLength * 1.5]);
    // points.push([endx + endVec[0] * headLength, endy + endVec[1] * headLength]);
    //
    ox =  -headLength * nx//(-dy * Math.sin(-phi) + dx * Math.cos(-phi));
    oy =  -headLength * ny//( dx * Math.sin(-phi) + dy * Math.cos(-phi));
    let offsetPoint2 = [endx + ox, endy + oy];
    // points.push(offsetPoint2);
    offsetPoints2.push(offsetPoint2);
  }
  // if(Math.random() < 0.01) console.log(offsetPoints2, offsetPoints1.concat(offsetPoints2.reverse()));

	return _.flatten(_.concat(offsetPoints1, lastPoint, offsetPoints2.reverse()));
	// _.flatten(points);
}