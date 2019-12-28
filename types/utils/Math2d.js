"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2d_1 = __importDefault(require("./Vector2d"));
var Math2d = (function () {
    function Math2d() {
    }
    Math2d.isPointInRect = function (P, rectPosition, width, height) {
        if (P.x < rectPosition.x)
            return false;
        if (P.y < rectPosition.y)
            return false;
        if (P.x > rectPosition.x + width)
            return false;
        if (P.y > rectPosition.y + height)
            return false;
        return true;
    };
    Math2d.isPointInCircle = function (P, C, radius) {
        return Vector2d_1.default.copy(C).substract(P).magnitude <= radius;
    };
    Math2d.isPointInTriangle = function (P, A, B, C) {
        var PA = Vector2d_1.default.copy(A).substract(P);
        var PB = Vector2d_1.default.copy(B).substract(P);
        var PC = Vector2d_1.default.copy(C).substract(P);
        var b1 = PA.crossProduct(PB) < 0;
        var b2 = PB.crossProduct(PC) < 0;
        var b3 = PC.crossProduct(PA) < 0;
        return b1 === b2 && b2 === b3;
    };
    Math2d.isPointInPolygon = function (P, points) {
        if (points.length < 3)
            return false;
        for (var i = 2; i < points.length; i++) {
            if (Math2d.isPointInTriangle(P, points[0], points[i - 1], points[i]))
                return true;
        }
        return false;
    };
    Math2d.isPointInLineSegment = function (P, lineSegment, deviation) {
        if (deviation === void 0) { deviation = 0.01; }
        var A = lineSegment[0];
        var B = lineSegment[1];
        var AP = Vector2d_1.default.copy(P).substract(A);
        var BP = Vector2d_1.default.copy(P).substract(B);
        var BA = Vector2d_1.default.copy(A).substract(B);
        if (AP.magnitude + BP.magnitude - BA.magnitude < deviation) {
            return true;
        }
        return false;
    };
    Math2d.isPointInPolyline = function (P, polyline, deviation) {
        if (deviation === void 0) { deviation = 0.01; }
        var length = polyline.length;
        if (length < 2)
            return false;
        for (var i = 1; i < length; i++) {
            if (Math2d.isPointInLineSegment(P, [polyline[i - 1], polyline[i]], deviation))
                return true;
        }
        return false;
    };
    Math2d.isIntersect = function (line1, line2) {
        var A = line1[0];
        var B = line1[1];
        var C = line2[0];
        var D = line2[1];
        if (Math2d.isPointInLineSegment(A, line2))
            return true;
        if (Math2d.isPointInLineSegment(B, line2))
            return true;
        if (Math2d.isPointInLineSegment(C, line1))
            return true;
        if (Math2d.isPointInLineSegment(D, line1))
            return true;
        var AC = Vector2d_1.default.copy(C).substract(A);
        var AD = Vector2d_1.default.copy(D).substract(A);
        var BC = Vector2d_1.default.copy(C).substract(B);
        var BD = Vector2d_1.default.copy(D).substract(B);
        var b1 = AC.crossProduct(AD) < 0;
        var b2 = BC.crossProduct(BD) < 0;
        if (b1 === b2)
            return false;
        var CA = Vector2d_1.default.copy(A).substract(C);
        var CB = Vector2d_1.default.copy(B).substract(C);
        var DA = Vector2d_1.default.copy(A).substract(D);
        var DB = Vector2d_1.default.copy(B).substract(D);
        var b3 = CA.crossProduct(CB) < 0;
        var b4 = DA.crossProduct(DB) < 0;
        if (b3 === b4)
            return false;
        return true;
    };
    Math2d.getLineIntersect = function (line1, line2) {
        var A = line1[0];
        var B = line1[1];
        var C = line2[0];
        var D = line2[1];
        var AB = Vector2d_1.default.copy(B).substract(A);
        var CD = Vector2d_1.default.copy(D).substract(C);
        var perpendicular = CD.perpendicular();
        var c = C.project(perpendicular);
        var a = A.project(perpendicular);
        var b = B.project(perpendicular);
        var ac = Vector2d_1.default.copy(c).substract(a);
        var cb = Vector2d_1.default.copy(b).substract(c);
        var magnitude = AB.magnitude * ac.magnitude / (ac.magnitude + cb.magnitude);
        var AP = AB.normalize().scale(magnitude);
        return AP.add(A);
    };
    Math2d.getLinePoint = function (line, ratio) {
        var len = line.length;
        if (len < 2)
            return null;
        if (ratio > 1)
            ratio = 1;
        if (ratio < 0)
            ratio = 0;
        var length = Math2d.getPolyLineLength(line) * ratio;
        var sum = 0;
        for (var i = 1; i < len; i++) {
            sum += line[i].distance(line[i - 1]);
            if (sum >= length) {
                var diff = sum - length;
                return Vector2d_1.default.copy(line[i]).add(Vector2d_1.default.copy(line[i - 1]).substract(line[i]).normalize().scale(diff));
            }
        }
        return new Vector2d_1.default(0, 0);
    };
    Math2d.getPolyLineLength = function (line) {
        var length = line.length;
        if (length < 2)
            return 0;
        var sum = 0;
        for (var i = 1; i < length; i++) {
            sum += line[i].distance(line[i - 1]);
        }
        return sum;
    };
    return Math2d;
}());
exports.Math2d = Math2d;
exports.default = Math2d;
