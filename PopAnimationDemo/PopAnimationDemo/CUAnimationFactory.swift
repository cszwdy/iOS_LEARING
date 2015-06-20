//
//  CUAnimationFactory.swift
//  PopAnimationDemo
//
//  Created by Emiaostein on 6/16/15.
//  Copyright (c) 2015 botai. All rights reserved.
//

import Foundation
import pop

enum EasingFunctionType {
    
    case
    EasingInBack,
    EasingOutBack,
    EasingInOutBack,
    EasingInBounce,
    EasingOutBounce,
    EasingInOutBounce,
    EasingInCirc,
    EasingOutCirc,
    EasingInOutCirc,
    EasingInCubic,
    EasingOutCubic,
    EasingInOutCubic,
    EasingInElastic,
    EasingOutElastic,
    EasingInOutElastic,
    EasingInExpo,
    EasingOutExpo,
    EasingInOutExpo,
    EasingInQuad,
    EasingOutQuad,
    EasingInOutQuad,
    EasingInQuart,
    EasingOutQuart,
    EasingInOutQuart,
    EasingInQuint,
    EasingOutQuint,
    EasingInOutQuint,
    EasingInSine,
    EasingOutSine,
    EasingInOutSine
}

class CUAnimationFactory: NSObject {
    
    typealias AnimationBlock = (currentTime: Double, duration: Double, currentValues: [Double], animationTarget: AnyObject) -> Void
    
    static let shareInstance = CUAnimationFactory()
    
    var completeBlock: (Bool -> Void)!
    
    func animation(aFromValue: [Double], aToValue: [Double], aDuration: Double, easingFunctionType: EasingFunctionType, aBlock: AnimationBlock) {
        
        self.pop_removeAnimationForKey("Preview")
        
        let function = easingFuntionWithType(easingFunctionType)
        
        let aAnimation = POPCustomAnimation {(target, animation: POPCustomAnimation!) -> Bool in
            
            let t = animation.currentTime - animation.beginTime
            let d = aDuration
            
            assert(aFromValue.count == aToValue.count, "fromValue。count != toValue.count")
            if t < d {
                var values = [Double]()
                for (index, value) in enumerate(aFromValue) {
                    let from = value
                    let to = aToValue[index]
                    let b = from
                    let c = to - from
                    let easFuncValue = function(t: t, b: b, c: c, d: d)
                    values.append(easFuncValue)
                }
                
                aBlock(currentTime: t, duration: d, currentValues: values, animationTarget: target)
                return true
            } else {
                println("end")
                return false
            }
        }
        
        aAnimation.completionBlock = {[unowned self] (animatoin, completed) -> Void in
            
            if let com = self.completeBlock {
                com(completed)
            }
        }
        
        self.pop_addAnimation(aAnimation, forKey: "Preview")
    }
}

typealias easingFunction = (t: Double, b: Double, c: Double, d: Double) -> Double

func easingFuntionWithType(easingFuntionType: EasingFunctionType) -> easingFunction {
    switch easingFuntionType {
    case .EasingInBack:
        return EasingInBack

    case .EasingOutBack:
        return EasingOutBack

    case .EasingInOutBack:
        return EasingInOutBack

    case .EasingInBounce:
        return EasingInBounce

    case .EasingOutBounce:
        return EasingOutBounce

    case .EasingInOutBounce:
        return EasingInOutBounce

    case .EasingInCirc:
        return EasingInCirc

    case .EasingOutCirc:
        return EasingOutCirc

    case .EasingInOutCirc:
        return EasingInOutCirc

    case .EasingInCubic:
        return EasingInCubic

    case .EasingOutCubic:
        return EasingOutCubic

    case .EasingInOutCubic:
        return EasingInOutCubic

    case .EasingInElastic:
        return EasingInElastic

    case .EasingOutElastic:
        return EasingOutElastic

    case .EasingInOutElastic:
        return EasingInOutElastic

    case .EasingInExpo:
        return EasingInExpo

    case .EasingOutExpo:
        return EasingOutExpo

    case .EasingInOutExpo:
        return EasingInOutExpo

    case .EasingInQuad:
        return EasingInQuad

    case .EasingOutQuad:
        return EasingOutQuad

    case .EasingInOutQuad:
        return EasingInOutQuad

    case .EasingInQuart:
        return EasingInQuart

    case .EasingOutQuart:
        return EasingOutQuart

    case .EasingInOutQuart:
        return EasingInOutQuart

    case .EasingInQuint:
        return EasingInQuint

    case .EasingOutQuint:
        return EasingOutQuint

    case .EasingInOutQuint:
        return EasingInOutQuint

    case .EasingInSine:
        return EasingInSine

    case .EasingOutSine:
        return EasingOutSine

    case .EasingInOutSine:
        return EasingInOutSine
    }
}

let EasingInBack =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    let s = 1.70158
    t /= d
    return c * t * t * ((s + 1) * t - s) + b
}

let EasingOutBack =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    let s = 1.70158
    t = t / d - 1
    return c * (t * t * ((s + 1) * t + s) + 1) + b
}

let EasingInOutBack =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    var s = 1.70158
    let k = 1.525
    t /= d / 2
    s *= k
    if (t < 1) {
        return c / 2 * (t * t * ((s + 1) * t - s)) + b
    }
    else {
        t -= 2;
        return c / 2 * (t * t * ((s + 1) * t + s) + 2) + b
    }
}
let EasingInBounce =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    return c - EasingOutBounce(d - t, 0, c, d) + b
}
let EasingOutBounce =  { (var t: Double, var b: Double, var c: Double, var d: Double) -> Double in

    let k = 2.75
    t /= d
    if (t) < (1.0 / k) {
        return c * (7.5625 * t * t) + b;
    }
    else if (t < (2 / k)) {
        t -= 1.5 / k;
        return c * (7.5625 * t * t + 0.75) + b;
    }
    else if (t < (2.5 / k)) {
        t -= 2.25 / k;
        return c * (7.5625 * t * t + 0.9375) + b;
    }
    else {
        t -= 2.625 / k;
        return c * (7.5625 * t * t + 0.984375) + b;
    }
}
let EasingInOutBounce =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    if (t < d * 0.5) {
        return EasingInBounce(t * 2, 0, c, d) * 0.5 + b;
    }
    else {
        return EasingOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
}
let EasingInCirc =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    t /= d
    return -c * (sqrt(1 - t * t) - 1) + b
}
let EasingOutCirc =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    t = t / d - 1
    return c * sqrt(1 - t * t) + b
}
let EasingInOutCirc =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    t /= (d/2)
    if (t <= 1) {
        return -c / 2 * (sqrt(1 - t * t) - 1) + b
    }
    else {
        t -= 2;
        return c / 2 * (sqrt(1 - t * t) + 1) + b
    }
}
let EasingInCubic =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    t /= d
    return c * t * t * t + b
}
let EasingOutCubic =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    t = t / d - 1
    return c * (t * t * t + 1) + b
}
let EasingInOutCubic =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    t /= d / 2
    if (t < 1) {
        return c / 2 * t * t * t + b
    }

    t -= 2
    return c / 2 * (t * t * t + 2) + b
}
let EasingInElastic =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    var s = 1.70158
    var p = 0.0
    var a = c
    if t == 0.0 {
        return b
    }
    t /= d
    if t == 1.0 {
        return b + c
    }
    if p == 0 {
        p = d * 0.3
    }
    if a < fabs(c) {
        a = c
        s = p / 4.0
    }
    else {
        s = p / (2 * 3.1419) * asin(c / a);
    }
    t--;
    return -(a * pow(2, 10 * t) * sin((t * d - s) * (2 * 3.1419) / p)) + b;

}
let EasingOutElastic =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    var s = 1.70158
    var p = 0.0
    var a = c
    if (t == 0) {
        return b;
    }
    t /= d
    if t == 1.0 {
        return b + c
    }
    if p == 0.0 {
        p = d * 0.3
    }
    if a < fabs(c) {
        a = c
        s = p / 4.0
    }
    else {
        s = p / (2 * 3.1419) * asin(c / a)
    }
    return a * pow(2, -10 * t) * sin((t * d - s) * (2 * 3.1419) / p) + c + b

}
let EasingInOutElastic =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    var s = 1.70158
    var p = 0.0
    var a = c
    if t == 0.0 {
        return b;
    }
    t /= d / 2
    if (t) == 2 {
        return b + c;
    }
    if p == 0.0 {
        p = d * (0.3 * 1.5)
    }
    if (a < fabs(c)) {
        a = c
        s = p / 4
    }
    else {
        s = p / (2 * 3.1419) * asin(c / a)
    }
    if (t < 1) {
        t--
        return -0.5 * (a * pow(2, 10 * t) * sin((t * d - s) * (2 * 3.1419) / p)) + b
    }
    t--
    return a * pow(2, -10 * t) * sin((t * d - s) * (2 * 3.1419) / p) * 0.5 + c + b

}
let EasingInExpo =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    return (t == 0.0) ? b : c * pow(2, 10 * (t / d - 1)) + b
}
let EasingOutExpo =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    return (t == d) ? b + c : c * (-pow(2, -10 * t / d) + 1) + b
}
let EasingInOutExpo =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    if (t == 0) {
        return b
    }
    else if (t == d) {
        return b + c
    }

    t /= d / 2

    if (t < 1) {
        return c / 2 * pow(2, 10 * (t - 1)) + b
    }
    else {
        return c / 2 * (-pow(2, -10 * --t) + 2) + b
    }
}
let EasingInQuad =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    t /= d
    return c * t * t + b
}
let EasingOutQuad =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    t /= d
    return -c * t * (t - 2) + b
}
let EasingInOutQuad =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    t /= d / 2
    if (t < 1) {
        return c / 2 * t * t + b
    }
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
}
let EasingInQuart =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    t /= d
    return c * t * t * t * t + b
}
let EasingOutQuart =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    t = t / d - 1
    return -c * (t * t * t * t - 1) + b
}
let EasingInOutQuart =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    t /= d / 2
    if (t < 1) {
        return c / 2 * t * t * t * t + b
    }

    t -= 2
    return -c / 2 * (t * t * t * t - 2) + b
}
let EasingInQuint =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    t /= d
    return c * t * t * t * t * t + b
}
let EasingOutQuint =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    t = t / d - 1
    return c * (t * t * t * t * t + 1) + b
}
let EasingInOutQuint =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    t /= d / 2
    if (t < 1) {
        return c / 2 * t * t * t * t * t + b
    }
    t -= 2;
    return c / 2 * (t * t * t * t * t + 2) + b
}
let EasingInSine =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in
    return -c * cos(t / d * (M_PI / 2)) + c + b
}
let EasingOutSine =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    return c * sin(t / d * (M_PI / 2)) + b
}
let EasingInOutSine =  { (var t: Double,var b: Double, var c: Double, var d: Double) -> Double in

    return -c / 2 * (cos(M_PI * t / d) - 1) + b
}
