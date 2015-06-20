//
//  ViewController.swift
//  PopAnimationDemo
//
//  Created by Emiaostein on 6/15/15.
//  Copyright (c) 2015 botai. All rights reserved.
//

import UIKit
import MMTweenAnimation

class ViewController: UIViewController {

    @IBOutlet weak var aniView: UIView!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


    @IBAction func tapAction(sender: UITapGestureRecognizer) {
        
        let y = 0.0
        let angleb = 0.0
        let anglee = (Double(720.0) * Double((M_PI / 180.0)))
        let fromValue = [
            y,
            angleb
        ]
        
        let tovalue = [
            y + 200.0,
            anglee
        ]
        
        CUAnimationFactory.shareInstance.animation(fromValue, aToValue: tovalue, aDuration: 2, easingFunctionType: EasingFunctionType.EasingInOutQuint) { [unowned self] (currentTime, duration, currentValues, animationTarget) -> Void in
            
            let y = CGFloat(currentValues[0])
            let angle = CGFloat(currentValues[1])
            
//            if currentTime < 1.0 {
//                 self.aniView.layer.transform = CATransform3DConcat(CATransform3DMakeTranslation(0, y, 0), CATransform3DMakeRotation(angle, 0, 0, 0))
//            } else {
//                let scale = currentTime
//                let angle = 0.0 + CGFloat((currentTime - 1.0) * M_PI / 180.0 * 360.0)
                self.aniView.layer.transform = CATransform3DConcat(
                    
                    CATransform3DMakeRotation(angle, 0, 0, 1),
                CATransform3DMakeTranslation(0, y, 0))
//                    CATransform3DMakeScale(scale, scale, 1))
//            }
        }
        
        CUAnimationFactory.shareInstance.completeBlock = { finished in
            
            self.aniView.layer.transform = CATransform3DConcat(
                
                CATransform3DMakeRotation(0, 0, 0, 1),
                CATransform3DMakeTranslation(0, 0, 0))
            println("finished")
        }
    }
}

