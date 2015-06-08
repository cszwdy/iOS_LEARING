//
//  ViewController.swift
//  toolBarPopover
//
//  Created by Emiaostein on 6/5/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    var up = false

    @IBOutlet weak var barView: UIView!
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func tapAction(sender: UITapGestureRecognizer) {
        
//        let transition = CATransition()
//        transition.type = kCATransitionFade
//        transition.duration = 0.5
//        transition.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionEaseInEaseOut)
//        transition.subtype = kCATransitionFromBottom
//        transition.delegate = self
//
//        barView.exchangeSubviewAtIndex(0, withSubviewAtIndex: 1)
//        barView.layer.addAnimation(transition, forKey: "transiont")
//        barView.clipsToBounds = true
        barView.exchangeSubviewAtIndex(0, withSubviewAtIndex: 1)
       let top = barView.subviews.last as! UIView
        top.alpha = 0
        
        up = !up
        
        UIView.animateWithDuration(0.3, animations: { () -> Void in
            top.alpha = 1
//            self.barView.frame.origin.y += self.up ? -300 : 300
        }) { (finished) -> Void in
            UIView.animateWithDuration(0.5, animations: { () -> Void in
                
                
            })
            
        }
        
        UIView.animateWithDuration(0.5, animations: { () -> Void in
            
            
            
        })
    }
    
    override func animationDidStop(anim: CAAnimation!, finished flag: Bool) {
        
       
        
    }

}

