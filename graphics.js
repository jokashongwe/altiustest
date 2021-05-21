//crédit du code à webdesigner.com
var EPS = 0.0000001;
// point (x, y)
let Point = class Point {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

// Circle with center at (x,y) and radius r
let Circle = class Circle{
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

}

// A line segment (x1, y1), (x2, y2)
let LineSegment = class LineSegment{
    constructor(x1, y1, x2, y2) {
        var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        if (d < EPS) throw 'A point is not a line segment';
        this.x1 = x1; this.y1 = y1;
        this.x2 = x2; this.y2 = y2;
    }
}

// An infinite line defined as: ax + by = c
let Line = class Line{
    constructor(a, b, c) {
        this.a = a; this.b = b; this.c = c;
        // Normalize line for good measure
        if (Math.abs(b) < EPS) {
            c /= a; a = 1; b = 0;
        } else {
            a = (Math.abs(a) < EPS) ? 0 : a / b;
            c /= b; b = 1;
        }
    }
}

function isPointSegmentIntersection(p, segment){
    //addes by jkash 2021
    var x1 = segment.x1, y1 = segment.y1, x2 = segment.x2, y2 = segment.y2;
    var line = segmentToGeneralForm(x1, y1, x2, y2);
    var a = line.a, b = line.b, x = p.x, y = p.y, c =line.c;
    var res  = a * x + b * y - c
    return res == 0 || Math.abs(res) < EPS;
}

// Given a line in standard form: ax + by = c and a circle with 
// a center at (x,y) with radius r this method finds the intersection
// of the line and the circle (if any). 
function circleLineIntersection(circle, line) {

    var a = line.a, b = line.b, c = line.c;
    var x = circle.x, y = circle.y, r = circle.r;

    var A = a * a + b * b;
    var B = 2 * a * b * y - 2 * a * c - 2 * b * b * x;
    var C = b * b * x * x + b * b * y * y - 2 * b * c * y + c * c - b * b * r * r;

    // Use quadratic formula x = (-b +- sqrt(a^2 - 4ac))/2a to find the 
    // roots of the equation (if they exist).

    var D = B * B - 4 * A * C;
    var x1, y1, x2, y2;

    // Handle vertical line case with b = 0
    if (Math.abs(b) < EPS) {

        // Line equation is ax + by = c, but b = 0, so x = c/a
        x1 = c / a;

        // No intersection
        if (Math.abs(x - x1) > r) return [];

        // Vertical line is tangent to circle
        if (Math.abs((x1 - r) - x) < EPS || Math.abs((x1 + r) - x) < EPS)
            return [new Point(x1, y)];

        var dx = Math.abs(x1 - x);
        var dy = Math.sqrt(r * r - dx * dx);

        // Vertical line cuts through circle
        return [
            new Point(x1, y + dy),
            new Point(x1, y - dy)
        ];

        // Line is tangent to circle
    } else if (Math.abs(D) < EPS) {

        x1 = -B / (2 * A);
        y1 = (c - a * x1) / b;

        return [new Point(x1, y1)];

        // No intersection
    } else if (D < 0) {

        return [];

    } else {

        D = Math.sqrt(D);

        x1 = (-B + D) / (2 * A);
        y1 = (c - a * x1) / b;

        x2 = (-B - D) / (2 * A);
        y2 = (c - a * x2) / b;

        return [
            new Point(x1, y1),
            new Point(x2, y2)
        ];

    }

}

// Converts a line segment to a line in general form
function segmentToGeneralForm(x1, y1, x2, y2) {
    var a = y1 - y2;
    var b = x2 - x1;
    var c = x2 * y1 - x1 * y2;
    return new Line(a, b, c);
}

// Checks if a point 'pt' is inside the rect defined by (x1,y1), (x2,y2)
function pointInRectangle(pt, x1, y1, x2, y2) {
    var x = Math.min(x1, x2), X = Math.max(x1, x2);
    var y = Math.min(y1, y2), Y = Math.max(y1, y2);
    return x - EPS <= pt.x && pt.x <= X + EPS &&
        y - EPS <= pt.y && pt.y <= Y + EPS;
}

// Finds the intersection(s) of a line segment and a circle
function lineSegmentCircleIntersection(segment, circle) {

    var x1 = segment.x1, y1 = segment.y1, x2 = segment.x2, y2 = segment.y2;
    var line = segmentToGeneralForm(x1, y1, x2, y2);
    var pts = circleLineIntersection(circle, line);

    // No intersection
    if (pts.length === 0) return [];

    var pt1 = pts[0];
    var includePt1 = pointInRectangle(pt1, x1, y1, x2, y2);

    // Check for unique intersection
    if (pts.length === 1) {
        if (includePt1) return [pt1];
        return [];
    }

    var pt2 = pts[1];
    var includePt2 = pointInRectangle(pt2, x1, y1, x2, y2);

    // Check for remaining intersections
    if (includePt1 && includePt2) return [pt1, pt2];
    if (includePt1) return [pt1];
    if (includePt2) return [pt2];
    return [];

}